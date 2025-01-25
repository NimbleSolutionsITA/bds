import React, {createContext, useContext, ReactNode, useEffect} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {LoggedCustomer, WooOrder} from "../types/woocommerce";
import {useDispatch} from "react-redux";
import {initCart} from "../redux/cartSlice";
import {AppDispatch} from "../redux/store";
import axios from "axios";
import {WORDPRESS_SITE_URL} from "./endpoints";
import {closeLogInDrawer} from "../redux/layoutSlice";

export interface User {
	user_id: string;
	first_name: string;
	last_name: string;
	display_name: string;
	email: string;
}

interface AuthData {
	loggedIn: boolean;
	user?: User,
	loading: boolean;
	isUpdating: boolean;
	loginChecked: boolean;
	error: Error | null;
	customer?: LoggedCustomer,
	orders?: WooOrder[],
	newsletterStatus: boolean;
	updateCustomer: (data: any) => void;
	getOrders: () => void
	logOut: () => Promise<any>;
	unsubscribeNewsletter: () => void;
	subscribeNewsletter: (email: string) => Promise<{ subscribed: boolean, error: string | null }>;
	logIn: (variables: any) => Promise<any>;
	logInError: Error | null;
	logInLoading: boolean;
}

const DEFAULT_STATE: AuthData = {
	loggedIn: false,
	user: undefined,
	loading: false,
	isUpdating: false,
	loginChecked: false,
	error: null,
	newsletterStatus: false,
	unsubscribeNewsletter: async () => {},
	subscribeNewsletter: async () => ({subscribed: false, error: null}),
	logOut: async () => null as unknown as Promise<any>,
	updateCustomer: () => {},
	getOrders: () => {},
	logIn: async () => {},
	logInError: null,
	logInLoading: false
};

const AuthContext = createContext(DEFAULT_STATE);

export function AuthProvider({ children }: { children: ReactNode }) {
	const dispatch = useDispatch<AppDispatch>();
	const [ loginChecked, setLoginChecked ] = React.useState(false);
	const [user, setUser] = React.useState<User>();
	const loggedIn = Boolean(user);

	const { mutateAsync: logIn, isPending: logInLoading, error: logInError } = useMutation({
		mutationKey: ['login'],
		mutationFn: async ({ username, password}: {username: string, password: string}) => {
			const response = await axios({
				method: "POST",
				url: `${WORDPRESS_SITE_URL}/wp-json/cocart/v2/login`,
				headers: {
					"Content-Type": "application/json"
				},
				auth: {
					username,
					password
				}
			})
			if (response.status !== 200) {
				throw new Error('Invalid credentials');
			}
			const { data } = response;
			localStorage.setItem('cocart_key', btoa(username + ':' + password));
			setUser(data)
			setLoginChecked(true);
			dispatch(initCart());
			dispatch(closeLogInDrawer())
		},
		onError: (error) => {
			console.error(error);
			localStorage.removeItem('cocart_key');
			dispatch(initCart());
		}
	})

	const { mutateAsync: logOut, isPending: logOutLoading, error: logOutError } = useMutation({
		mutationKey: ['login'],
		mutationFn: async () => {
			const response = await axios({
				method: "POST",
				url: `${WORDPRESS_SITE_URL}/wp-json/cocart/v2/logout`,
				headers: {
					"Content-Type": "application/json"
				}
			})
			if (response.status !== 200) {
				throw new Error('Something went wrong');
			}
			setUser(undefined)
			localStorage.removeItem('cocart_key');
			dispatch(initCart());
		}
	})

	const getCustomerQuery = useQuery<LoggedCustomer|null>({
		queryKey: ['get-customer', user?.user_id],
		queryFn: async () => {
			const response = await fetch(`/api/customer/${user?.user_id}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const {customer} = await response.json();
			return customer;
		},
		enabled: !!user?.user_id,
		initialData: null
	})
	const getCustomerOrders = useQuery({
		queryKey: ['get-customer-orders', user?.user_id],
		queryFn: async () => {
			const response = await fetch(`/api/customer/${user?.user_id}/orders`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		},
		enabled: false,
		initialData: {
			orders: []
		}
	})
	const getNewsletterStatusQuery = useQuery({
		queryKey: ['check-newsletter', user?.user_id],
		queryFn: async () => {
			if (!user?.email) return false;
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
		enabled: !!user?.user_id,
		initialData: false
	})
	const unsubscribeNewsletter = useMutation({
		mutationFn: async () => {
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
		onSuccess: async () => {
			await getNewsletterStatusQuery.refetch();
		}
	})
	const subscribeNewsletter = useMutation({
		mutationFn: async (email: string) => {
			const response = await fetch(`/api/customer/newsletter`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});
			const {subscribed, error} = await response.json();
			return {subscribed, error: error?.title};
		},
		onSuccess: async () => {
			await getNewsletterStatusQuery.refetch();
		}
	})
	const updateCustomerMutation = useMutation({
		mutationFn: async (data: any) => {
			const response = await fetch(`/api/customer/${user?.user_id}`, {
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
		onSuccess: async () => {
			await getCustomerQuery.refetch();
		}

	})

	useEffect(() => {
		if (!loginChecked) {
			const key = localStorage.getItem('cocart_key');
			if (key) {
				const [username, password] = atob(key).split(':');
				logIn({username, password});
			} else {
				dispatch(initCart());
				setLoginChecked(true);
			}
		}
	}, [logIn, loginChecked]);

	const value = {
		loggedIn,
		user,
		newsletterStatus: getNewsletterStatusQuery.data,
		loading: logInLoading || logOutLoading,
		isUpdating: updateCustomerMutation.isPending,
		loginChecked,
		error: logOutError || logInError,
		customer: getCustomerQuery.data || undefined,
		refetchCustomer: getCustomerQuery.refetch,
		orders: getCustomerOrders.data.orders,
		updateCustomer: updateCustomerMutation.mutate,
		getOrders: getCustomerOrders.refetch,
		logOut,
		logIn,
		logInError,
		logInLoading,
		unsubscribeNewsletter: unsubscribeNewsletter.mutate,
		subscribeNewsletter: subscribeNewsletter.mutateAsync
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext);

export default useAuth;