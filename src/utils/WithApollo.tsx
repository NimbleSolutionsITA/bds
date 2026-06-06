import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import React from "react";

export default function WithApollo({ children }: { children: React.ReactNode }) {
	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
