import {NextApiRequest, NextApiResponse} from "next";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {Cart} from "./cart-type";
import {CreateOrderResponse} from "../../pages/api/cart/add-item";

const api = new WooCommerceRestApi({
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});

export const fetchCartApi = async (req: NextApiRequest, res: NextApiResponse, endpoint = '', body = '', method = 'GET') => {
	const responseData: CreateOrderResponse = {
		success: false,
	}
	try {
		const clientCookies = req.headers.cookie;
		let nonce = req.cookies['wp-api-nonce'] || null;
		let cartToken = req.cookies['wp-api-cart-token'] || null;
		if (!nonce) {
			throw new Error('Nonce not found')
		}
		const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL + '/wp-json/wc/store/v1/cart' + endpoint, {
			method,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': req.cookies['wp-cookies'] ?? '',
				...(nonce && cartToken ? {
					'Nonce': nonce ,
					'Cart-Token': cartToken,
					'X-Wc-Store-Api-Nonce': nonce
				} : {})
			},
			...(body !== "" && {body})
		})
		const cookiesArray = response.headers.get('set-cookie');
		console.log({cookiesArray})
		const responseCookies = response.headers.get('Set-Cookie')?.split(/,(?=(?:(?:[^"]*"[^"]*")*[^"]*$))/);
		nonce = response.headers.get('Nonce');
		cartToken = response.headers.get('Cart-Token');
		console.log(responseCookies)
		res.setHeader('Set-Cookie', [
			`wp-api-nonce=${nonce}; Path=/`,
			`wp-api-cart-token=${cartToken}; Path=/`,
			`wp-cookies=${responseCookies}; Path=/`
		])
		const cart = await response.json()
		responseData.cart = await fetchCartProducts(cart)
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

export const fetchCartProducts = async (cart: Cart) => {
	const items = await Promise.all(cart.items.map(async (item) => {
		const url = new URL(item.permalink);
		const slug = url.pathname.split('/products/')[1].split('/')[0];
		const { data } = await api.get('products/', { slug })
		const product = data[0] ?? null
		return {
			...item,
			product_id: product?.id ?? item.id,
			variation_id: product?.type === 'variable' ? item.id : null,
			slug: product?.slug ?? slug,
			categories: product?.categories ?? []
		}
	}))
	return {
		...cart,
		items
	} as Cart
}