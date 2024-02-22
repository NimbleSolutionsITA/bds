import type {NextApiRequest, NextApiResponse} from "next";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";
import {WooOrder} from "../../../src/types/woocommerce";
const stripeSecretKey = process.env.STRIPE_SECRET;
const stripe = require("stripe")(stripeSecretKey);

const api = new WooCommerceRestApi({
	url: WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});
export interface PaymentIntent {
	success: boolean;
	error?: string;
	order?: WooOrder
}
// retrieve product price from WooCommerce based on ID and multiply by quantity
export default async function handler(
	req: NextApiRequest,
	// NOTE: not necessary to define at the moment because the response has an <any> type //
	res: NextApiResponse<PaymentIntent>
) {
	if (!['PUT', 'DELETE'].includes(req.method ?? '')) {
		return res.status(405).json({error: "Method not allowed", success: false});
	}
	try {
		if (!req.body.intentId) {
			throw new Error('Payment intent ID is missing')
		}
		const { intentId } = req.body
		const paymentIntent = await stripe.paymentIntents.retrieve(intentId)
		const orderId = paymentIntent.metadata.orderId
		if (!orderId) {
			throw new Error('Order ID is missing')
		}
		if (req.method === 'DELETE') {
			if (paymentIntent.status === 'succeeded') {
				throw new Error('Cannot delete order with succeeded payment intent')
			}
			await api.delete(`orders/${orderId}`, { force: true })
			res.json({ success: true })
		}
		if (req.method === 'PUT') {
			if (paymentIntent.status === 'succeeded') {
				const { data: order } = await api.put(`orders/${orderId}`, {
					set_paid: true
				})
				res.json({ success: true, order })
			}
			else {
				throw new Error('Payment intent not succeeded')
			}
		}
	} catch (error) {
		console.log(error)
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
	return res
}