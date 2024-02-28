import useAuth from "../../utils/useAuth";
import {useMutation, useQuery} from "@tanstack/react-query";
import {LoggedCustomer} from "../../types/woocommerce";

const useMyArea = () => {
	const { user } = useAuth();
	const getCustomerQuery = useQuery<{ customer: LoggedCustomer|null }>(
		['get-customer', user?.databaseId],
		async () => {
			const response = await fetch(`/api/customer/${user?.databaseId}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		},
		{
			enabled: !!user?.databaseId,
			initialData: {
				customer: null
			}
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
			enabled: !!user?.databaseId,
			initialData: {
				orders: []
			}
		}
	)
	const updateCustomerMutation = useMutation(
		['update-customer', user?.databaseId],
		async (data: any) => {
			const response = await fetch(`/api/customer/${user?.databaseId}`, {
				method: 'PUT',
				body: JSON.stringify(data)
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		}
	)

	return {
		customer: getCustomerQuery.data.customer,
		orders: getCustomerOrders.data.orders,
		updateCustomer: updateCustomerMutation.mutate,
	}
}

export default useMyArea;