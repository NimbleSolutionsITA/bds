import {NextApiRequest, NextApiResponse} from 'next';
import Stripe from 'stripe';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WooOrder} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	order?: WooOrder
	clientSecret?: string
	intentId?: string
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
			const {data: order} = await api.post('orders', req.body)
			const params: Stripe.PaymentIntentCreateParams = {
				amount: convertPrice(order.total),
				currency: "eur",
			};
			if (!order) {
				throw new Error('invalid order')
			}
			responseData.order = order
			const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
				params
			)
			if (!paymentIntent.client_secret)
				throw new Error('No client secret')

			responseData.clientSecret = paymentIntent.client_secret
			responseData.intentId = paymentIntent.id
			responseData.success = true
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
function convertPrice(price: string) {
	const stringWithoutDecimal = price.replace(/\./g, '');
	return parseInt(stringWithoutDecimal, 10);
}