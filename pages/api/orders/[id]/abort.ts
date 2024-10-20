import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../../src/utils/endpoints";
import {generateAccessToken} from "../index";

const base = process.env.PAYPAL_API_URL;

export type CreateOrderResponse = {
	success: boolean
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
	try {
		if (req.method === 'PUT') {
			await api.put(`orders/${req.query.id}`, {
				status: req.body.isFailed ? 'failed' : 'cancelled'
			})
		} else {
			throw new Error('Method not allowed')
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