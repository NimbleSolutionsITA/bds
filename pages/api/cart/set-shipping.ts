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
	if (req.method === 'POST') {
		return await fetchCartApi(req, res, `/select-shipping-rate?package_id=${req.body.package_id}&rate_id=${req.body.rate_id}`, '', 'POST')
	}
}