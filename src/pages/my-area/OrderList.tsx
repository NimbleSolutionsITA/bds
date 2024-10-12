import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Chip,
	Container,
	Divider,
	Grid2 as Grid,
	Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {SyntheticEvent, useEffect, useState} from "react";
import useAuth from "../../utils/useAuth";
import {useTranslation} from "next-i18next";
import {WooLineItem, WooOrder} from "../../types/woocommerce";
import Image from "next/image";
import PriceFormat from "../../components/PriceFormat";
import {Trans} from "react-i18next";
import {useRouter} from "next/router";
import SplitField from "../../components/SplitField";

const OrderList = () => {
	const { orders, getOrders } = useAuth();

	useEffect(() => {
		getOrders();
	}, [getOrders]);

	return (
		<Container maxWidth="sm">
			{(orders && orders.length > 0) ? (
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

const OrdersContainer = ({orders}: {orders: WooOrder[]}) => {
	const [expanded, setExpanded] = useState(orders[0].id);
	const handleChange =
		(panel: number) => (event: SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : 0);
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
	expanded: number
	handleChange: (panel: number) => (event: SyntheticEvent, isExpanded: boolean) => void
	order: WooOrder
}
const OrderItem = ({expanded, handleChange, order}: OrderItemProps) => {
	const { t } = useTranslation();
	const total = parseFloat(order.total) + ''
	const shippingTotal = (parseFloat(order.shipping_total) + parseFloat(order.shipping_tax))
	const discount = (parseFloat(order.discount_total) + parseFloat(order.discount_tax))
	const totalTax = parseFloat(order.total_tax)
	const orderDate = new Date(order.date_paid)
	const locale = useRouter().locale
	return (
		<Accordion
			expanded={expanded === order.id}
			onChange={handleChange(order.id)}
			sx={{my: '40px'}}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={`pane-${order.id}-bh-content`}
				id={`panel-${order.id}-bh-header`}
				sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}
			>
				<Typography sx={{ fontSize: '16px', fontWeight: 300 }}>
					<strong>#{order.id}</strong> {t("total")}: <strong><PriceFormat value={total} /></strong><OrderStatusChip status={order.status} /><br />
					<span style={{fontSize: '14px'}}>
						<Trans
							i18nKey="order-details"
							components={{
								1: <strong />, // For the date
								3: <strong />, // For the time
								5: <strong /> // For the payment method
							}}
							values={{
								date: orderDate.toLocaleDateString(),
								time: orderDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
								paymentMethod: order.payment_method_title
							}}
						/>
					</span>
				</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{backgroundColor: 'divider', padding: '20px'}}>
				<Grid container>
					<Grid size={{xs: 12}}>
						{order.line_items.map((item: any) => (
							<CartItem key={item.id} item={item} />
						))}
					</Grid>
					<Grid size={{xs: 12}}>
						<SplitField label={t('subtotal')} value={order.total} />
						<SplitField
							label={`${t('checkout.shipping')} (${order.shipping_lines[0].method_title})`}
							value={shippingTotal}
						/>
						{discount > 0 && (
							<SplitField label={t('discount')} value={-(discount)} />
						)}
						<Divider sx={{margin: {xs: '2px 0', md: '5px 0'}}} />
						<SplitField label={t('total')} value={total} labelWight={500} large />
						<div style={{fontWeight: 300, color: '#333333', fontSize: '11px', marginTop: '-8px'}}>
							(<Trans i18nKey="checkout.vat-included" components={[<PriceFormat key={0} value={totalTax} />]} />)
						</div>
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	)
}

const CartItem = ({item}: {item: WooLineItem}) => {
	const { t } = useTranslation();
	return (
		<Box sx={{
			display: 'flex',
			marginBottom: '20px'
		}}>

			<div style={{width: '45%', display: 'flex', flexDirection: 'column'}}>
				<Typography sx={{fontSize: '15px', fontWeight: 500, lineHeight: '16px'}}>
					{item.parent_name}
				</Typography>
				<div style={{flexGrow: 1}} />
				{item.meta_data.filter(v => v.key !== '_reduced_stock').map((v) => (
					<Typography sx={{fontSize: '12px', lineHeight: '16px', textWrap: 'nowrap'}} key={v.key}>
						{v.display_key.toUpperCase()}: {v.display_value}
					</Typography>
				))}
				<Typography sx={{fontSize: '12px', lineHeight: '16px'}}>
					{/* eslint-disable-next-line react/jsx-no-undef */}
					{t('quantity').toUpperCase()}: {item.quantity}
				</Typography>
			</div>
			<div style={{
				width: '10%',
				display: 'flex',
				alignItems: 'center',
				position: 'relative',
				backgroundColor: '#fff'
			}}>
				<Image
					src={item.image.src}
					alt={item.name}
					fill
					style={{objectFit: 'contain'}}

				/>
			</div>
			<Typography component="div" sx={{width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 500}}>
				<PriceFormat value={parseFloat(item.total) + parseFloat(item.total_tax)} />
			</Typography>
		</Box>
	)
}

const OrderStatusChip = ({status}: {status: WooOrder['status']}) => {
	const { t } = useTranslation();
	const statusMap = {
		'processing': 'warning',
		'completed': 'success',
		'pending': 'info',
		'failed': 'error',
		'refunded': undefined,
		'cancelled': undefined,
		'on-hold': 'info'
	} as const;
	return (
		<Chip
			label={t(`order-status.${status}`)}
			color={statusMap[status]}
			sx={{
				position: 'absolute',
				right: '50px'
			}}
		/>
	)
}

export default OrderList;