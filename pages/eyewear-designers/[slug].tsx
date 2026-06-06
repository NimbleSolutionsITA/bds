import React from "react";
import Layout from "../../src/layout/Layout";
import {getCategoryPageProps} from "../../src/utils/wordpress_api";
import {PageBaseProps} from "../../src/types/settings";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getProducts} from "../api/products";
import {DESIGNERS_SUB_PATH} from "../../src/utils/endpoints";
import {EYEWEAR_CATEGORY, LOCALE} from "../../src/utils/utils";
import {cacheGetProductCategories} from "../../src/utils/cache";

const DesignerTop = dynamic(() => import("../../src/components/CategoryTop"))
const DesignerProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"))
const DesignersBottom = dynamic(() => import("../../src/components/CategoryBottom"))

export type DesignerProps = PageBaseProps & {
	productCategory: WooProductCategory,
	products: BaseProduct[]
	locale: LOCALE
}
export default function Designer({
  productCategory, products, layout, locale
}: DesignerProps) {
	return (
		<Layout key={productCategory.slug} layout={layout}>
			<DesignerTop
				name={productCategory.name}
				description={productCategory.description}
			/>
			<DesignerProductGrid
				products={products}
				lazyLoad={{ categorySlug: productCategory.slug, lang: locale }}
			/>
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
	const products = await getProducts({
		categories: slug,
		lang: locale,
		per_page: '24',
	})
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Designers', href: urlPrefix + '/'+DESIGNERS_SUB_PATH },
		{ name: sanitize(productCategory.name), href: urlPrefix +  '/'+DESIGNERS_SUB_PATH+'/' + productCategory.slug },
	]
	const slimProductCategory = {
		...productCategory,
		acf: { bottomText: productCategory.acf?.bottomText ?? '', gallery: [] }
	}
	return {
		props: {
			layout: {
				...layout,
				breadcrumbs,
			},
			productCategory: slimProductCategory,
			products,
			locale,
			...ssrTranslations
		},
		revalidate: 10
	}
}

export async function getStaticPaths({ locales }: { locales: LOCALE[] }) {
	if (process.env.DISABLE_DYNAMIC_BUILD) {
		return { paths: [], fallback: 'blocking' as const };
	}
	const productCategories = await Promise.all(locales.map(async (locale) => await cacheGetProductCategories(locale, EYEWEAR_CATEGORY[locale])));
	return {
		paths: productCategories.flat().map(({slug, lang}) => ({ params: { slug }, locale: lang })),
		fallback: 'blocking' as const,
	};
}
