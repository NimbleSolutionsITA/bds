import type {NextApiRequest, NextApiResponse} from "next";
import {WooLineItem} from "../../../src/types/woocommerce";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const stripeSecretKey = process.env.NODE_ENV === 'production' ?
	process.env.STRIPE_SECRET_PRODUCTION :
	process.env.STRIPE_SECRET_SANDBOX;

const stripe = require("stripe")(stripeSecretKey);

const api = new WooCommerceRestApi({
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});
export interface PaymentIntent {
	paymentIntentId?: string;
	clientSecret?: string;
	success: boolean;
	error?: string;
}
// retrieve product price from WooCommerce based on ID and multiply by quantity
const getProductTotal = async (lineItem: WooLineItem) => {
	const {data: product} = await api.get(
		`products/${lineItem.variation_id ?? lineItem.product_id}`
	);
	return lineItem.quantity * parseFloat(product.price);
};

// map through lineItems and get the total for each lineItem and return sum of totals
const calculateTotalAmount = async (lineItems: WooLineItem[]) => {
	return await Promise.all(
		lineItems.map((lineItem) => {
			return getProductTotal(lineItem);
		})
	).then((res) => {
		return res.reduce((curr, next) => curr + next);
	});
};

export default async function handler(
	req: NextApiRequest,
	// NOTE: not necessary to define at the moment because the response has an <any> type //
	res: NextApiResponse<PaymentIntent>
) {
	const data: WooLineItem[] = req.body;

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: await calculateTotalAmount(data),
			currency: "eur",
		});
		res.json({
			paymentIntentId: paymentIntent.id,
			clientSecret: paymentIntent.client_secret,
			success: true
		});
	} catch (error) {
		let responseData = {
			success: false,
			error: "",
		}
		if (typeof error === "string") {
			responseData.error = error
		} else if (error instanceof Error) {
			responseData.error = error.message
		}
		res.status(500).json(responseData)
	}
}