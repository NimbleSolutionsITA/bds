import type { NextApiRequest, NextApiResponse } from 'next'
import {Cart} from "../../../src/types/cart-type";
import {fetchCartApi, fetchCartProducts} from "../../../src/utils/store-api";

export type GetNonceResponse = {
	success: boolean
	nonce?: string
	cart?: Cart
	error?: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GetNonceResponse>
) {
	let responseData: GetNonceResponse = {
		success: false,
	}
	if (req.method === 'GET') {
		try {
			let nonce = req.cookies['wp-api-nonce'] || null;
			const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL + '/wp-json/wc/store/v1/cart', {
				headers: {
					Nonce: nonce ?? ''
				}
			})
			nonce = response.headers.get('Nonce');
			res.setHeader('Set-Cookie', `wp-api-nonce=${nonce}; Path=/`)
			responseData.cart = await fetchCartProducts(await response.json())
			responseData.nonce = nonce ?? undefined
			responseData.success = true
		}
		catch ( error ) {
			if (typeof error === "string") {
				responseData.error = error
			} else if (error instanceof Error) {
				responseData.error = error.message
			}
			res.status(500)
		}
		return res.json(responseData)
	}
}