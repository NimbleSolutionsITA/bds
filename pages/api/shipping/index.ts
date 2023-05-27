import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {Country, ShippingClass, ShippingZone} from "../../../src/types/woocommerce";

type Data = {
	success: boolean
	shipping?: {
		classes: ShippingClass[],
		countries: Country[]
	}
	error?: string
}

const api = new WooCommerceRestApi({
	url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ?? '',
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
		const lang = req.query.lang as string ?? 'it';
		try {
			const data = await getShippingInfo(lang)
			if (!data) {
				responseData.error = "Shipping zones not found"
				res.status(404).json(responseData);
			} else {
				responseData.success = true
				responseData.shipping = data
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
export const getShippingInfo = async (lang: string) => {
	const { data } = await api.get('shipping/zones')
	const { data: allCountries} = await api.get('data/countries/')
	let countries: Country[] = [];
	const classes = await Promise.all(await data.map(async (zone: ShippingZone) => {
		const { data: methods } = await api.get(`shipping/zones/${zone.id}/methods`)
		const { data: locations } = await api.get(`shipping/zones/${zone.id}/locations`)
		return {
			id: zone.id,
			name: zone.name,
			order: zone.order,
			methods: methods.map((method: any) => ({
				id: method.id,
				order: method.order,
				title: lang === 'en' ? method.method_title : method.title,
				enabled: method.enabled,
				methodId: method.method_id,
				cost: method.settings?.cost?.value ?? '0',
				requires: method.settings?.requires?.value ?? '',
				minAmount: method.settings?.min_amount?.value ?? '0',
				ignoreDiscounts: method.settings?.ignore_discounts?.value ?? 'no',
			})),
			locations: (await Promise.all(locations.map(async (location: any) => {
				switch (location.type) {
					case 'country':
						const country = allCountries.find((c: any) => c.code === location.code)
						if (!countries.some(item => item.code === country.code)) {
							countries.push({
								code: country.code,
								name: country.name,
								states: country.states
							})
						}
						return location.code
					case 'continent':
						const { data: continent} = await api.get('data/continents/'+location.code)
						return continent.countries.map((c: Country) => {
							const country = allCountries.find((cc: any) => cc.code === c.code)
							if (!countries.some(item => item.code === country.code)) {
								countries.push({
									code: country.code,
									name: country.name,
									states: country.states
								})
							}
							return c.code
						})
						default: return []
				}
			}))).flat()
		}
	}))
	return {classes, countries} ?? null
}
