import React from "react";
import Layout from "../../src/layout/Layout";
import {PageBaseProps} from "../../src/types/settings";
import {Product as ProductType} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getLayoutProps} from "../../src/utils/wordpress_api";
import {getProduct} from "../api/products/[slug]";
import {MAIN_CATEGORIES} from "../../src/utils/utils";

const ProductView = dynamic(() => import('../../src/pages/product/ProductView'), { ssr: false });
const ProductsSlider = dynamic(() => import('../../src/components/ProductsSlider'), { ssr: false });
const SeoFooter = dynamic(() => import('../../src/pages/product/SeoFooter'), { ssr: false });

export type ProductPageProps = PageBaseProps & {
	product: ProductType,
}
export default function Product({ product, layout }: ProductPageProps) {
	const category = product.categories.find((category) => MAIN_CATEGORIES.includes(category.parent)) ?? product.categories[0];
	return (
		<Layout layout={layout}>
			<ProductView product={product} category={category} shipping={layout.shipping} />
			<ProductsSlider products={product.related ?? []} title="Prodotti correlati" />
			<SeoFooter category={category} />
		</Layout>
	);
}

export async function getStaticProps({ locale, params: {slug} }: { locales: string[], locale: 'it' | 'en', params: { slug: string }}) {
	const [
		layoutProps,
		product,
	] = await Promise.all([
		getLayoutProps(locale),
		getProduct(slug, locale)
	]);
	if (typeof product === 'string') {
		return {
			notFound: true
		}
	}
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Shop', href: urlPrefix + '/shop' },
		{ name: sanitize(product.name), href: urlPrefix +  '/designers/' + slug },
	]
	return {
		props: {
			layout: {
				...layoutProps,
				breadcrumbs
			},
			product,
		},
		revalidate: 10
	}
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	};
}
