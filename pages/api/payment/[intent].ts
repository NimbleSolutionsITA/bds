import {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WooOrder} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	order?: WooOrder
	error?: string
}

const stripeSecretKey = process.env.NODE_ENV === 'production' ?
	process.env.STRIPE_SECRET_PRODUCTION :
	process.env.STRIPE_SECRET_SANDBOX;

const stripe = new Stripe(stripeSecretKey ?? '', {
	apiVersion: '2022-11-15',
});

const api = new WooCommerceRestApi({
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const responseData: Data = {
			success: false,
		}
		try {
			const payment_intent_id = req.query.intent as string;
			const current_intent = await stripe.paymentIntents.retrieve(
				payment_intent_id
			);

			if (!current_intent) {
				throw new Error('invalid intent')
			}
			const {data} = await api.put(`orders/${req.body.id}`, req.body)
			if (!data.order) {
				throw new Error('invalid order')
			}
			const updated_intent = await stripe.paymentIntents.update(
				payment_intent_id,
				{
					amount: data.order.total,
				}
			);
			res.status(200).json(updated_intent);
			responseData.order = data.order
			responseData.success = true;
		}
		catch ( error ) {
			if (typeof error === "string") {
				responseData.error = error
			} else if (error instanceof Error) {
				responseData.error = error.message
			}
			res.status(500)
		}
		return res.json(responseData)
	} else if (req.method === 'DELETE') {
		const responseData: Data = {
			success: false,
		}
		try {
			const payment_intent_id = req.query.intent as string;
			const current_intent = await stripe.paymentIntents.retrieve(
				payment_intent_id
			);
			if (!current_intent) {
				throw new Error('invalid intent')
			}
			const deleted_intent = await stripe.paymentIntents.cancel(
				payment_intent_id
			);
			responseData.success = true;
		}
		catch ( error ) {
			if (typeof error === "string") {
				responseData.error = error
			} else if (error instanceof Error) {
				responseData.error = error.message
			}
			res.status(500)
		}
		return res.json(responseData)
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}
