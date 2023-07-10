import {useEffect, useState} from "react";
import {getCheckoutPageProps} from "../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {Country, ShippingClass} from "../src/types/woocommerce";
import {Backdrop, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { initCart} from "../src/redux/cartSlice";
import {RootState} from "../src/redux/store";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";

const CheckoutGrid = dynamic(() => import("../src/pages/checkout/CheckoutGrid"));

export type CheckoutProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
}

const CLIENT_ID = (process.env.NODE_ENV === "production" ?
	process.env.NEXT_PUBLIC_PAYPAL_PRODUCTION :
	process.env.NEXT_PUBLIC_PAYPAL_SANDBOX) as string;

export default function Checkout({
     shipping
}: CheckoutProps) {
	const { items } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch()
	const [cartReady, setCartReady] = useState<boolean>(false)

	useEffect(() => {
		// Dispatch initCart to load cart from localStorage
		dispatch(initCart());
	}, [dispatch]);

	if (items.length > 0 && !cartReady && !!CLIENT_ID) {
		setCartReady(true)
	}

	return cartReady ? (
		<PayPalScriptProvider options={{ "client-id": CLIENT_ID, currency: "EUR", components: 'buttons' }}>
			<CheckoutGrid shipping={shipping} items={items} />
		</PayPalScriptProvider>
	) : (
		<Backdrop
			sx={{ backgroundColor: 'rgba(255,255,255,0.75)', zIndex: (theme) => theme.zIndex.appBar - 2 }}
			open={true}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	)
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
