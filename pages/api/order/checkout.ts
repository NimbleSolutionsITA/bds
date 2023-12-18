import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";
import {getCartItemPriceWithoutTax, getCartTotals, getIsEU} from "../../../src/utils/utils";
import {Item} from "../../../src/types/cart-type";

const base = process.env.PAYPAL_API_URL;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const stripeSecretKey = process.env.STRIPE_SECRET;
const stripe = require("stripe")(stripeSecretKey);

export type CreateOrderResponse = {
	success: boolean
	orderId?: string
	paypalOrderId?: string
	amount?: number
	error?: string
}

const api = new WooCommerceRestApi({
	url: WORDPRESS_SITE_URL ?? '',
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
			const { cartKey, intentId = null, customer = null, customerNote = null } = req.body
			const response = await fetch(WORDPRESS_SITE_URL + '/wp-json/cocart/v2/cart?cart_key=' + cartKey)
			const cart = await response.json()
			if (!cart || !cart.items || cart?.items?.length === 0) {
				throw new Error('Cart is empty')
			}
			const { total } = getCartTotals(cart)
			const selectedShipping = cart.shipping.packages.default.rates[cart.shipping.packages.default.chosen_method]
			responseData.amount = total * 100
			console.log('Order amount', responseData.amount)
			if (responseData.amount === 0) {
				throw new Error('Amount is 0')
			}
			// CREATE ORDER
			const orderPayload = prepareOrderPayload(cart, customer, customerNote, intentId, selectedShipping)
			const { data: order} = await api.post("orders", orderPayload)
			responseData.orderId = order.id
			// STRIPE CHECKOUT
			if (intentId) {
				const paymentIntent = await stripe.paymentIntents.update(intentId, createStripeMetadata(customer, order.id, responseData.amount, customerNote));
				console.log('Stripe Payment Intent status', paymentIntent.status)
			}
			// PAYPAL CHECKOUT
			else {
				const paypalOrder = await createOrder(responseData.amount / 100, order.id)
				responseData.paypalOrderId = paypalOrder.id
			}

			responseData.success = true
		}
		catch ( error ) {
			console.log(error)
			responseData.success = false
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
			const { intentId = null, paypalOrderId = null } = req.body

			let orderId = null

			// PAYPAL CHECKOUT
			if (paypalOrderId) {
				const capture = await captureOrder(paypalOrderId)
				orderId = capture.purchase_units[0].reference_id
				responseData.success = capture.status === 'COMPLETED'
				if (intentId) {
					await stripe.paymentIntents.cancel(intentId)
				}
			}

			// STRIPE CHECKOUT
			else if (intentId) {
				const paymentIntent = await stripe.paymentIntents.retrieve(intentId)
				responseData.success = paymentIntent.status === 'succeeded'
				orderId = paymentIntent.metadata.order_id
			}

			if (responseData.success && orderId) {
				await api.put(`orders/${orderId}`, { set_paid: true })
			}
		}
		catch ( error ) {
			console.log(error)
			responseData.success = false
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

const prepareOrderPayload = (cart: any, customerData: any, customer_note: string, intentId: string|null, selectedShipping: any) => ({
	payment_method: intentId ? 'stripe' : 'paypal',
	payment_method_title: intentId ? 'Stripe' : 'PayPal',
	payment_method_reference: intentId ? intentId : 'paypal',
	...customerData,
	customer_note,
	line_items: cart.items.map((item: Item) => {
		return {
			product_id: item.meta.product_type === 'variation' ? item.meta.variation.parent_id : item.id,
			variation_id: item.meta.product_type === 'variation' ? item.id : undefined,
			quantity: item.quantity.value,
			total: getCartItemPriceWithoutTax(item, getIsEU(cart.customer)) + '',
		}
	}),
	shipping_lines: [
		{
			method_id: selectedShipping?.method_id,
			method_title: selectedShipping?.label,
			total: (Number(selectedShipping?.cost) / 1.22 / 100) + '',
		}
	],
	coupon_lines:  cart.coupons[0] ? [{ code: cart.coupons[0].coupon ?? '' }] : [],
	meta_data: [
		{
			key: 'vat',
			value: customerData.billing.vat ?? ''
		}
	]
})

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
const createOrder = async (amount: number, orderId: string) => {
	const accessToken = await generateAccessToken();
	const payload = {
		intent: "CAPTURE",
		purchase_units: [
			{
				reference_id: orderId,
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

const createStripeMetadata = (customer: any, orderId: string, amount: number, customerNote: string) => ({
	amount: amount,
	metadata: {
		order_id: orderId,
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
		billing_vat: customer.billing.vat,
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
		customer_note: customerNote
	}
})