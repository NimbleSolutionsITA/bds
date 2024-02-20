import useMyArea from "./useMyArea";

const OrderList = () => {
	const { customer, orders } = useMyArea();
	console.log(orders)
	return (
		<div>
			{orders.map((order: any) => (
				<div key={order.id}>
					{order.id} - {order.date}
				</div>
			))}
		</div>
	)
}

export default OrderList;