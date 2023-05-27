import {useRouter} from "next/router";
import PaymentResult from "../../src/pages/checkout/PaymentResult";
import {loadStripe} from "@stripe/stripe-js";
import {useEffect, useState} from "react";
import {NEXT_API_ENDPOINT} from "../../src/utils/endpoints";


export type CheckoutResultProps = {
	orderId: string
}

const stripePublicKey = process.env.NODE_ENV === 'production' ?
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_PRODUCTION :
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_SANDBOX;

const stripePromise = loadStripe(stripePublicKey ?? '');

export default function CheckoutResult({ orderId }: CheckoutResultProps) {
    const [result, setResult] = useState<string>('pending')
	const router = useRouter()

	const {
		payment_intent,
		payment_intent_client_secret,
		redirect_status,
	} = router.query

	useEffect(() => {
		if (!stripePromise || !payment_intent || !payment_intent_client_secret || !redirect_status)
			return;

		const updateOrder = async () => {
			console.log('update order')
			return await fetch(NEXT_API_ENDPOINT + '/orders/' + orderId, {
				method: 'PUT',
				body: JSON.stringify({
					set_paid: true,
					transaction_id: payment_intent,
				}),
				headers: [["Content-Type", 'application/json']],
			})
				.then(() => {});
		}

		stripePromise.then(async (stripe) => {
			if (stripe) {
				stripe.retrievePaymentIntent(payment_intent_client_secret as string).then(({ paymentIntent }) => {
					console.log('paymentIntent', paymentIntent)
					if (paymentIntent?.status === 'succeeded') {
						updateOrder().then(() => setResult('succeeded'))
					}
					else
						setResult(paymentIntent?.status ?? 'error')
				});
			}
		});
	}, [stripePromise]);

	return <PaymentResult isLoading={result === 'pending'} isSuccess={result === 'succeeded'} />
}
export async function getStaticProps({ locale, params: {id} }: { locales: string[], locale: 'it' | 'en', params: {id: string}}) {
	const [
	] = await Promise.all([
	]);
	return {
		props: {
			orderId: id
		},
		revalidate: 10
	}
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	};
}

