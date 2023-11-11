import type { NextApiRequest, NextApiResponse } from 'next'
import {Attribute, Color} from "../../../src/types/woocommerce";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";

type Data = {
	success: boolean
	data?: {
		colors: Color[]
		attributes: Attribute[]
	}
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
			responseData.data = await getAttributes(req.query.lang?.toString() ?? 'it')
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

export const getAttributes = async (lang: string): Promise<{
	colors: Color[]
	attributes: Attribute[]
}> => {
	return await fetch(`${WORDPRESS_SITE_URL}/wp-json/nimble/v1/attributes?lang=${lang}`)
		.then(res => res.json())
}
