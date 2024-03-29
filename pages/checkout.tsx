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

const CheckoutGrid = dynamic(() => import("../src/pages/checkout/CheckoutGrid"));

export type CheckoutProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID;

export default function Checkout({
     shipping
}: CheckoutProps) {
	const { cart, stripe } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>()
	const {locale} = useRouter()

	useEffect(() => {
		dispatch(initCheckout());
	}, [])

	return <Fragment>
		<Head>
			{/* Set HTML language attribute */}
			<meta httpEquiv="content-language" content={locale} />
			<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
			<title>Bottega di Sguardi - Checkout</title>
		</Head>

		{GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}

		{(cart && cart.items && cart.items.length > 0)  ? (
			<CheckoutGrid shipping={shipping} />
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
