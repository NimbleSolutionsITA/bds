import type { NextApiRequest, NextApiResponse } from 'next'
import {Color} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	colors?: Color[]
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
		try {
			responseData.colors = await getColors(req.query.lang?.toString() ?? 'it')
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

export const getColors = async (lang: string): Promise<Color[]> => {
	return await fetch(`${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/nimble/v1/colors?lang=${lang}`)
		.then(res => res.json())
}
