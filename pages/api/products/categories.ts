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
	let { data } = await api.get(
		'products/categories',
		{
			per_page: 99,
			page,
			parent,
			lang
		}
	);
	let result = data;

	while (data.length === 99) {
		page++;
		console.log({ page });

		// Fetch new data and store it in a new variable
		const response = await api.get(
			'products/categories',
			{
				per_page: 99,
				page,
				parent,
				lang
			}
		);
		data = response.data;
		result = [...result, ...data];
	}

	return result;

}

export const getProductCategory = async (
	lang?: string | string[] | undefined,
	slug?: string | string[] | undefined
): Promise<WooProductCategory> => {
	let { data } = await api.get(
		'products/categories',
		{
			per_page: 1,
			slug,
			lang
		}
	)
	if (data.length === 0) {
		throw new Error("Category not found")
	}
	return data[0]
}
