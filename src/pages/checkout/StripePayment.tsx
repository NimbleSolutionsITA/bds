import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {WooOrder} from "../../types/woocommerce";
import {useRouter} from "next/router";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Button} from "@mui/material";

type StripePaymentProps = {
	isReadyToPay: boolean,
	order?: WooOrder
	setCheckoutStep: Dispatch<SetStateAction<number>>
}

const StripePayment = ({order, isReadyToPay, setCheckoutStep}: StripePaymentProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState<string>();
	const router = useRouter();

	useEffect(() => {
		const handlePay = async () => {
			if (!stripe || !elements || !isReadyToPay || !order) {
				// Stripe.js has not yet loaded.
				// Make sure to disable form submission until Stripe.js has loaded.
				return;
			}

			setCheckoutStep(4.5);

			const result = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.href}/${order.id}`,
					receipt_email: order.billing.email,
				},
			});

			if (result.error) {
				setError(result.error.message);
			} else {
				// await router.push(`/checkout/${order.id}`);
			}
		}
		handlePay().then(r => r);
	}, [isReadyToPay, stripe, elements, order, setCheckoutStep]);


	return (
		<div>
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
							name: `${order?.billing.first_name} ${order?.billing.last_name}`,
							email: order?.billing.email,
							phone: order?.billing.phone,
							address: {
								line1: order?.billing.address_1,
								city: order?.billing.city,
								state: order?.billing.state,
								postal_code: order?.billing.postcode,
								country: order?.billing.country,
							},
						}
					},
				}}
			/>
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
						setCheckoutStep(3);
					}}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default StripePayment