import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {ShippingZone} from "../../../../src/types/woocommerce";
import {WORDPRESS_SITE_URL} from "../../../../src/utils/endpoints";

type Data = {
	success: boolean
	shippingZones?: ShippingZone[]
	error?: string
}

const api = new WooCommerceRestApi({
	url: WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3"
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const responseData: Data = {
		success: false,
	}
	if (req.method === 'GET') {
		try {
			const data = await getShippingZones()
			if (!data) {
				responseData.error = "Shipping zones not found"
				res.status(404).json(responseData);
			} else {
				responseData.success = true
				responseData.shippingZones = data
				res.json(responseData)
			}
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

export const getShippingZones = async () => {
	const { data } = await api.get('shipping/zones')
	return data.map((zone: ShippingZone) => ({
		id: zone.id,
		name: zone.name,
		order: zone.order
	})) ?? null
}
