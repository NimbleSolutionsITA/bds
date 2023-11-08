import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const base = process.env.NODE_ENV === 'production' ?
	process.env.PAYPAL_API_URL :
	process.env.PAYPAL_API_URL_SANDBOX;

const PAYPAL_CLIENT_ID = process.env.NODE_ENV === 'production' ?
	process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID :
	process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX;

const PAYPAL_CLIENT_SECRET = process.env.NODE_ENV === 'production' ?
	process.env.PAYPAL_CLIENT_SECRET :
	process.env.PAYPAL_CLIENT_SECRET_SANDBOX;


const stripeSecretKey = process.env.NODE_ENV === 'production' ?
	process.env.STRIPE_SECRET_PRODUCTION :
	process.env.STRIPE_SECRET_SANDBOX;

const stripe = require("stripe")(stripeSecretKey);

export type CreateOrderResponse = {
	success: boolean
	orderId?: string
	paypalOrderId?: string
	amount?: number
	error?: string
}

const api = new WooCommerceRestApi({
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateOrderResponse>
) {
	const responseData: CreateOrderResponse = {
		success: false,
	}
	if (req.method === 'POST') {
		try {
			const { cartKey, intentId = null, customer = null } = req.body
			const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL + '/wp-json/cocart/v2/cart?cart_key=' + cartKey)
			const cart = await response.json()
			if (responseData.amount === 0) {
				throw new Error('Amount is 0')
			}

			responseData.amount = Number(cart.totals.total) / 100
			// STRIPE CHECKOUT
			if (intentId) {
				const paymentIntent = await stripe.paymentIntents.update(intentId, {
					amount: responseData.amount,
					metadata: {
						billing_first_name: customer.billing.first_name,
						billing_last_name: customer.billing.last_name,
						billing_email: customer.billing.email,
						billing_phone: customer.billing.phone,
						billing_address_1: customer.billing.address_1,
						billing_address_2: customer.billing.address_2,
						billing_city: customer.billing.city,
						billing_state: customer.billing.state,
						billing_postcode: customer.billing.postcode,
						billing_country: customer.billing.country,
						billing_company: customer.billing.company,
						shipping_first_name: customer.shipping.first_name,
						shipping_last_name: customer.shipping.last_name,
						shipping_address_1: customer.shipping.address_1,
						shipping_address_2: customer.shipping.address_2,
						shipping_city: customer.shipping.city,
						shipping_state: customer.shipping.state,
						shipping_postcode: customer.shipping.postcode,
						shipping_country: customer.shipping.country,
						shipping_company: customer.shipping.company,
						shipping_phone: customer.shipping.phone,
					}
				});
				console.log(paymentIntent)
			}
			// PAYPAL CHECKOUT
			else {
				const paypalOrder = await createOrder(responseData.amount)
				console.log(paypalOrder)
				responseData.paypalOrderId = paypalOrder.id
			}
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
	}
	if (req.method === 'PUT') {
		try {
			const { cartKey = null, intentId = null, paypalOrderId = null, customer = null } = req.body
			let customerData = customer
			const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL + '/wp-json/cocart/v2/cart?cart_key=' + cartKey)
			const cart = await response.json()
			const selectedShipping = cart.shipping.packages.default.rates[cart.shipping.packages.default.chosen_method]
			// PAYPAL CHECKOUT
			if (paypalOrderId) {
				const capture = await captureOrder(paypalOrderId)
				responseData.success = capture.status === 'COMPLETED'
				if (intentId) {
					await stripe.paymentIntents.cancel(intentId)
				}
			}
			// STRIPE CHECKOUT
			else if (intentId) {
				const paymentIntent = await stripe.paymentIntents.retrieve(intentId)
				responseData.success = paymentIntent.status === 'succeeded'
				// add customer data to order from meta
				if (customerData === null) {
					customerData = {
						billing: {
							first_name: paymentIntent.metadata.billing_first_name,
							last_name: paymentIntent.metadata.billing_last_name,
							email: paymentIntent.metadata.billing_email,
							phone: paymentIntent.metadata.billing_phone,
							address_1: paymentIntent.metadata.billing_address_1,
							address_2: paymentIntent.metadata.billing_address_2,
							city: paymentIntent.metadata.billing_city,
							state: paymentIntent.metadata.billing_state,
							postcode: paymentIntent.metadata.billing_postcode,
							country: paymentIntent.metadata.billing_country,
							company: paymentIntent.metadata.billing_company,
						},
						shipping: {
							first_name: paymentIntent.metadata.shipping_first_name,
							last_name: paymentIntent.metadata.shipping_last_name,
							address_1: paymentIntent.metadata.shipping_address_1,
							address_2: paymentIntent.metadata.shipping_address_2,
							city: paymentIntent.metadata.shipping_city,
							state: paymentIntent.metadata.shipping_state,
							postcode: paymentIntent.metadata.shipping_postcode,
							country: paymentIntent.metadata.shipping_country,
							company: paymentIntent.metadata.shipping_company,
							phone: paymentIntent.metadata.shipping_phone
						}
					}
				}
			}

			if (responseData.success) {
				const { data: order} = await api.post("orders",  {
					payment_method: intentId ? 'stripe' : 'paypal',
					payment_method_title: intentId ? 'Stripe' : 'Paypal',
					payment_method_reference: intentId ? intentId : paypalOrderId,
					set_paid: true,
					...customerData,
					line_items: cart.items.map((item: any) => {
						return {
							product_id: item.meta.product_type === 'variation' ? item.meta.variation.parent_id : item.id,
							variation_id: item.meta.product_type === 'variation' ? item.id : undefined,
							quantity: item.quantity.value,
						}
					}),
					shipping_lines: [
						{
							method_id: selectedShipping?.method_id,
							method_title: selectedShipping?.label,
							total: (Number(selectedShipping?.cost) / 100) + '',
						}
					],
					coupon_lines:  cart.coupons[0] ? [{ code: cart.coupons[0].code }] : []
				})

				responseData.orderId = order.id

				if (cartKey) {
					await fetch(
						process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL + '/wp-json/cocart/v2/cart/clear?cart_key=' + cartKey,
						{ method: 'POST'}
					)
				}
			}
		}
		catch ( error ) {
			if (typeof error === "string") {
				responseData.error = error
			} else if (error instanceof Error) {
				responseData.error = error.message
			}
			res.status(500)
		}
	}
	return res.json(responseData)
}

const generateAccessToken = async () => {
	try {
		if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
			throw new Error("MISSING_API_CREDENTIALS");
		}
		const auth = Buffer.from(
			PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
		).toString("base64");
		const response = await fetch(`${base}/v1/oauth2/token`, {
			method: "POST",
			body: "grant_type=client_credentials",
			headers: {
				Authorization: `Basic ${auth}`,
			},
		});

		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error("Failed to generate Access Token:", error);
	}
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (amount: number) => {
	const accessToken = await generateAccessToken();
	const payload = {
		intent: "CAPTURE",
		purchase_units: [
			{
				amount: {
					currency_code: "EUR",
					value: amount + '',
				},
			},
		],
	};

	const response = await fetch(`${base}/v2/checkout/orders`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`
		},
		method: "POST",
		body: JSON.stringify(payload),
	});

	return await response.json();
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID: string) => {
	const accessToken = await generateAccessToken();

	const response = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`
		},
	});

	return await response.json();
};