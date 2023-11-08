import {NextApiRequest, NextApiResponse} from "next";
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const stripeSecretKey = process.env.NODE_ENV === 'production' ?
	process.env.STRIPE_SECRET_PRODUCTION :
	process.env.STRIPE_SECRET_SANDBOX;

const stripe = require("stripe")(stripeSecretKey);
const webhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

export const config = {
	api: {
		bodyParser: false,
	},
};

const api = new WooCommerceRestApi({
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});

/**
 * Update Order.
 *
 * Once payment is successful or failed,
 * Update Order Status to 'Processing' or 'Failed' and set the transaction id.
 *
 * @param {String} newStatus Order Status to be updated.
 * @param {String} orderId Order id
 * @param {String} transactionId Transaction id.
 *
 * @returns {Promise<void>}
 */
const updateOrder = async (newStatus: string, orderId: string, transactionId: string = ''): Promise<void> => {

	let newOrderData: {status: string, transaction_id?: string} = {
		status: newStatus
	}

	if ( transactionId ) {
		newOrderData.transaction_id = transactionId
	}

	try {
		console.log(newStatus, orderId, transactionId);
		// const {data} = await api.put( `orders/${ orderId }`, newOrderData );
		// console.log( '✅ Order updated data', data );
	} catch (ex) {
		console.error('Order creation error', ex);
		throw ex;
	}
}

export default async function handler(
	req: NextApiRequest,
	// NOTE: not necessary to define at the moment because the response has an <any> type //
	res: NextApiResponse
) {
	if (req.method === "POST") {
		 console.log('pd')
		const buf = [];
		for await (const chunk of req) {
			buf.push(chunk);
		}
		const body = Buffer.concat(buf).toString();
		const sig = req.headers["stripe-signature"] as string

		let stripeEvent;

		try {
			stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
			console.log( 'stripeEvent', stripeEvent );
		} catch (err) {
			if (typeof err === "string") {
				res.status(400).send(`Webhook Error: ${err}`);
			} else if (err instanceof Error) {
				res.status(400).send(`Webhook Error: ${err.message}`);
			}
			return;
		}

		if ( 'payment_intent.succeeded' === stripeEvent.type ) {
			const session = stripeEvent.data.object;
			console.log( 'sessionsession', session );
			console.log( '✅ session.metadata.orderId', session.metadata.orderId, session.id );
			// Payment Success.
			try {
				await updateOrder( 'processing', session.metadata.orderId, session.id );
			} catch (error) {
				await updateOrder( 'failed', session.metadata.orderId );
				console.error('Update order error', error);
			}
		}

		res.json({ received: true });
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
};