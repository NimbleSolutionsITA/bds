import type { NextApiRequest, NextApiResponse } from 'next'
import {Cart} from "../../../src/types/cart-type";
import {fetchCartApi, fetchCartProducts} from "../../../src/utils/store-api";

export type GetNonceResponse = {
	success: boolean
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
			responseData.cart = await fetchCartProducts(req.body)
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