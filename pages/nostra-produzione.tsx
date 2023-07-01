import React from "react";
import Layout from "../src/layout/Layout";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {BaseProduct} from "../src/types/woocommerce";
import {getProducts} from "./api/products";
import {OUR_PRODUCTION_CATEGORIES} from "../src/utils/utils";

export type NostraProduzioneProps = PageBaseProps & {
	products: BaseProduct[]
}
export default function NostraProduzione({ products, layout }: NostraProduzioneProps) {
	console.log(products)
	return (
		<Layout layout={layout}>
			{products.map(product => (
				<div key={product.id}>
					{product.name} - {product.categories.map(category => category.name).join(', ')}
				</div>
			))}
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const [
		layout,
		products,
		{  seo }
	] = await Promise.all([
		getLayoutProps(locale),
		getProducts({
			categories: OUR_PRODUCTION_CATEGORIES[locale].join(','),
			lang: locale,
			per_page: '24'
		}),
		getPageProps('nostra-produzione', locale)
	]);
	console.log(products);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Nostra Produzione', href: urlPrefix + '/nostra-produzione' }
	]
	return {
		props: {
			layout: {
				...layout,
				seo,
				breadcrumbs,
			},
			products
		},
		revalidate: 10
	}
}
