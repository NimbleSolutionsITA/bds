import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WooProductCategory} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	productCategories?: any[]
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
	const parent = req.query.parent;
	try {
		const data = await getProductCategories(lang, parent)
		responseData.success = true
		responseData.productCategories = data
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

export const getProductCategories = async (
	lang?: string | string[] | undefined,
	parent?: string | string[] | undefined
): Promise<WooProductCategory[]> => {
	let page = 1
	let { data } = await api.get(
		'products/categories',
		{
			per_page: 99,
			page,
			parent,
			lang
		}
	)
	let result = data
	while (data.length === 99) {
		page++
		let { data } = await api.get(
			'products/categories',
			{
				per_page: 99,
				page,
				parent,
				lang
			}
		)
		result = [...data, ...result]
	}
	return result
}
