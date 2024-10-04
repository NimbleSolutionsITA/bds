import React, {Fragment, useEffect, useState} from "react";
import {getCheckoutPageProps} from "../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {Backdrop, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../src/redux/store";
import Head from "next/head";
import GoogleAnalytics from "../src/components/GoogleAnalytics";
import {useRouter} from "next/router";
import LogInDrawer from "../src/layout/drawers/LogInDrawer";
import useAuth from "../src/utils/useAuth";
import {openLogInDrawer, ShippingData} from "../src/redux/layoutSlice";
import CartErrorModal from "../src/layout/cart/CartErrorModal";
import PayPalProvider from "../src/components/PayPalProvider";
import {initCart} from "../src/redux/cartSlice";
import {LOCALE} from "../src/utils/utils";

const CheckoutGrid = dynamic(() => import("../src/pages/checkout/CheckoutGrid"));

export type CheckoutProps = {
	shipping: ShippingData
}

export default function Checkout({
     shipping
}: CheckoutProps) {
	const { loginChecked, loggedIn } = useAuth()
	const { cart: { cart, initLoading }, layout: { logInDrawerOpen } } = useSelector((state: RootState) => state);
	const dispatch = useDispatch<AppDispatch>()
	const {locale} = useRouter()
	const router = useRouter();
	const isCheckoutReady = cart && loginChecked && !logInDrawerOpen && !initLoading
	const cartEmpty = cart ? cart.item_count === 0 : true

	useEffect(() => {
		if (cart && !cart.shipping?.packages?.default?.chosen_method) {
			dispatch(initCart())
		}
	}, []);

	useEffect(() => {
		if (loginChecked && !loggedIn) {
			dispatch(openLogInDrawer())
		}
	}, [loginChecked, loggedIn, dispatch])

	useEffect(() => {
		if (isCheckoutReady && cartEmpty) {
			router.push('/')
		}
	}, [cartEmpty, isCheckoutReady, router]);

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

		{(isCheckoutReady && !cartEmpty) ? (
			<PayPalProvider>
				<CheckoutGrid shipping={shipping} />
			</PayPalProvider>
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


export async function getStaticProps({ locale }: { locales: string[], locale: LOCALE}) {
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
