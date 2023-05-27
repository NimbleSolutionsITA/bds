import {useEffect} from "react";
import {getCheckoutPageProps} from "../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {Country, ShippingClass} from "../src/types/woocommerce";
import {Backdrop, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import { initCart} from "../src/redux/cartSlice";
import {RootState} from "../src/redux/store";
import {loadStripe} from "@stripe/stripe-js";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";

const CheckoutGrid = dynamic(() => import("../src/pages/checkout/CheckoutGrid"));

export type CheckoutProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
}

const stripePublicKey = process.env.NODE_ENV === 'production' ?
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_PRODUCTION :
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_SANDBOX;

const CLIENT_ID = process.env.NODE_ENV === "production" ?
	process.env.NEXT_PUBLIC_PAYPAL_PRODUCTION :
	process.env.NEXT_PUBLIC_PAYPAL_SANDBOX;

const stripePromise = loadStripe(stripePublicKey ?? '');

export default function Checkout({
     shipping
}: CheckoutProps) {
	const { items } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch()

	useEffect(() => {
		// Dispatch initCart to load cart from localStorage
		dispatch(initCart());
	}, []);

	const isReady = items.length > 0 && !!CLIENT_ID

	return isReady ? (
		<PayPalScriptProvider options={{ "client-id": CLIENT_ID, currency: "EUR", components: 'buttons' }}>
			<CheckoutGrid shipping={shipping} stripePromise={stripePromise} />)
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
		{ shipping },
	] = await Promise.all([
		getCheckoutPageProps(locale),
	]);
	return {
		props: {
			shipping
		},
		revalidate: 10
	}
}
