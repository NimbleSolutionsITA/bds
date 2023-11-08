import {useRouter} from "next/router";
import PaymentResult from "../../src/pages/checkout/PaymentResult";
import {loadStripe} from "@stripe/stripe-js";
import {useEffect, useState} from "react";
import {NEXT_API_ENDPOINT} from "../../src/utils/endpoints";
import {useDispatch} from "react-redux";
import {getLayoutProps} from "../../src/utils/wordpress_api";


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
	const dispatch = useDispatch()
	const {
		payment_intent,
		payment_intent_client_secret,
		redirect_status,
		paid
	} = router.query

	useEffect(() => {
		if (paid === 'true') {
			setResult('succeeded')
		}
		if (!stripePromise || !payment_intent || !payment_intent_client_secret || !redirect_status)
			return;



		const updateOrder = async () => {
			console.log('update order')
			return await fetch(NEXT_API_ENDPOINT + '/orders/' + orderId, {
				method: 'PUT',
				body: JSON.stringify({
					set_paid: true,
					transaction_id: payment_intent,
					meta_data: [
						{
							key: "_stripe_intent_id",
							value: payment_intent,
						}
					],
				}),
				headers: [["Content-Type", 'application/json']],
			})
				.then(() => {});
		}

		stripePromise.then(async (stripe) => {
			if (stripe) {
				stripe.retrievePaymentIntent(payment_intent_client_secret as string).then(({ paymentIntent }) => {
					if (paymentIntent?.status === 'succeeded') {
						updateOrder().then(() => {
							setResult('succeeded')
						})
					}
					else
						setResult(paymentIntent?.status ?? 'error')
				});
			}
		});
	}, [payment_intent, payment_intent_client_secret, redirect_status, orderId, dispatch]);

	return <PaymentResult isLoading={result === 'pending'} isSuccess={result === 'succeeded'} />
}
export async function getStaticProps({ params: {id}, locale }: { locale: 'it' | 'en', params: {id: string}}) {
	const [
		{ssrTranslations}
	] = await Promise.all([
		getLayoutProps(locale),
	]);
	return {
		props: {
			orderId: id,
			...ssrTranslations
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

