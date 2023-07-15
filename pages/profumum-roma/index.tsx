import React from "react";
import Layout from "../../src/layout/Layout";
import {getCategoryPageProps} from "../../src/utils/wordpress_api";
import { PageBaseProps} from "../../src/types/settings";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import {getProducts} from "../api/products";
import {PROFUMUM_ROMA_SUB_PATH} from "../../src/utils/endpoints";

const FragranceTop = dynamic(() => import("../../src/components/CategoryTop"))
const FragranceProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"))
const FragrancesBottom = dynamic(() => import("../../src/components/CategoryBottom"))

export type FragranceProps = PageBaseProps & {
	productCategory: WooProductCategory,
	products: BaseProduct[],
}
export default function Fragrance({ productCategory, products, layout }: FragranceProps) {
	return (
		<Layout layout={layout}>
			<FragranceTop
				name={productCategory.name}
				gallery={productCategory.acf.gallery}
				description={productCategory.description}
			/>
			<FragranceProductGrid products={products} />
			<FragrancesBottom bottomText={productCategory.acf.bottomText} />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locale: 'it' | 'en'}) {
	const [
		{ productCategory, layout: {ssrTranslations, ...layout} }
	] = await Promise.all([
		getCategoryPageProps(locale, PROFUMUM_ROMA_SUB_PATH)
	]);
	if (!productCategory) {
		return {
			notFound: true
		}
	}
	const products = await getProducts({
		categories: PROFUMUM_ROMA_SUB_PATH,
		lang: locale,
		per_page: '99',
		fragrances: true
	})
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Profumum Roma', href: urlPrefix + '/'+PROFUMUM_ROMA_SUB_PATH }
	]
	return {
		props: {
			layout: {
				...layout,
				breadcrumbs,
			},
			productCategory,
			products,
			...ssrTranslations
		},
		revalidate: 10
	}
}