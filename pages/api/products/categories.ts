import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {WooProductCategory} from "../../../src/types/woocommerce";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";

type Data = {
	success: boolean
	productCategories?: any[]
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
	res: NextApiResponse<Data>
) {
	const responseData: Data = {
		success: false,
	}
	const lang = req.query.lang;
	const parent = req.query.parent;
	try {
		const data = await getProductCategories(lang, parent ? Number(parent) : undefined)
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
	parent?: number | undefined
): Promise<WooProductCategory[]> => {
	let page = 1;
	let total = 99
	let categories: WooProductCategory[] = []

	while (total === 99) {
		const {data} = await api.get(
			'products/categories',
			{
				per_page: 99,
				page,
				parent,
				lang
			}
		);
		categories.push(...data);
		page++;
		total  = data.length
	}

	return categories;

}

export const getProductCategory = async (
	lang?: string | string[] | undefined,
	slug?: string | string[] | undefined
): Promise<WooProductCategory | null> => {
	try {
		let { data } = await api.get(
			'products/categories',
			{
				per_page: 1,
				slug,
				lang
			}
		)
		return data.length > 0 ? data[0] : null;
	} catch (error) {
		console.error('Error fetching product category:', error);
		return null;
	}
}
