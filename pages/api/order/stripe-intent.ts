import type {NextApiRequest, NextApiResponse} from "next";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";
import {prepareOrderPayload} from "../../../src/utils/utils";

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
	orderId?: string;
	success: boolean;
	error?: string;
}
// retrieve product price from WooCommerce based on ID and multiply by quantity
export default async function handler(
	req: NextApiRequest,
	// NOTE: not necessary to define at the moment because the response has an <any> type //
	res: NextApiResponse<PaymentIntent>
) {
	if (!['POST', 'PUT', 'PATCH'].includes(req.method ?? '')) {
		return res.status(405).json({error: "Method not allowed", success: false});
	}
	try {
		const { cart, customer, paymentIntentId } = req.body
		if (!cart) {
			throw new Error('Cart or customer data is missing')
		}
		const amount = Number(cart.totals.total)
		if (amount === 0) {
			throw new Error('Cart amount is 0')
		}
		if (['POST', 'PUT'].includes(req.method ?? '')) {
			if (req.method === 'POST') {
				const paymentIntent = await stripe.paymentIntents.create({
				    amount,
					currency: "eur",
				});
				res.json({
					paymentIntentId: paymentIntent.id,
					clientSecret: paymentIntent.client_secret,
					success: true
				});
			}
			if (req.method === "PUT") {
				if (!req.body.paymentIntentId) {
					throw new Error('Payment intent ID is missing')
				}
				const { paymentIntentId } = req.body
				await stripe.paymentIntents.update(paymentIntentId, { amount });
				res.json({
					success: true
				});
			}
		}
		if (req.method === 'PATCH') {
			if (!customer) {
				throw new Error('Customer data is missing')
			}
			if (!paymentIntentId) {
				throw new Error('Payment intent ID is missing')
			}
			const orderPayload = await prepareOrderPayload(cart, customer, api)
			const { data: order } = await api.post("orders", {
				payment_method: 'stripe',
				payment_method_title: 'Stripe',
				payment_method_reference: paymentIntentId,
				...orderPayload,
			})
			const amount = order.total * 100
			if (amount === 0) {
				await api.delete(`orders/${order.id}`, { force: true })
				throw new Error('Order amount is 0')
			}
			await stripe.paymentIntents.update(paymentIntentId, {
				amount: order.total * 100,
				metadata: {
					orderId: order.id
				}
			});
			res.json({ success: true });
		}
	} catch (error) {
		console.error(error)
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