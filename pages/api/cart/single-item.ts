import type { NextApiRequest, NextApiResponse } from 'next'
import {Cart} from "../../../src/types/cart-type";
import {fetchCartProducts} from "../../../src/utils/store-api";

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
			// get nonce from cookies
			const nonce = req.cookies['wp-api-nonce']
			const cartToken = req.cookies['wp-api-cart-token']
			if (!nonce) {
				throw new Error('Nonce not found')
			}

			const deleteAll = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL + '/wp-json/wc/store/v1/cart/items/', {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Nonce': nonce,
					'Cart-Token': cartToken ?? '',
					'X-Wc-Store-Api-Nonce': nonce ?? ''
				}
			})

			if (!deleteAll.ok) {
				throw new Error('Failed to delete cart items');
			}
			const item = req.body
			const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL + '/wp-json/wc/store/v1/cart/add-item', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Nonce': nonce ?? '',
					'Cart-Token': cartToken ?? '',
					'X-Wc-Store-Api-Nonce': nonce ?? ''
				},
				body: JSON.stringify(item)
			})
			const cart = await response.json()
			responseData.cart = {
				...cart,
				items: await fetchCartProducts(cart.items)
			}
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