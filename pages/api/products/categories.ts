import type { NextApiRequest, NextApiResponse } from 'next'
import { wooApi as api } from "../../../src/utils/woocommerce";
import {WooProductCategory} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	productCategories?: any[]
	error?: string
}


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
