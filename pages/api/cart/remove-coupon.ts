import type { NextApiRequest, NextApiResponse } from 'next'
import {Cart} from "../../../src/types/cart-type";
import {fetchStoreApi} from "../../../src/utils/store-api";

export type CreateOrderResponse = {
	success: boolean
	cart?: Cart
	error?: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateOrderResponse>
) {
	const responseData: CreateOrderResponse = {
		success: false,
	}
	if (req.method === 'POST') {
		try {
			responseData.cart = await fetchStoreApi<Cart>(req, res, 'cart/remove-coupon', 'POST', req.body.code)
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