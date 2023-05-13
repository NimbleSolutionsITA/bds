import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {ProductTag} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	tags?: ProductTag[]
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
	try {
		const data = await getProductTags(lang)
		responseData.success = true
		responseData.tags = data
		res.json(responseData)
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

export const getProductTags = async (
	lang?: string | string[] | undefined
): Promise<ProductTag[]> => {
	let page = 1
	let { data } = await api.get(
		'products/tags',
		{
			per_page: 99,
			page,
			lang
		}
	)
	let result = data
	while (data.length === 99) {
		page++
		let { data } = await api.get(
			'products/tags',
			{
				per_page: 99,
				page,
				lang
			}
		)
		result = [...data, ...result]
	}
	return result.map((tag: ProductTag) => ({
		id: tag.id,
		name: tag.name,
		slug: tag.slug,
		count: tag.count,
		filter: tag.filter,
	}))
}
