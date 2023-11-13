import {useEffect} from "react";
import {getCheckoutPageProps} from "../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {Country, ShippingClass} from "../src/types/woocommerce";
import {Backdrop, CircularProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {createIntent, updateShippingCountry} from "../src/redux/cartSlice";
import {AppDispatch, RootState} from "../src/redux/store";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import {stripeTheme} from "../src/theme/theme";
import getStripe from "../src/utils/stripe-utils";
import {Elements} from "@stripe/react-stripe-js";

const CheckoutGrid = dynamic(() => import("../src/pages/checkout/CheckoutGrid"));

export type CheckoutProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
}

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export default function Checkout({
     shipping
}: CheckoutProps) {
	const { cart, stripe } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>()
	const isShippingReady = cart?.shipping?.packages?.default

	useEffect(() => {
		if (!isShippingReady) {
			dispatch(updateShippingCountry({ country: 'IT' }))
		}
		if (isShippingReady && !stripe?.clientSecret) {
			dispatch(createIntent());
		}
	}, [dispatch, isShippingReady, stripe?.clientSecret])

	return (isShippingReady && stripe?.clientSecret && CLIENT_ID)  ? (
		<PayPalScriptProvider options={{ "client-id": CLIENT_ID, currency: "EUR", components: 'buttons', intent: 'capture' }}>
			<Elements
				options={{
					clientSecret: stripe.clientSecret,
					appearance: stripeTheme,
				}}
				stripe={getStripe()}
			>
				<CheckoutGrid shipping={shipping} />
			</Elements>
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
