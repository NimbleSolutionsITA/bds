import {useState, useEffect, Dispatch, SetStateAction} from "react";
import {Elements} from "@stripe/react-stripe-js";
import StripePayment from "./StripePayment";
import {Stripe} from "@stripe/stripe-js";
import {WooOrder} from "../../types/woocommerce";

type StripeCheckoutProps = {
	order?: WooOrder
	isReadyToPay: boolean
	stripePromise:  Promise<Stripe | null>
	setCheckoutStep: Dispatch<SetStateAction<number>>
}

const StripeWrapper = ({order, isReadyToPay, stripePromise, setCheckoutStep}: StripeCheckoutProps) => {
	const [clientSecret, setClientSecret] = useState('');
	const [paymentIntentId, setPaymentIntentId] = useState('');
	const orderTotal = parseFloat(order?.total || '0');
	useEffect(() => {
		// Create PaymentIntent as soon as the page loads using our local API
		if(order && orderTotal > 0) {
			fetch('api/orders/stripe-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: orderTotal,
					payment_intent_id: paymentIntentId,
					order_id: order.id,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					setClientSecret(data.client_secret)
					setPaymentIntentId(data.payment_intent_id)
				});
		}
	}, [orderTotal, order, paymentIntentId]);

	return clientSecret && stripePromise ? (
		<Elements
			options={{
				clientSecret,
				appearance: {
					theme: 'stripe',
					labels: 'floating',
					variables: {
						fontWeightNormal: '500',
						borderRadius: '0',
						colorPrimary: '#000',
						colorIconTabSelected: 'rgba(0, 0, 0, 0.1)',
						spacingGridRow: '16px',
						focusBoxShadow: 'none',
						fontFamily: 'Apercu, sans-serif',
					},
					rules: {

					}
				},
			}}
			stripe={stripePromise}
		>
			<StripePayment order={order} isReadyToPay={isReadyToPay} setCheckoutStep={setCheckoutStep} />
		</Elements>
    ) : <span />;
}

export default StripeWrapper;