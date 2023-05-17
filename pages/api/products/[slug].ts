import type { NextApiRequest, NextApiResponse } from 'next'
import {Product} from "../../../src/types/woocommerce";

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
			const data = await getProduct(slug, lang)
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

export const getProduct = async (slug: string, lang: string): Promise<Product | string> => {
	const params = new URLSearchParams({slug, lang})
	return await fetch(`${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/nimble/v1/product?${params.toString()}`)
		.then(res => res.json())
}
