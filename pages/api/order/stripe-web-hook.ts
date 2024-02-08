import Stripe from 'stripe';
import {NextApiRequest, NextApiResponse} from 'next';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";

const api = new WooCommerceRestApi({
	url: WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2022-11-15' });

	const webhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET as string;

	if (req.method === 'POST') {
		const sig = req.headers['stripe-signature'] as string

		let event: Stripe.Event;

		try {
			const body = await buffer(req);
			event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
		} catch (err) {
			if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
				console.log(`❌ Error message: ${err.message}`);
				res.status(400).send(`Webhook Error: ${err.message}`);
			}
			return;
		}

		// Cast event data to Stripe object
		if (event.type === 'payment_intent.succeeded') {
			const stripeObject: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log('webhook', stripeObject.status);
		} else if (event.type === 'charge.succeeded') {
			const charge = event.data.object as Stripe.Charge;
			const order_id = charge.metadata.order_id;
			if (order_id) {
				await api.put(`orders/${order_id}`, {
					set_paid: true
				})
			}
		} else if (event.type === 'payment_intent.payment_failed') {
			const charge = event.data.object as Stripe.Charge;
			const order_id = charge.metadata.order_id;
			if (order_id) {
				await api.delete(`orders/${order_id}`)
			}
		} else {
			console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
		}

		// Return a response to acknowledge receipt of the event
		res.json({received: true});
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
};

export const config = {
	api: {
		bodyParser: false,
	},
};

const buffer = (req: NextApiRequest) => {
	return new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];

		req.on('data', (chunk: Buffer) => {
			chunks.push(chunk);
		});

		req.on('end', () => {
			resolve(Buffer.concat(chunks));
		});

		req.on('error', reject);
	});
};

export default handler;