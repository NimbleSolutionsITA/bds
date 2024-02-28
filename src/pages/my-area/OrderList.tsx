import useMyArea from "./useMyArea";
import {Accordion, AccordionDetails, AccordionSummary, Container, Grid, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {SyntheticEvent, useState} from "react";

const OrderList = () => {
	const { orders } = useMyArea();

	console.log(orders)
	return (
		<Container maxWidth="md">
			{orders?.length > 0 ? (
				<OrdersContainer orders={orders} />
			) : (
				<div>
					<Typography>
						No orders found
					</Typography>
				</div>
			)}
		</Container>
	)
}

const OrdersContainer = ({orders}: {orders: any}) => {
	const [expanded, setExpanded] = useState<string | false>(orders[0].id);
	const handleChange =
		(panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};
	return (
		<>
			{orders.map((order: any, index: number) => (
				<OrderItem
					key={order.id}
					expanded={expanded}
					handleChange={handleChange}
					order={order}
				/>
			))}
		</>
	)

}

type OrderItemProps = {
	expanded: string | false
	handleChange: (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => void
	order: any
}
const OrderItem = ({expanded, handleChange, order}: OrderItemProps) => {
	return (
		<Accordion expanded={expanded === order.id} onChange={handleChange(order.id)}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={`pane-${order.id}-bh-content`}
				id={`panel-${order.id}-bh-header`}
			>
				<Typography sx={{ fontSize: '20px' }}>
					Ordine {order.id} del {new Date(order.date_created).toLocaleDateString()}
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{backgroundColor: 'divider'}}>
				<Grid container>
					<Grid item xs={12} sm={6}>
						{order.line_items.map((item: any) => (
							<div key={item.id}>
								<Typography>
									{item.name}
								</Typography>
								<Typography>
									{item.quantity}
								</Typography>
							</div>
						))}
					</Grid>
					<Grid item xs={12} sm={6}>
						{order.shipping_lines[0].method_title}<br />
						{order.shipping_total}<br />
						{order.total_tax}<br />
						{order.total}
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	)
}

export default OrderList;