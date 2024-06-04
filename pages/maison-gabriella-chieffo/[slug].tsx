import React from "react";
import Layout from "../../src/layout/Layout";
import {getCategoryPageProps} from "../../src/utils/wordpress_api";
import { PageBaseProps} from "../../src/types/settings";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getProductCategories} from "../api/products/categories";
import {getAllProducts} from "../api/products";
import { MAISON_GABRIELLA_CHIEFFO_CATEGORY} from "../../src/utils/utils";
import {
	FRAGRANCES_SUB_PATH,
	MAISON_GABRIELLA_CHIEFFO_SUB_PATH
} from "../../src/utils/endpoints";

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

export async function getStaticProps({ locale, params: {slug} }: { locales: string[], locale: 'it' | 'en', params: { slug: string }}) {
	const [
		{ productCategory, layout: {ssrTranslations, ...layout} }
	] = await Promise.all([
		getCategoryPageProps(locale, slug)
	]);
	if (!productCategory) {
		return {
			notFound: true
		}
	}
	const products = await getAllProducts({
		categories: slug,
		lang: locale,
		per_page: '99',
		fragrances: true
	})
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Fragranze', href: urlPrefix + '/'+FRAGRANCES_SUB_PATH },
		{ name: sanitize(productCategory.name), href: urlPrefix +  '/'+MAISON_GABRIELLA_CHIEFFO_SUB_PATH+'/' + productCategory.slug },
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

export async function getStaticPaths() {
	const productCategories = await getProductCategories();
	const paths = productCategories.filter(({parent}) => parent && [
			MAISON_GABRIELLA_CHIEFFO_CATEGORY.it,
		MAISON_GABRIELLA_CHIEFFO_CATEGORY.en
		].includes(parent))
		.map(({slug}: WooProductCategory) => ({ params: { slug } }));
	return {
		paths,
		fallback: 'blocking',
	};
}
