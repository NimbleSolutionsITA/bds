import React from "react";
import Layout from "../../src/layout/Layout";
import {getCategoryPageProps} from "../../src/utils/wordpress_api";
import {PageBaseProps} from "../../src/types/settings";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getProductCategories} from "../api/products/categories";
import {getAllProducts} from "../api/products";
import {DESIGNERS_SUB_PATH, DESIGNERS_CATEGORY} from "../../src/utils/endpoints";

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
		<Layout layout={layout}>
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

export async function getStaticPaths() {
	const productCategories = await getProductCategories();
	const designersCategoryIds = productCategories.filter(({slug}) => slug === DESIGNERS_CATEGORY).map(f => f.id);
	const paths = productCategories.filter(({parent}) => parent && designersCategoryIds.includes(parent))
		.map(({slug, parent}: WooProductCategory) => ({ params: { slug, page: productCategories.find(({id}) => id === parent)?.slug } }));

	return {
		paths,
		fallback: 'blocking',
	};
}
