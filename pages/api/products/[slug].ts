import type { NextApiRequest, NextApiResponse } from 'next'
import {Product} from "../../../src/types/woocommerce";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";
import {getProduct} from "../../../src/utils/wordpress_api";

type Data = {
	success: boolean
	product?: Product
	error?: string
}
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const responseData: Data = {
		success: false,
	}
	const slug = req.query.slug as string;
	const lang = req.query.lang as string;
	if (req.method === 'GET') {
		try {
			const data = await getProduct(lang, slug)
			if (!data || typeof  data === "string") {
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
