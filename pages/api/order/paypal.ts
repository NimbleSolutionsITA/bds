import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";
import {prepareOrderPayload} from "../../../src/utils/utils";

const base = process.env.PAYPAL_API_URL;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET

export type CreateOrderResponse = {
	success: boolean
	paypalOrderId?: string
	error?: string
	order?: any
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
	try {
		if (req.method === 'POST') {
			const { cart, customer, customerNote } = req.body
			if (!customer) {
				throw new Error('Customer data is missing')
			}
			if (!cart) {
				throw new Error('Cart or customer data is missing')
			}
			if (Number(cart.totals.total) === 0) {
				throw new Error('Cart amount is 0')
			}
			const orderPayload = await prepareOrderPayload(cart, customer, api)
			const { data: order } = await api.post("orders", {
				payment_method: 'paypal',
				payment_method_title: 'PayPal',
				payment_method_reference: 'paypal',
				...orderPayload,
				meta_data: [
					{
						key: 'vat',
						value: customer.billing.vat ?? ''
					}
				],
				customer_note: customerNote
			})
			const amount = Number(order.total)
			if (amount === 0) {
				await api.delete(`orders/${order.id}`, { force: true })
				throw new Error('Order amount is 0')
			}
			const paypalOrder = await createOrder(amount, order.id)
			responseData.paypalOrderId = paypalOrder.id

			responseData.success = true
			return res.json(responseData)
		}
		if (req.method === 'PUT') {
			const { paypalOrderId } = req.body
			if (!paypalOrderId) {
				throw new Error('Paypal Order ID is missing')
			}
			const capture = await captureOrder(paypalOrderId)
			const orderId = capture.purchase_units[0].reference_id
			responseData.success = capture.status === 'COMPLETED'

			if (responseData.success && orderId) {
				const { data: order} = await api.put(`orders/${orderId}`, { set_paid: true })
				responseData.order = order
			}
		}
		if (req.method === 'DELETE') {
			const { paypalOrderId } = req.body
			if (!paypalOrderId) {
				throw new Error('PayPal order ID is missing')
			}
			const payPalOrder = await getOrder(paypalOrderId)
			const orderId = payPalOrder.purchase_units[0].reference_id
			const isSuccess = payPalOrder.status === 'COMPLETED'
			if (isSuccess) {
				throw new Error('Cannot delete a completed order')
			}
			if (!orderId) {
				throw new Error('Order ID not found')
			}
			await api.delete(`orders/${orderId}`, { force: true })
			responseData.success = true
		}
	} catch (error) {
		console.error(error)
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

/**
 * Get the created order.
 */
const getOrder = async (orderID: string) => {
	const accessToken = await generateAccessToken();

	const response = await fetch(`${base}/v2/checkout/orders/${orderID}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`
		},
	});

	return await response.json();
};