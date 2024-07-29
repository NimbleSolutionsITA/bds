import React, {Fragment} from "react";
import {getSSRTranslations} from "../../src/utils/wordpress_api";
import {Backdrop, CircularProgress} from "@mui/material";
import { useSelector} from "react-redux";
import { RootState} from "../../src/redux/store";
import Head from "next/head";
import GoogleAnalytics from "../../src/components/GoogleAnalytics";
import {useRouter} from "next/router";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import FinalStepContainer from "../../src/pages/checkout/FinalStepContainer";
import PaymentPayPal from "../../src/pages/checkout/PaymentPayPal";


export type CheckoutProps = {}

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID;
const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

export default function Checkout({}: CheckoutProps) {
	const { cart, stripe } = useSelector((state: RootState) => state.cart);
	const {locale} = useRouter()


	return <Fragment>
		<Head>
			{/* Set HTML language attribute */}
			<meta httpEquiv="content-language" content={locale} />
			<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
			<title>Bottega di Sguardi - Checkout PayPal</title>
		</Head>

		<GoogleAnalytics />

		{(cart && cart.items && cart.items.length > 0 && CLIENT_ID)  ? (
			<PayPalScriptProvider options={{ "client-id": CLIENT_ID, currency: "EUR", components: 'buttons', intent: 'capture' }}>
				<FinalStepContainer>
					<PaymentPayPal />
				</FinalStepContainer>
			</PayPalScriptProvider>
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
