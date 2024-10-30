import React from "react";
import Layout from "../../src/layout/Layout";
import {getCategoryPageProps} from "../../src/utils/wordpress_api";
import {PageBaseProps} from "../../src/types/settings";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getAllProducts} from "../api/products";
import {DESIGNERS_SUB_PATH} from "../../src/utils/endpoints";
import {EYEWEAR_CATEGORY, LOCALE} from "../../src/utils/utils";
import {cacheGetProductCategories} from "../../src/utils/cache";

const DesignerTop = dynamic(() => import("../../src/components/CategoryTop"))
const DesignerProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"))
const DesignersBottom = dynamic(() => import("../../src/components/CategoryBottom"))

export type DesignerProps = PageBaseProps & {
	productCategory: WooProductCategory,
	products: BaseProduct[]
}
export default function Designer({
  productCategory, products, layout
}: DesignerProps) {
	return (
		<Layout key={productCategory.slug} layout={layout}>
			<DesignerTop
				name={productCategory.name}
				gallery={productCategory.acf.gallery}
				description={productCategory.description}
			/>
			<DesignerProductGrid products={products} />
			<DesignersBottom bottomText={productCategory.acf.bottomText} />
		</Layout>
	);
}

export async function getStaticProps({ locale, params: {slug} }: { locales: string[], locale: LOCALE, params: { slug: string }}) {
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
	})
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Designers', href: urlPrefix + '/'+DESIGNERS_SUB_PATH },
		{ name: sanitize(productCategory.name), href: urlPrefix +  '/'+DESIGNERS_SUB_PATH+'/' + productCategory.slug },
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

export async function getStaticPaths({ locales }: { locales: LOCALE[] }) {
	const productCategories = await Promise.all(locales.map(async (locale) => await cacheGetProductCategories(locale, EYEWEAR_CATEGORY[locale])));
	return {
		paths: process.env.DISABLE_DYNAMIC_BUILD ? [] : productCategories.flat().map(({slug, lang}) => ({ params: { slug }, locale: lang })),
		fallback: 'blocking',
	};
}
