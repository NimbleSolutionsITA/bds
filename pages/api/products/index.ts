import type { NextApiRequest, NextApiResponse } from 'next'
import {WORDPRESS_API_ENDPOINT} from "../../../src/utils/endpoints";

type Data = {
	success: boolean
	products?: any[]
	error?: string
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
			responseData.products = await fetch(`${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/nimble/v1/products?${params.toString()}`)
				.then(res => res.json())
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