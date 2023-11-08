import {useState, useEffect, ReactNode} from "react";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {WooOrder} from "../../types/woocommerce";
import {stripeTheme} from "../../theme/theme";

type StripeCheckoutProps = {
	order?: WooOrder
	children: ReactNode
}


const stripePublicKey = process.env.NODE_ENV === 'production' ?
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_PRODUCTION :
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_SANDBOX;

const stripePromise = loadStripe(stripePublicKey ?? '');

const StripeWrapper = ({order, children}: StripeCheckoutProps) => {
	const [clientSecret, setClientSecret] = useState('');
	const [paymentIntentId, setPaymentIntentId] = useState('');
	const [total, setTotal] = useState(0);
	const orderTotal = parseFloat(order?.total || '0');
	useEffect(() => {
		// Create PaymentIntent as soon as the page loads using our local API
		if(order?.id && orderTotal > 0) {
			if (orderTotal !== total) {
				console.log('total stripe intent updated', orderTotal, total)
				fetch('/api/orders/stripe-intent', {
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
						setTotal(orderTotal)
					});
			}
		}
	}, [orderTotal, order?.id, paymentIntentId, total]);

	return clientSecret ? (
		<Elements
			options={{
				appearance: stripeTheme,
			}}
			stripe={stripePromise}
		>
			{children}
		</Elements>
	) : null;
}

export default StripeWrapper;