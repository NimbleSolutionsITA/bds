import React, {Fragment, useEffect, useState} from "react";
import {getCheckoutPageProps} from "../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {Country, ShippingClass} from "../src/types/woocommerce";
import {Backdrop, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../src/redux/store";
import Head from "next/head";
import GoogleAnalytics from "../src/components/GoogleAnalytics";
import {useRouter} from "next/router";
import LogInDrawer from "../src/layout/drawers/LogInDrawer";
import useAuth from "../src/utils/useAuth";
import {openLogInDrawer} from "../src/redux/layoutSlice";
import CartErrorModal from "../src/layout/cart/CartErrorModal";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const CheckoutGrid = dynamic(() => import("../src/pages/checkout/CheckoutGrid"));

export type CheckoutProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
}

export default function Checkout({
     shipping
}: CheckoutProps) {
	const { loginChecked, loggedIn } = useAuth()
	const { cart } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>()
	const {locale} = useRouter()
	const [clientToken, setClientToken] = useState(null);
	const router = useRouter();

	useEffect(() => {
		if (loginChecked && !loggedIn) {
			dispatch(openLogInDrawer())
		}
	}, [loginChecked, loggedIn, dispatch])

	useEffect(() => {
		if (cart && cart.items.length === 0) {
			router.push('/')
		}
	}, [cart, router]);

	useEffect(() => {
		(async () => {
			const response = await fetch("/api/paypal/token", {
				method: "POST",
			});
			const { client_token } = await response.json();
			setClientToken(client_token);
		})();
	}, []);

	return <Fragment>
		<Head>
			{/* Set HTML language attribute */}
			<meta httpEquiv="content-language" content={locale}/>
			<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'/>
			<title>Bottega di Sguardi - Checkout</title>
		</Head>


		<GoogleAnalytics/>

		<CartErrorModal />
		<LogInDrawer />

		{(cart && loginChecked && clientToken && PAYPAL_CLIENT_ID)  ? (
			<PayPalScriptProvider options={{
				"clientId": PAYPAL_CLIENT_ID,
				components: "card-fields,buttons,marks",
				currency: "EUR",
			}}>
				<CheckoutGrid shipping={shipping} />
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
		{ shipping, ssrTranslations },
	] = await Promise.all([
		getCheckoutPageProps(locale),
	]);
	return {
		props: {
			shipping,
			...ssrTranslations
		},
		revalidate: 10
	}
}
