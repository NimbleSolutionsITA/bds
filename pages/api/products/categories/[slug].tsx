import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

type Data = {
	success: boolean
	productCategory?: any
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
	const lang = req.query.lang;
	const slug = req.query.slug;
	if (req.method === 'GET') {
		try {
			const data = await getProductCategory(lang as string, slug as string)
			if (!data) {
				responseData.error = "Product category not found"
				res.status(404).json(responseData);
			} else {
				responseData.success = true
				responseData.productCategory = data
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

export const getProductCategory = async (lang: string, slug: string) => {
	const { data } = await api.get(
		'products/categories',
		{
			per_page: 99,
			lang,
			slug
		}
	)
	return data[0] ?? null
}
