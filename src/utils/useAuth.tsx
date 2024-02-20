import {useQuery, gql, ApolloError, useMutation} from "@apollo/client";
import React, { createContext, useContext, ReactNode } from "react";

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
	error?: ApolloError;
	logOut: () => Promise<void>;
}

const DEFAULT_STATE: AuthData = {
	loggedIn: false,
	user: undefined,
	loading: false,
	error: undefined,
	logOut: async () => {},
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
	const { data: { viewer: user} = { viewer: null}, loading: getUserLoading, error: getUserError } = useQuery(GET_USER);
	const [logOut, { loading: logoutLoading, error: logoutError, data: logoutData }] = useMutation(LOG_OUT, {
		refetchQueries: [
			{ query: GET_USER }
		],
	});

	const loggedIn = Boolean(user);

	const value = {
		loggedIn,
		user,
		loading: getUserLoading || logoutLoading,
		error: logoutError || getUserError,
		logOut: async () => {
			await logOut();
		},
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext);

export default useAuth;