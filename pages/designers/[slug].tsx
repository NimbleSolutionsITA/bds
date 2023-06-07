import React from "react";
import Layout from "../../src/layout/Layout";
import {getCategoryPageProps} from "../../src/utils/wordpress_api";
import {BreadCrumb, Menus} from "../../src/types/settings";
import {GooglePlaces} from "../api/google-places";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getProductCategories} from "../api/products/categories";
import {getProducts} from "../api/products";
import {EYEWEAR_CATEGORY} from "../../src/utils/utils";

const DesignerTop = dynamic(() => import("../../src/components/CategoryTop"))
const DesignerProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"))
const DesignersBottom = dynamic(() => import("../../src/components/CategoryBottom"))

export type DesignerProps = {
	menus: Menus,
	googlePlaces: GooglePlaces,
	productCategory: WooProductCategory,
	products: BaseProduct[],
	breadcrumbs?: BreadCrumb[]
}
export default function Designer({
  menus, googlePlaces, productCategory, products, breadcrumbs
}: DesignerProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
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
		{ productCategory, menus, googlePlaces }
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
		per_page: '24'
	})
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Designers', href: urlPrefix + '/designers' },
		{ name: sanitize(productCategory.name), href: urlPrefix +  '/designers/' + productCategory.slug },
	]
	return {
		props: {
			menus,
			googlePlaces,
			productCategory,
			breadcrumbs,
			products
		},
		revalidate: 10
	}
}

export async function getStaticPaths() {
	const productCategories = await getProductCategories(undefined);
	const paths = productCategories
		.filter(({parent}) => parent && [EYEWEAR_CATEGORY.it, EYEWEAR_CATEGORY.en].includes(parent))
		.map(({slug}: WooProductCategory) => ({ params: { slug } }));
	return {
		paths,
		fallback: 'blocking',
	};
}
