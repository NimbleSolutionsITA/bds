import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Dispatch, SetStateAction, useEffect} from "react";
import {WooOrder} from "../../types/woocommerce";
import {useRouter} from "next/router";

type StripePaymentProps = {
	isReadyToPay: boolean,
	order?: WooOrder
	setCheckoutStep: Dispatch<SetStateAction<number>>
}

const StripePayment = ({order, isReadyToPay, setCheckoutStep}: StripePaymentProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();

	useEffect(() => {
		const handlePay = async () => {
			if (!stripe || !elements || !isReadyToPay || !order) {
				// Stripe.js has not yet loaded.
				// Make sure to disable form submission until Stripe.js has loaded.
				return;
			}

			setCheckoutStep(4.5);

			await stripe.confirmPayment({
				elements,
				confirmParams: {
					// Make sure to change this to your payment completion page
					return_url: `${window.location.href}/${order.id}`,
					receipt_email: order.billing.email,
				},
			});

			// This point will only be reached if there is an immediate error when
			// confirming the payment. Otherwise, your customer will be redirected to
			// your `return_url`. For some payment methods like iDEAL, your customer will
			// be redirected to an intermediate site first to authorize the payment, then
			// redirected to the `return_url`.
			setCheckoutStep(4);
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
		</div>
	)
}

export default StripePayment