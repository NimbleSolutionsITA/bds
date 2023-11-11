import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {ShippingMethod, SippingZoneLocation} from "../../../../../src/types/woocommerce";
import {WORDPRESS_SITE_URL} from "../../../../../src/utils/endpoints";

type Data = {
	success: boolean
	shippingZoneMethods?: ShippingMethod[]
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
			const lang = req.query.lang as string ?? 'it'
			const data = await getShippingZoneMethods(zoneId, lang)
			if (!data) {
				responseData.error = "Shipping zone locations not found"
				res.status(404).json(responseData);
			} else {
				responseData.success = true
				responseData.shippingZoneMethods = data
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

export const getShippingZoneMethods = async (zoneId: string, lang: string) => {
	const { data } = await api.get('shipping/zones/'+zoneId+'/methods')
	return data.map((method: any) => ({
		id: method.id,
		order: method.order,
		title: lang === 'en' ? method.method_title : method.title,
		enabled: method.enabled,
		methodId: method.method_id,
		cost: method.settings?.cost?.value ?? '0',
		requires: method.settings?.requires?.value ?? '',
		minAmount: method.settings?.min_amount?.value ?? '0',
		ignoreDiscounts: method.settings?.ignore_discounts?.value ?? 'no',
	})) ?? null
}
