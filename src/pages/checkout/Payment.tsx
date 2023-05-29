import {WooOrder} from "../../types/woocommerce";
import {
	TableContainer,
	Button,
	TableCell,
	Table,
	TableRow,
	TableBody,
	Typography,
	Switch,
	FormControlLabel
} from "@mui/material";
import {Dispatch, SetStateAction} from "react";
import PaypalButton from "./PaypalButton";
import StripeWrapper from "./StripeWrapper";
import Loading from "../../components/Loading";
import {motion} from "framer-motion";
import PayPal from "../../icons/PayPal2";
import {Stripe} from "@stripe/stripe-js";

type PaymentProps = {
	order?: WooOrder
	isLoading: boolean
	editAddress: (tab: number) => void
	setPaid: (transaction_id: number) => void
	checkoutStep: number
	setCheckoutStep: Dispatch<SetStateAction<number>>
	stripePromise:  Promise<Stripe | null>
}

const Payment = ({order, isLoading, editAddress, setPaid, checkoutStep, setCheckoutStep, stripePromise}: PaymentProps) => {
	const shippingAddress = order?.shipping.first_name ? `${order.shipping.address_1}, ${order.shipping.postcode}, ${order.shipping.city} ${order.shipping.state}, ${order.shipping.country}` : null;
	const billingAddress = `${order?.billing.address_1}, ${order?.billing.postcode}, ${order?.billing.city} ${order?.billing.state}, ${order?.billing.country}`;

	return (
		<div style={{width: '100%', position: 'relative'}}>
			<TableContainer sx={{padding: '10px 20px', border: '1px solid rgba(0,0,0,0.1)'}}>
				<Table>
					<TableBody sx={{
						'& td': { padding: '8px 0' },
						'& tr:last-child td': { border: 0 }
					}}>
						<RecapRow
							label="Contact"
							value={`${order?.billing.email}`}
							isLoading={isLoading}
							edit={() => editAddress(0)}
						/>
						<RecapRow
							label="Ship to"
							value={shippingAddress ?? billingAddress}
							isLoading={isLoading}
							edit={() => editAddress(shippingAddress ? 1 : 0)}
						/>
						{shippingAddress && (
							<RecapRow
								label="Bill to"
								value={billingAddress}
								isLoading={isLoading}
								edit={() => editAddress(0)}
							/>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Typography sx={{fontSize: '18px', fontWeight: 500, marginTop: '40px'}}>Pagamento</Typography>
			<Typography sx={{marginBottom: '20px'}}>Tutte le transazioni sono sicure e criptate.</Typography>
			<FormControlLabel labelPlacement="start" control={(
				<Switch
					checked={checkoutStep === 5}
					onChange={(e) => setCheckoutStep(e.target.checked ? 5 : 3)}

				/>
			)} label={(
				<div style={{display: 'flex', alignItems: 'center'}}>
					{'Voglio pagare con'}&nbsp;&nbsp;&nbsp;&nbsp;<PayPal sx={{fontSize: '80px'}} />&nbsp;&nbsp;
				</div>
			)} />
			<motion.div
				key="stripe"
				style={{ position: 'absolute', width: '100%', marginTop: '20px' }}
				initial={{ opacity: 0 }}
				animate={{
					opacity: checkoutStep !== 5 ? 1 : 0,
					pointerEvents: checkoutStep !== 5 ? 'auto' : 'none'
				}}
				transition={{ duration: 0.5 }}
			>
				<StripeWrapper
					order={order}
					isReadyToPay={checkoutStep === 4}
					stripePromise={stripePromise}
					setCheckoutStep={setCheckoutStep}
				/>
			</motion.div>
			<motion.div
				key="paypal"
				style={{ position: 'absolute', width: '100%', marginTop: '20px' }}
				initial={{ opacity: 0, height: 0 }}
				animate={{
					opacity: checkoutStep === 5 ? 1 : 0,
					pointerEvents: checkoutStep === 5 ? 'auto' : 'none'
				}}
				transition={{ duration: 0.5 }}
			>
				<PaypalButton
					orderTotal={order?.total}
					setPaid={setPaid}
					setError={() => setCheckoutStep(7)}
				/>
			</motion.div>

		</div>
	)
}

const EditButton = ({onClick}: {onClick: () => void}) => (
	<Button
		sx={{textTransform: 'none', textDecoration: 'underline', padding: 0, minWidth: 0, fontWeight: 300}}
		size="small"
		variant="text"
		color="primary"
		onClick={onClick}
	>
		Modifica
	</Button>
)

const RecapRow = ({label, value, edit, isLoading}: {label: string, value: string, isLoading: boolean, edit: () => void}) => (
	<TableRow>
		<TableCell sx={{color: 'rgba(0,0,0,0.4)', width: '80px'}}>{label}</TableCell>
		<TableCell sx={{fontWeight: 300}}>
			{isLoading ? <Loading fontSize="20px" /> : value}
		</TableCell>
		<TableCell sx={{width: '80px'}} align="right"><EditButton onClick={edit} /></TableCell>
	</TableRow>
)

export default Payment;