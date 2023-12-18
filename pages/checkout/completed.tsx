import {useRouter} from "next/router";
import PaymentResult from "../../src/pages/checkout/PaymentResult";
import {useEffect, useState} from "react";
import {NEXT_API_ENDPOINT, WORDPRESS_SITE_URL} from "../../src/utils/endpoints";
import {useDispatch} from "react-redux";
import {getLayoutProps} from "../../src/utils/wordpress_api";
import {AppDispatch} from "../../src/redux/store";

export default function CheckoutResult() {
    const [result, setResult] = useState<string>('pending')
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const {
		payment_intent,
		paid,
		cart_key
	} = router.query

	useEffect(() => {
		if (paid === 'true') {
			setResult('succeeded')
			return;
		}
		if (!payment_intent) {
			return;
		}

		const confirmOrder = async () => {
			const response = await fetch(NEXT_API_ENDPOINT + '/order/checkout', {
				method: 'PUT',
				headers: [["Content-Type", 'application/json']],
				body: JSON.stringify({
					intentId: payment_intent,
					cartKey: cart_key,
				})
			})
			const result = await response.json()
			if (result.success) {
				setResult('succeeded')
			}
		}

		confirmOrder()

	}, [cart_key, dispatch, paid, payment_intent]);

	useEffect(() => {
		const destroyCart = async () => {
			await fetch(
				WORDPRESS_SITE_URL + '/wp-json/cocart/v2/cart/clear?cart_key=' + cart_key,
				{ method: 'POST'}
			)
		}
		if (result === 'succeeded') {
			destroyCart()
		}
	}, [cart_key, result]);


	return <PaymentResult isLoading={result === 'pending'} isSuccess={result === 'succeeded'} />
}
export async function getStaticProps({ locale }: { locale: 'it' | 'en', params: {id: string}}) {
	const [
		{ssrTranslations}
	] = await Promise.all([
		getLayoutProps(locale),
	]);
	return {
		props: {
			...ssrTranslations
		},
		revalidate: 10
	}
}

