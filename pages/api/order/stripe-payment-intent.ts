import type {NextApiRequest, NextApiResponse} from "next";
import {WooLineItem} from "../../../src/types/woocommerce";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";

const stripeSecretKey = process.env.STRIPE_SECRET;

const stripe = require("stripe")(stripeSecretKey);

const api = new WooCommerceRestApi({
	url: WORDPRESS_SITE_URL ?? '',
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

type Payload = {
	items: WooLineItem[],
	shippingCountry: string,
	shippingLine: {
		method_id: string
		total: string
		method_title: string
	}
}

// retrieve product price from WooCommerce based on ID and multiply by quantity
const getProductTotal = async (lineItem: WooLineItem, shippingCountry: string) => {
	const {data: product} = await api.get(
		`products/${lineItem.variation_id ?? lineItem.product_id}`
	);
	let price = parseFloat(product.price)
	if (shippingCountry !== 'IT') {
		const priceEU = product.meta_data.find((meta: any) => meta.key === '_europa_price')?.value
		if (priceEU && priceEU !== '0') {
			price = parseFloat(priceEU)
		}
	}
	return lineItem.quantity * price;
};

// map through lineItems and get the total for each lineItem and return sum of totals
const calculateTotalAmount = async ({items, shippingCountry, shippingLine}: Payload) => {
	const subtotal = await Promise.all(
		items.map((lineItem) => {
			return getProductTotal(lineItem, shippingCountry);
		})
	).then((res) => {
		return res.reduce((curr, next) => curr + next);
	});
	const shipping = parseFloat(shippingLine.total) / 100
	console.log({subtotal, shipping})
	return subtotal + shipping;
};

export default async function handler(
	req: NextApiRequest,
	// NOTE: not necessary to define at the moment because the response has an <any> type //
	res: NextApiResponse<PaymentIntent>
) {
	const data: Payload = req.body;

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
			error: "unknown error",
		}
		if (typeof error === "string") {
			responseData.error = error
		} else if (error instanceof Error) {
			responseData.error = error.message
		}
		res.status(500).json(responseData)
	}
}