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
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import Loading from "../../components/Loading";
import PayPal from "../../icons/PayPal2";
import MotionPanel from "../../components/MotionPanel";
import {useTranslation} from "next-i18next";
import {PaymentControllers, Step as StepType} from "./CheckoutGrid";
import {PaymentElement} from "@stripe/react-stripe-js";
import {PayPalButtons} from "@paypal/react-paypal-js";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {useRouter} from "next/router";
import {destroyIntent} from "../../redux/cartSlice";
import {OnApproveData} from "@paypal/paypal-js";
import {gtagPurchase} from "../../utils/utils";

type PaymentProps = {
	isLoading: boolean
	editAddress: (tab: number) => void
	checkoutStep: StepType
	setCheckoutStep: Dispatch<SetStateAction<StepType>>
}

const Payment = ({isLoading, editAddress, checkoutStep, setCheckoutStep}: PaymentProps) => {
	const {
		cart: { cart_key: cartKey },
		stripe: { clientSecret, intentId } = { clientSecret: null },
		customer,
		customerNote
	} = useSelector((state: RootState) => state.cart);
	const shippingAddress = customer?.shipping ? `${customer.shipping.address_1}, ${customer.shipping.postcode}, ${customer.shipping.city} ${customer.shipping.state}, ${customer.shipping.country}` : null;
	const billingAddress = `${customer?.billing.address_1}, ${customer?.billing.postcode}, ${customer?.billing.city} ${customer?.billing.state}, ${customer?.billing.country}`;
	const { t } = useTranslation('common')
	const [paymentError, setPaymentError] = useState<string>();
	const [orderId, setOrderId] = useState<string>();
	const [payPalApproved, setPayPalApproved] = useState<false|OnApproveData>(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const payWithPayPal: PaymentControllers['payWithPayPal'] = async () => {
		try {
			const orderResponse = await fetch('/api/order/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					cartKey,
					customer,
					customerNote,
				})
			})
			const order = await orderResponse.json()

			if (!order.success || order.amount === 0) {
				throw new Error('Order creation failed')
			}

			if (order.paypalOrderId) {
				setOrderId(order.orderId)
				return order.paypalOrderId
			} else {
				throw new Error( order?.error);
			}
		}
		catch (error) {
			console.error(error);
			setPaymentError('Paypal payment error');
		}
	}


	const onApprove: PaymentControllers['onPayPalApprove'] = async (data) =>
		setPayPalApproved(data)

	const onPayPalError = (err: any) => setPaymentError(err.message ?? 'Paypal payment error')

	useEffect(() => {
		const onPayPalApprove = async (data: OnApproveData) => {
			try {
				const response = await fetch(`/api/order/checkout`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						paypalOrderId: data.orderID,
						intentId,
						cartKey,
						orderId,
						customer,
						customerNote
					}),
				});

				const orderData = await response.json();

				if (orderData.success) {
					gtagPurchase(orderData.order)
					dispatch(destroyIntent())
					await router.push({
						pathname: '/checkout/completed',
						query: {
							paid: true,
							cart_key: cartKey,
							email: customer?.billing?.email
						}
					});
				} else {
					throw new Error(orderData.error);
				}

			} catch (error) {
				setPaymentError(error instanceof Error ? error?.message : 'Paypal payment error')
			}
		}
		if(payPalApproved)
			onPayPalApprove(payPalApproved)
	}, [cartKey, customer, customerNote, dispatch, intentId, orderId, payPalApproved, router]);

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
							value={`${customer?.billing.email}`}
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
								label={t('checkout.bill-to')}
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
					checked={checkoutStep === 'PAYMENT_PAYPAL'}
					onChange={(e) => setCheckoutStep(e.target.checked ? 'PAYMENT_PAYPAL' : 'PAYMENT_STRIPE')}

				/>
			)} label={(
				<div style={{display: 'flex', alignItems: 'center'}}>
					{t('checkout.pay-with')}&nbsp;&nbsp;&nbsp;&nbsp;<PayPal sx={{fontSize: '80px'}} />&nbsp;&nbsp;
				</div>
			)} />
			<MotionPanel key="stripe" active={checkoutStep === 'PAYMENT_STRIPE'}>
				{clientSecret && (
					<PaymentElement
						id="payment-element"
						options={{
							layout: {
								type: 'accordion',
								radios: true,
								spacedAccordionItems: true,
								defaultCollapsed: false,
							},
							defaultValues: {
								billingDetails: {
									name: `${customer?.billing.first_name} ${customer?.billing.last_name}`,
									email: customer?.billing.email,
									phone: customer?.billing.phone,
									address: {
										line1: customer?.billing.address_1,
										city: customer?.billing.city,
										state: customer?.billing.state,
										postal_code: customer?.billing.postcode,
										country: customer?.billing.country,
									},
								}
							},
						}}
					/>
				)}
			</MotionPanel>
			<MotionPanel key="payPal" active={checkoutStep === 'PAYMENT_PAYPAL'}>
				<div style={{padding: '20px', border: '1px solid rgba(0,0,0,0.1)'}}>
					<PayPalButtons
						createOrder={payWithPayPal}
						onApprove={onApprove}
						onError={onPayPalError}
					/>
				</div>
			</MotionPanel>
			<PaymentErrorDialog error={paymentError} setError={setPaymentError} />
		</div>
	)
}

export const PaymentErrorDialog = ({ error, setError}: {error?: string, setError: Dispatch<SetStateAction<string|undefined>>}) => {
	const { t } = useTranslation('common')
	return (
		<Dialog
			open={!!error}
			onClose={() => setError(undefined)}
			aria-labelledby="stripe-payment-error"
		>
			<DialogTitle id="alert-dialog-title">
				{"Payment error"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{error}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => {
					setError(undefined);
				}}>
					{t('close')}
				</Button>
			</DialogActions>
		</Dialog>
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