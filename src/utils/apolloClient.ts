import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import {WORDPRESS_SITE_URL} from "./endpoints";

const link = createHttpLink({
	uri: WORDPRESS_SITE_URL + '/graphql',
	credentials: 'include',
});

export const client = new ApolloClient({
	cache: new InMemoryCache(),
	link
});