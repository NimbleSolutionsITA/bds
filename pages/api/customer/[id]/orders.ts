import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WORDPRESS_SITE_URL} from "../../../../src/utils/endpoints";

export type CreateOrderResponse = {
	success: boolean
	orders?: any
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
	if (req.method === 'GET') {
		try {
			const id = req.query.id as string;
			const {data} = await api.get(`orders`, {
				customer: id
			})

			responseData.success = true
			responseData.orders = data
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
}