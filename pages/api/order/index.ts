import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";
import {NextApiRequest, NextApiResponse} from "next";

const stripeSecretKey = process.env.STRIPE_SECRET;

const stripe = require("stripe")(stripeSecretKey);


const api = new WooCommerceRestApi({
	url: WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {

	if (req.method === 'POST') {
		const { orderBody, paymentIntentId } = req.body
		if (!orderBody || !paymentIntentId) {
			return res.status(400).json({success: false, error: 'Order or payment intent ID is missing'})
		}
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
		const { data: order } = await api.post("orders", orderBody)
		const orderTotal = parseFloat(order.total) * 100;
		if (paymentIntent.amount === orderTotal) {
			let { data: orderPaid } = await api.put(`orders/${order.id}`, { set_paid: true })
			return res.status(200).json({
				success: true,
				order: orderPaid
			})
		}
		return res.status(200).json({
			success: false,
			order,
			error: 'Order total does not match payment intent amount. Please contact support for assistance.'
		})
	}
};