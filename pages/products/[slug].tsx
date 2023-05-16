import React from "react";
import Layout from "../../src/layout/Layout";
import {BreadCrumb, Menus} from "../../src/types/settings";
import {GooglePlaces} from "../api/google-places";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";

export type DesignerProps = {
	menus: Menus,
	googlePlaces: GooglePlaces,
	productCategory: WooProductCategory,
	product: BaseProduct[],
	breadcrumbs?: BreadCrumb[]
}
export default function Product({
	menus, googlePlaces, productCategory, product, breadcrumbs
}: DesignerProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<div>PD</div>
		</Layout>
	);
}

export async function getStaticProps({ locale, params: {slug} }: { locales: string[], locale: string, params: { slug: string }}) {
	/*const [
		{ productCategory, menus, googlePlaces }
	] = await Promise.all([
		getDesignerPageProps(locale, slug)
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
	}*/
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	};
}
