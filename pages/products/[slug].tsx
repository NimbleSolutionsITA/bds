import React from "react";
import Layout from "../../src/layout/Layout";
import {PageBaseProps} from "../../src/types/settings";
import {BaseProduct, Product as ProductType, ProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getAllProductsIds} from "../../src/utils/wordpress_api";
import {getProductCategoryLink, getProductMainCategory, LOCALE} from "../../src/utils/utils";
import {PRODUCT_SUB_PATH, WORDPRESS_RANK_MATH_SEO_ENDPOINT, buildHrefAlternates} from "../../src/utils/endpoints";
import {useTranslation} from "next-i18next";
import PayPalProvider from "../../src/components/PayPalProvider";
import {cacheGetLayoutProps, cacheGetProduct} from "../../src/utils/cache";
import { useRouter } from "next/router";

const ProductView = dynamic(() => import('../../src/pages/product/ProductView'), { ssr: false });
const ProductsSlider = dynamic(() => import('../../src/components/ProductsSlider'), { ssr: false });
const SeoFooter = dynamic(() => import('../../src/pages/product/SeoFooter'), { ssr: false });

export type ProductPageProps = PageBaseProps & {
	product: ProductType,
	category: ProductCategory,
}
export default function Product({ product, category, layout }: ProductPageProps) {
	const { t } = useTranslation('common')
	const router = useRouter();

	return (
		// NB: caricare il set completo del SDK PayPal (default). Limitarlo a "applepay,googlepay"
		// rompeva la comparsa dei bottoni one-click Apple/Google Pay sulla scheda prodotto.
		<PayPalProvider>
			<Layout layout={layout}>
				<ProductView key={JSON.stringify(router.query)} product={product} category={category} shipping={layout.shipping} countries={layout.countries} />
				<ProductsSlider products={product.related ?? []} title={t('related-products')} />
				<SeoFooter category={category} />
			</Layout>
		</PayPalProvider>
	);
}

export async function getStaticProps({ locale, params: {slug} }: { locales: string[], locale: LOCALE, params: { slug: string }}) {
	const [
		{ssrTranslations, ...layoutProps},
		product,
	] = await Promise.all([
		cacheGetLayoutProps(locale),
		cacheGetProduct(locale, slug)
	]);
	if (typeof product === 'string') {
		return {
			notFound: true
		}
	}
	let seo = { head: '' }
	try {
		seo = await fetch(`${ WORDPRESS_RANK_MATH_SEO_ENDPOINT}?url=${product.link}`).then(response => response.json())
	}
	catch (e) {
		console.error('RANKMATH SEO ERROR', product.link)
		console.error(e)
	}
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const category = getProductMainCategory(product as unknown as BaseProduct) as ProductCategory
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Shop', href: urlPrefix + '/shop' },
		{ name: category.name, href: urlPrefix + getProductCategoryLink(category) },
		{ name: sanitize(product.name), href: urlPrefix +  '/products/' + slug },
	]
	// hreflang: gli slug differiscono per lingua (Polylang), quindi usiamo gli slug
	// tradotti esposti dal payload invece di anteporre il prefisso allo stesso slug.
	const alternates = buildHrefAlternates(product.translations, (s) => `/${PRODUCT_SUB_PATH}/${s}`);
	return {
		props: {
			layout: {
				...layoutProps,
				breadcrumbs,
				seo: seo?.head ?? null,
				...(alternates ? { alternates } : {}),
			},
			product,
			category,
			...ssrTranslations
		},
		// La freschezza di stock/prezzo arriva on-demand via /api/revalidate al cambio
		// prodotto; questo e solo una rete di sicurezza -> intervallo piu ampio = meno
		// rigenerazioni/carico WP. (Lo stock all'acquisto e comunque validato da CoCart.)
		revalidate: 300
	}
}

export async function getStaticPaths() {
	// DISABLE_DYNAMIC_BUILD: salta del tutto getAllProductsIds (fetch pesante a
	// WP di TUTTI gli id prodotto) invece di chiamarla e scartarne il risultato.
	// Cosi' la fase "Collecting page data" non dipende dal backend e non va in
	// timeout (60s) quando WP e' lento. Le schede restano on-demand (fallback).
	if (process.env.DISABLE_DYNAMIC_BUILD) {
		return { paths: [], fallback: 'blocking' };
	}
	const paths = await getAllProductsIds();
	return {
		paths,
		fallback: 'blocking',
	};
}