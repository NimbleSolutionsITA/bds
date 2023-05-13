import type { NextApiRequest, NextApiResponse } from 'next'
import {BaseProduct} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	products?: any[]
	error?: string
}

export type ProductsRequestQuery = {
	per_page?: string | undefined,
	page?: string | undefined,
	categories?: string | string[] | undefined,
	stock_status?: string | undefined,
	lang?: string | undefined,
	name?: string | undefined,
	colors?: string | string[] | undefined,
	price_range?: string | string[] | undefined,
	tags?: string | string[] | undefined,
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'GET') {
		const responseData: Data = {
			success: false,
		}
		const {
			per_page,
			page,
			categories,
			stock_status,
			lang,
			name,
			colors,
			price_range,
			tags,
		} = req.query;
		try {
			responseData.products = await getProducts({
				per_page: per_page?.toString(),
				page: page?.toString(),
				categories,
				stock_status: stock_status?.toString(),
				lang: lang?.toString(),
				name: name?.toString(),
				colors,
				price_range,
				tags,
			})
			responseData.success = true
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
}

export const getProducts = async ({
      per_page,
      page,
      categories,
      stock_status,
      lang,
      name,
      colors,
      price_range,
      tags
}: ProductsRequestQuery): Promise<BaseProduct[]> => {
	const params = new URLSearchParams({
		...(per_page && { per_page: per_page.toString() }),
		...(page && { page: page.toString() }),
		...(categories && { categories: categories.toString() }),
		...(stock_status && { stock_status: stock_status.toString() }),
		...(lang && { lang: lang.toString() }),
		...(name && { name: name.toString() }),
		...(colors && { colors: colors.toString() }),
		...(price_range && { price_range: price_range.toString() }),
		...(tags && { tags: tags.toString() }),
	});
	return await fetch(`${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/nimble/v1/products?${params.toString()}`)
		.then(res => res.json())
}
