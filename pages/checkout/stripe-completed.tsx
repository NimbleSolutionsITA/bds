import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {NEXT_API_ENDPOINT} from "../../src/utils/endpoints";
import {useDispatch} from "react-redux";
import {getSSRTranslations} from "../../src/utils/wordpress_api";
import {AppDispatch} from "../../src/redux/store";
import {gtagPurchase} from "../../src/utils/utils";
import Loading from "../../src/components/Loading";
import Head from "next/head";
import GoogleAnalytics from "../../src/components/GoogleAnalytics";
import {Container} from "@mui/material";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID;

export default function CheckoutResult() {
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const {
		payment_intent, email,
	} = router.query

	useEffect(() => {
		if (!payment_intent) {
			return;
		}

		const confirmOrder = async () => {
			const result = await fetch(NEXT_API_ENDPOINT + '/order/stripe-intent-update', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ intentId: payment_intent })
			}).then((r) => r.json())
			if (result.success) {
				gtagPurchase(result.order)
				await router.push('/checkout/completed', {
					query: {
						paid: true,
						email
					}
				})
			}
		}

		confirmOrder()

	}, [dispatch, payment_intent, router, email]);


	return (
		<Container sx={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<Head>
				{/* Set HTML language attribute */}
				<meta httpEquiv="content-language" content={router.locale} />
				<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
				<title>Bottega di Sguardi - Pagamento completato</title>
			</Head>
			{GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
			<Loading />
		</Container>
	)
}
export async function getStaticProps({ locale }: { locale: 'it' | 'en', params: {id: string}}) {
	const [
		ssrTranslations
	] = await Promise.all([
		getSSRTranslations(locale),
	]);
	return {
		props: {
			...ssrTranslations
		},
		revalidate: 10
	}
}

