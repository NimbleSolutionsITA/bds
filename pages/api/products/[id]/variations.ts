import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

type Data = {
	success: boolean
	productVariations?: any
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
			const data = await getProductVariations(id as string)
			if (!data[0]) {
				responseData.error = "Product variations not found"
				res.status(404).json(responseData);
			} else {
				responseData.success = true
				responseData.productVariations = data
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

export const getProductVariations = async (id: string) => {
	const { data } = await api.get(
		'products/' + id + '/variations',
		{
			per_page: 99
		}
	)
	return data
}
