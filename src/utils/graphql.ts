import { useMutation } from "@tanstack/react-query";
import { WORDPRESS_SITE_URL } from "./endpoints";

/**
 * Esegue una richiesta GraphQL verso WPGraphQL. Sostituisce @apollo/client,
 * usato solo per 3 mutation di autenticazione.
 */
export async function graphqlRequest<TData = any>(
	query: string,
	variables?: Record<string, any>
): Promise<TData> {
	const response = await fetch(WORDPRESS_SITE_URL + "/graphql", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ query, variables }),
	});
	const json = await response.json();
	if (json.errors?.length) {
		throw new Error(json.errors[0].message);
	}
	return json.data as TData;
}

/**
 * Hook che imita la forma di `useMutation` di Apollo:
 * `[mutate, { data, loading, error }]`, dove `mutate({ variables })`
 * restituisce una Promise. Permette di rimuovere Apollo lasciando i
 * componenti pressoché invariati.
 */
export function useGraphQLMutation<
	TData = any,
	TVars extends Record<string, any> = Record<string, any>
>(query: string) {
	const mutation = useMutation<TData, Error, TVars>({
		mutationFn: (variables: TVars) => graphqlRequest<TData>(query, variables),
	});

	const mutate = (options?: { variables?: TVars }) =>
		mutation.mutateAsync((options?.variables ?? ({} as TVars)));

	return [
		mutate,
		{ data: mutation.data, loading: mutation.isPending, error: mutation.error },
	] as const;
}
