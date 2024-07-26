import {useQuery as useApolloQuery, gql, ApolloError, useMutation as useApolloMutation} from "@apollo/client";
import React, { createContext, useContext, ReactNode } from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {LoggedCustomer, WooOrder} from "../types/woocommerce";
import {useDispatch} from "react-redux";
import {setCustomerData, updateShippingCountry} from "../redux/cartSlice";
import {AppDispatch} from "../redux/store";

export interface User {
	id: string;
	databaseId: number;
	firstName: string;
	lastName: string;
	email: string;
	capabilities: string[];
}

interface AuthData {
	loggedIn: boolean;
	user?: User,
	loading: boolean;
	isUpdating: boolean;
	loginChecked: boolean;
	error?: ApolloError;
	customer?: LoggedCustomer,
	orders?: WooOrder[],
	newsletterStatus: boolean;
	updateCustomer: (data: any) => void;
	getOrders: () => void
	logOut: () => Promise<void>;
	unsubscribeNewsletter: () => void;
}

const DEFAULT_STATE: AuthData = {
	loggedIn: false,
	user: undefined,
	loading: false,
	isUpdating: false,
	loginChecked: false,
	error: undefined,
	newsletterStatus: false,
	unsubscribeNewsletter: async () => {},
	logOut: async () => {},
	updateCustomer: () => {},
	getOrders: () => {}
};

const AuthContext = createContext(DEFAULT_STATE);

export const GET_USER = gql`
    query getUser {
        viewer {
            id
            databaseId
            firstName
            lastName
            email
            capabilities
        }
    }
`;

const LOG_OUT = gql`
    mutation logOut {
        logout(input: {}) {
            status
        }
    }
`;

export function AuthProvider({ children }: { children: ReactNode }) {
	const dispatch = useDispatch<AppDispatch>();
	const [ loginChecked, setLoginChecked ] = React.useState(false);
	const { data: { viewer: user } = { viewer: null}, loading: getUserLoading, error: getUserError } = useApolloQuery(GET_USER, {
		onCompleted: (data) => {
			setLoginChecked(true);
		}
	});
	const [logOut, { loading: logoutLoading, error: logoutError, data: logoutData }] = useApolloMutation(LOG_OUT, {
		refetchQueries: [
			{ query: GET_USER }
		],
	});

	const loggedIn = Boolean(user);

	const getCustomerQuery = useQuery<LoggedCustomer|null>(
		['get-customer', user?.databaseId],
		async () => {
			const response = await fetch(`/api/customer/${user?.databaseId}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const {customer} = await response.json();
			const { billing, shipping } = customer;
			dispatch(setCustomerData({ shipping, billing }))
			dispatch(updateShippingCountry({ country: shipping.country ?? billing.country ?? 'IT' }))
			return customer;
		},
		{
			enabled: !!user?.databaseId,
			initialData: null
		}
	)
	const getCustomerOrders = useQuery(
		['get-customer-orders', user?.databaseId],
		async () => {
			const response = await fetch(`/api/customer/${user?.databaseId}/orders`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		},
		{
			enabled: false,
			initialData: {
				orders: []
			}
		}
	)
	const getNewsletterStatusQuery = useQuery(
		['check-newsletter', user?.databaseId],
		async () => {
			const response = await fetch(`/api/customer/newsletter?email=${user?.email}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			});
			if (!response.ok) {
				return false;
			}
			const { subscribed } = await response.json();
			return subscribed as boolean;
		},
		{
			enabled: !!user?.databaseId,
			initialData: false
		}
	)
	const unsubscribeNewsletter = useMutation(
		['unsubscribe-newsletter', user?.databaseId],
		async () => {
			const response = await fetch(`/api/customer/newsletter`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: user?.email })
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		},
		{
			onSuccess: async () => {
				await getNewsletterStatusQuery.refetch();
			}
		}
	)
	const updateCustomerMutation = useMutation(
		['update-customer', user?.databaseId],
		async (data: any) => {
			const response = await fetch(`/api/customer/${user?.databaseId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		},
		{
			onSuccess: async () => {
				await getCustomerQuery.refetch();
			}

		}
	)

	const value = {
		loggedIn,
		user,
		newsletterStatus: getNewsletterStatusQuery.data,
		loading: getUserLoading || logoutLoading,
		isUpdating: updateCustomerMutation.isLoading,
		loginChecked,
		error: logoutError || getUserError,
		customer: getCustomerQuery.data || undefined,
		orders: getCustomerOrders.data.orders,
		updateCustomer: updateCustomerMutation.mutate,
		getOrders: getCustomerOrders.refetch,
		logOut: async () => { await logOut() },
		unsubscribeNewsletter: unsubscribeNewsletter.mutate
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext);

export default useAuth;