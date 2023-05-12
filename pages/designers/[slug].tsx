import React from "react";
import Layout from "../../src/layout/Layout";
import {getDesignerPageProps, getProducts} from "../../src/utils/wordpress_api";
import {BreadCrumb, Menus} from "../../src/types/settings";
import {GooglePlaces} from "../api/google-places";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import {NEXT_API_ENDPOINT} from "../../src/utils/endpoints";
import sanitize from "sanitize-html";

const DesignerTop = dynamic(() => import("../../src/pages/designers/DesignerTop"))
const DesignerProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"))
const DesignersBottom = dynamic(() => import("../../src/pages/designers/DesignersBottom"))

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

export async function getStaticProps({ locale, params: {slug} }: { locales: string[], locale: string, params: { slug: string }}) {
	const [
		{ productCategory, menus, googlePlaces }
	] = await Promise.all([
		getDesignerPageProps(locale, slug)
	]);
	if (!productCategory) {
		return {
			notFound: true
		}
	}
	console.log(slug)
	const { products } = await getProducts(locale, productCategory.slug)
	console.log({products: products.length})
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
	try {
		const {productCategories} = await (await fetch(`${NEXT_API_ENDPOINT}/products/categories?parent=188`).then(response => response.json()));
		const paths = productCategories.map(({slug}: WooProductCategory) => ({params: {slug}}));

		console.log(paths)
		return {
			paths,
			fallback: 'blocking',
		};
	} catch (e) {
		console.log(e)
	}
}
