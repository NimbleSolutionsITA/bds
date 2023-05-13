import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {Product} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	product?: Product
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
	res: NextApiResponse<Data>
) {
	const responseData: Data = {
		success: false,
	}
	const id = req.query.id;
	if (req.method === 'GET') {
		try {
			const data = await getProduct(id as string)
			if (!data) {
				responseData.error = "Product not found"
				res.status(404).json(responseData);
			} else {
				responseData.success = true
				responseData.product = data
				res.json(responseData)
			}
		}
		catch ( error ) {
			if (typeof error === "string") {
				responseData.error = error
			} else if (error instanceof Error) {
				responseData.error = error.message
			}
			res.status(500).json(responseData)
		}
	}
}

export const getProduct = async (id: string) => {
	const { data } = await api.get(
		'products/' + id
	)
	return data
}
