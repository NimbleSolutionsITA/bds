import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../../src/utils/endpoints";
import {generateAccessToken} from "../index";

const base = process.env.PAYPAL_API_URL;

export type CreateOrderResponse = {
	success: boolean
	error?: string
	wooOrder?: any
	payPalOrder?: any
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
			const paypalOrderId = req.query.id as string;
			if (!paypalOrderId) {
				throw new Error('Paypal Order ID is missing')
			}
			responseData.payPalOrder = await captureOrder(paypalOrderId)
			const orderId = responseData.payPalOrder.purchase_units[0].reference_id
			responseData.success = responseData.payPalOrder.status === 'COMPLETED'
			if (responseData.success && orderId) {
				const { data: order} = await api.put(`orders/${orderId}`, { set_paid: true })
				responseData.wooOrder = order
			}
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