import type { NextApiRequest, NextApiResponse } from 'next'
import {Cart} from "../../../src/types/cart-type";
import {fetchCartApi} from "../../../src/utils/store-api";

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
		return await fetchCartApi(req, res, '/update-item', JSON.stringify(req.body), 'POST')
	}
}