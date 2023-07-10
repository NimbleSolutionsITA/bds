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
import Loading from "../../components/Loading";
import PayPal from "../../icons/PayPal2";
import MotionPanel from "../../components/MotionPanel";
import StripePayment from "./StripePayment";
import {OrderResponseBody} from "@paypal/paypal-js";
import {useTranslation} from "next-i18next";

type PaymentProps = {
	order?: WooOrder
	isLoading: boolean
	editAddress: (tab: number) => void
	setPaid: (payPal: OrderResponseBody) => void
	checkoutStep: number
	setCheckoutStep: Dispatch<SetStateAction<number>>
}

const Payment = ({order, isLoading, editAddress, setPaid, checkoutStep, setCheckoutStep}: PaymentProps) => {
	const shippingAddress = order?.shipping.first_name ? `${order.shipping.address_1}, ${order.shipping.postcode}, ${order.shipping.city} ${order.shipping.state}, ${order.shipping.country}` : null;
	const billingAddress = `${order?.billing.address_1}, ${order?.billing.postcode}, ${order?.billing.city} ${order?.billing.state}, ${order?.billing.country}`;
	const { t } = useTranslation('common')

	return (
		<div style={{width: '100%', position: 'relative'}}>
			<TableContainer sx={{padding: '10px 20px', border: '1px solid rgba(0,0,0,0.1)'}}>
				<Table>
					<TableBody sx={{
						'& td': { padding: '8px 0' },
						'& tr:last-child td': { border: 0 }
					}}>
						<RecapRow
							label={t('checkout.contact')}
							value={`${order?.billing.email}`}
							isLoading={isLoading}
							edit={() => editAddress(0)}
						/>
						<RecapRow
							label={t('checkout.ship-to')}
							value={shippingAddress ?? billingAddress}
							isLoading={isLoading}
							edit={() => editAddress(shippingAddress ? 1 : 0)}
						/>
						{shippingAddress && (
							<RecapRow
								label={t('common.bill-to')}
								value={billingAddress}
								isLoading={isLoading}
								edit={() => editAddress(0)}
							/>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Typography sx={{fontSize: '18px', fontWeight: 500, marginTop: '40px'}}>{t('checkout.payment')}</Typography>
			<Typography sx={{marginBottom: '20px'}}>{t('checkout.secured')}</Typography>
			<FormControlLabel labelPlacement="start" control={(
				<Switch
					checked={checkoutStep === 5}
					onChange={(e) => setCheckoutStep(e.target.checked ? 5 : 3)}

				/>
			)} label={(
				<div style={{display: 'flex', alignItems: 'center'}}>
					{t('checkout.pay-with')}&nbsp;&nbsp;&nbsp;&nbsp;<PayPal sx={{fontSize: '80px'}} />&nbsp;&nbsp;
				</div>
			)} />
			<MotionPanel key="stripe" active={checkoutStep !== 5}>
				<StripePayment
					order={order}
					isReadyToPay={checkoutStep === 4}
					setCheckoutStep={setCheckoutStep}
				/>
			</MotionPanel>
			<MotionPanel key="paypal" active={checkoutStep === 5}>
				<PaypalButton
					orderTotal={order?.total}
					setPaid={setPaid}
					setError={() => setCheckoutStep(7)}
				/>
			</MotionPanel>
		</div>
	)
}

const EditButton = ({onClick}: {onClick: () => void}) => {
	const { t } = useTranslation('common')
	return (
		<Button
			sx={{textTransform: 'none', textDecoration: 'underline', padding: 0, minWidth: 0, fontWeight: 300}}
			size="small"
			variant="text"
			color="primary"
			onClick={onClick}
		>
			{t('edit')}
		</Button>
	)
}

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