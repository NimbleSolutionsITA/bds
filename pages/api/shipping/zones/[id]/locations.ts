import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {SippingZoneLocation} from "../../../../../src/types/woocommerce";
import {WORDPRESS_SITE_URL} from "../../../../../src/utils/endpoints";

type Data = {
	success: boolean
	shippingZoneLocations?: SippingZoneLocation[]
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
			const zoneId = req.query.id as string
			const data = await getShippingZoneLocations(zoneId)
			if (!data) {
				responseData.error = "Shipping zone locations not found"
				res.status(404).json(responseData);
			} else {
				responseData.success = true
				responseData.shippingZoneLocations = data
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

export const getShippingZoneLocations = async (zoneId: string) => {
	const { data } = await api.get('shipping/zones/'+zoneId+'/locations')
	return data.map((location: SippingZoneLocation) => ({
		code: location.code,
		type: location.type,
	})) ?? null
}
