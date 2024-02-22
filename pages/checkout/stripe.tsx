import React, {Fragment, useEffect} from "react";
import { getSSRTranslations} from "../../src/utils/wordpress_api";
import {Backdrop, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../src/redux/store";
import {stripeTheme} from "../../src/theme/theme";
import getStripe from "../../src/utils/stripe-utils";
import {Elements, PaymentElement} from "@stripe/react-stripe-js";
import Head from "next/head";
import GoogleAnalytics from "../../src/components/GoogleAnalytics";
import {useRouter} from "next/router";
import FinalStepContainer from "../../src/pages/checkout/FinalStepContainer";
import {initStripePayment} from "../../src/redux/cartSlice";
import PaymentStripe from "../../src/pages/checkout/PaymentStripe";


export type CheckoutProps = {}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID;

export default function Checkout({}: CheckoutProps) {
	const { cart, stripe, customer } = useSelector((state: RootState) => state.cart);
	const {locale} = useRouter()
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		dispatch(initStripePayment());
	}, [])

	return <Fragment>
		<Head>
			{/* Set HTML language attribute */}
			<meta httpEquiv="content-language" content={locale} />
			<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
			<title>Bottega di Sguardi - Checkout Stripe</title>
		</Head>

		{GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}

		{(cart && cart.items && cart.items.length > 0 && stripe?.clientSecret)  ? (
			<Elements
				options={{
					clientSecret: stripe.clientSecret,
					appearance: stripeTheme,
				}}
				stripe={getStripe()}
			>
				<FinalStepContainer>
					<PaymentStripe />
				</FinalStepContainer>

			</Elements>
		) : (
			<Backdrop
				sx={{ backgroundColor: 'rgba(255,255,255,0.75)', zIndex: (theme) => theme.zIndex.appBar - 2 }}
				open={true}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		)}
	</Fragment>
}
export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const [
		ssrTranslations,
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
