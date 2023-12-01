import {useRouter} from "next/router";
import PaymentResult from "../../src/pages/checkout/PaymentResult";
import {useEffect, useState} from "react";
import {NEXT_API_ENDPOINT} from "../../src/utils/endpoints";
import {useDispatch, useSelector} from "react-redux";
import {getLayoutProps} from "../../src/utils/wordpress_api";
import {AppDispatch, RootState} from "../../src/redux/store";
import {fetchCartData} from "../../src/redux/cartSlice";

export default function CheckoutResult() {
	const cartKey = useSelector((state: RootState) => state.cart.cart.cart_key);
    const [result, setResult] = useState<string>('pending')
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const {
		payment_intent,
		paid
	} = router.query

	useEffect(() => {
		if (paid === 'true') {
			setResult('succeeded')
			return;
		}
		if (payment_intent && !cartKey) {
			dispatch(fetchCartData());
			return
		}
		if (!payment_intent && !cartKey)
			return;

		const confirmOrder = async () => {
			const response = await fetch(NEXT_API_ENDPOINT + '/order/checkout', {
				method: 'PUT',
				headers: [["Content-Type", 'application/json']],
				body: JSON.stringify({
					intentId: payment_intent,
					cartKey,
				})
			})
			const result = await response.json()
			if (result.success) {
				setResult('succeeded')
			}
		}

		confirmOrder()

	}, [cartKey, dispatch, paid, payment_intent]);

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

