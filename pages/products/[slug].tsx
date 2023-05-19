import React from "react";
import Layout from "../../src/layout/Layout";
import {BreadCrumb, Menus} from "../../src/types/settings";
import {GooglePlaces} from "../api/google-places";
import {Product as ProductType} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getLayoutProps} from "../../src/utils/wordpress_api";
import {getProduct} from "../api/products/[slug]";
import {MAIN_CATEGORIES} from "../../src/utils/utils";

const ProductView = dynamic(() => import('../../src/pages/product/ProductView'), { ssr: false });
const ProductsSlider = dynamic(() => import('../../src/components/ProductsSlider'), { ssr: false });
const SeoFooter = dynamic(() => import('../../src/pages/product/SeoFooter'), { ssr: false });

export type DesignerProps = {
	menus: Menus,
	googlePlaces: GooglePlaces,
	product: ProductType,
	breadcrumbs?: BreadCrumb[]
}
export default function Product({
	menus, googlePlaces, product, breadcrumbs
}: DesignerProps) {
	const category = product.categories.find((category) => MAIN_CATEGORIES.includes(category.parent)) ?? product.categories[0];
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ProductView product={product} category={category} />
			<ProductsSlider products={product.related ?? []} title="Prodotti correlati" />
			<SeoFooter category={category} />
		</Layout>
	);
}

export async function getStaticProps({ locale, params: {slug} }: { locales: string[], locale: string, params: { slug: string }}) {
	const [
		{ menus, googlePlaces },
		product
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
			menus,
			googlePlaces,
			product,
			breadcrumbs
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
