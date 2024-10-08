import React, {Fragment, useEffect, useState} from "react";
import {getCheckoutPageProps} from "../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {Country, ShippingClass} from "../src/types/woocommerce";
import {Backdrop, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {initCheckout} from "../src/redux/cartSlice";
import {AppDispatch, RootState} from "../src/redux/store";
import Head from "next/head";
import GoogleAnalytics from "../src/components/GoogleAnalytics";
import {useRouter} from "next/router";
import LogInDrawer from "../src/layout/drawers/LogInDrawer";
import useAuth from "../src/utils/useAuth";
import {openLogInDrawer} from "../src/redux/layoutSlice";
import CartErrorModal from "../src/layout/cart/CartErrorModal";

const CheckoutGrid = dynamic(() => import("../src/pages/checkout/CheckoutGrid"));

export type CheckoutProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
}

type InitStep = 'check-login'|'ask-login'|'init-customer-data'|'completed'

export default function Checkout({
     shipping
}: CheckoutProps) {
	const [ initStep, setInitStep ] = useState<InitStep>('check-login')
	const { loginChecked, loggedIn } = useAuth()
	const { logInDrawerOpen} = useSelector((state: RootState) => state.layout);
	const { cart, customer, checkout } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>()
	const {locale} = useRouter()

	useEffect(() => {
		if (checkout) {
			dispatch(initCheckout());
			setInitStep('completed')
		}
		else {
			if (loginChecked && !loggedIn) {
				dispatch(openLogInDrawer())
				setInitStep('ask-login')
			}
			if (loginChecked && loggedIn) {
				setInitStep('init-customer-data')
			}
		}
	}, [loginChecked, loggedIn])

	useEffect(() => {
		if (initStep === 'ask-login' && !logInDrawerOpen) {
			dispatch(initCheckout());
			setInitStep('completed')
		}
		if (
			initStep === 'init-customer-data' &&
			Object.keys(customer?.billing ?? {}).includes('first_name') &&
			cart?.items?.length > 0
		) {
			dispatch(initCheckout());
			setInitStep('completed')
		}
	}, [cart, customer, initStep, logInDrawerOpen]);

	return <Fragment>
		<Head>
			{/* Set HTML language attribute */}
			<meta httpEquiv="content-language" content={locale} />
			<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
			<title>Bottega di Sguardi - Checkout</title>
		</Head>

		<GoogleAnalytics />

		<CartErrorModal />
		<LogInDrawer />

		{initStep === 'completed'  ? (
			<CheckoutGrid shipping={shipping}  />
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
