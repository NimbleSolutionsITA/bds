import type { NextApiRequest, NextApiResponse } from 'next'
import {BaseProduct} from "../../../src/types/woocommerce";
import {WORDPRESS_SITE_URL} from "../../../src/utils/endpoints";

type Data = {
	success: boolean
	products?: any[]
	error?: string
}

export type ProductsRequestQuery = {
	per_page?: string | undefined,
	page?: string | undefined,
	categories?: string | string[] | undefined,
	stock_status?: string | undefined,
	lang?: string | undefined,
	name?: string | undefined,
	colors?: string | string[] | undefined,
	price_range?: string | string[] | undefined,
	tags?: string | string[] | undefined,
	sunglasses?: boolean | undefined,
	optical?: boolean | undefined
	man?: boolean | undefined
	woman?: boolean | undefined
	calibro?: string | string[] | undefined,
	calibro_ponte?: string | string[] | undefined,
	formato?: string | string[] | undefined,
	lente?: string | string[] | undefined,
	modello?: string | string[] | undefined,
	montatura?: string | string[] | undefined,
	montatura_lenti?: string | string[] | undefined,
	sort?: string | string[] | undefined
	fragrances?: boolean | undefined
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'GET') {
		const responseData: Data = {
			success: false,
		}
		const {
			per_page,
			page,
			categories,
			stock_status,
			lang,
			name,
			colors,
			price_range,
			tags,
			sunglasses,
			optical,
			man,
			woman,
			calibro,
			calibro_ponte,
			formato,
			lente,
			modello,
			montatura,
			montatura_lenti,
			sort,
			fragrances
		} = req.query;
		try {
			responseData.products = await getProducts({
				per_page: per_page?.toString(),
				page: page?.toString(),
				categories,
				stock_status: stock_status?.toString(),
				lang: lang?.toString(),
				name: name?.toString(),
				colors,
				price_range,
				tags,
				sunglasses: sunglasses === "true",
				optical: optical === "true",
				man: man === "true",
				woman: woman === "true",
				calibro,
				calibro_ponte,
				formato,
				lente,
				modello,
				montatura,
				montatura_lenti,
				sort,
				fragrances: fragrances === "true"
			})
			responseData.success = true
			res.json(responseData)
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

export const getProducts = async ({
      per_page,
      page,
      categories,
      stock_status,
      lang,
      name,
      colors,
      price_range,
      tags,
	  sunglasses,
	  optical,
      man,
      woman,
	  calibro,
	  calibro_ponte,
	  formato,
	  lente,
	  modello,
	  montatura,
	  montatura_lenti,
	  sort,
	  fragrances
}: ProductsRequestQuery): Promise<BaseProduct[]> => {
	const params = new URLSearchParams({
		...(per_page && { per_page: per_page.toString() }),
		...(page && { page: page.toString() }),
		...(categories && { categories: categories.toString() }),
		...(stock_status && { stock_status: stock_status.toString() }),
		...(lang && { lang: lang.toString() }),
		...(name && { name: name.toString() }),
		...(colors && { colors: colors.toString() }),
		...(price_range && { price_range: price_range.toString() }),
		...(tags && { tags: tags.toString() }),
		...(sunglasses && { sunglasses: 'true' }),
		...(optical && { optical: 'true' }),
		...(man && { man: 'true' }),
		...(woman && { woman: 'true' }),
		...(calibro && { calibro: calibro.toString() }),
		...(calibro_ponte && { calibro_ponte: calibro_ponte.toString() }),
		...(formato && { formato: formato.toString() }),
		...(lente && { lente: lente.toString() }),
		...(modello && { modello: modello.toString() }),
		...(montatura && { montatura: montatura.toString() }),
		...(montatura_lenti && { montatura_lenti: montatura_lenti.toString() }),
		...(sort && { sort: sort.toString() }),
		...(fragrances && { fragrances: 'true' }),
	});
	return await fetch(`${WORDPRESS_SITE_URL}/wp-json/nimble/v1/products?${params.toString()}`)
		.then(res => res.json())
}

export const getAllProducts = async (params: ProductsRequestQuery): Promise<BaseProduct[]> => {
	const products: BaseProduct[] = []
	let page = 1
	let total = 99
	while (total === 99) {
		const response = await getProducts({
			...params,
			per_page: '99',
			page: page.toString()
		})
		products.push(...response)
		page++
		total = response.length
	}
	return products
}
