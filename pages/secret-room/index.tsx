import React from "react";
import Layout from "../../src/layout/Layout";
import {getCategoryPageProps} from "../../src/utils/wordpress_api";
import {PageBaseProps} from "../../src/types/settings";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import {getProducts} from "../api/products";
import {LOCALE} from "../../src/utils/utils";

const DesignerTop = dynamic(() => import("../../src/components/CategoryTop"))
const DesignerProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"))
const DesignersBottom = dynamic(() => import("../../src/components/CategoryBottom"))

export type DesignerProps = PageBaseProps & {
	productCategory: WooProductCategory,
	products: BaseProduct[]
	locale: LOCALE
}

export default function SecretRoom({
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

export async function getStaticProps({ locale }: { locales: string[], locale: LOCALE}) {
	const slug = 'secret-room'
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
		{ name: 'Secret Room', href: urlPrefix + '/secret-room' },
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
