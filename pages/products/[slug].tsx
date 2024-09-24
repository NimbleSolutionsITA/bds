import React from "react";
import Layout from "../../src/layout/Layout";
import {PageBaseProps} from "../../src/types/settings";
import {BaseProduct, Product as ProductType, ProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getAllProductsIds, getLayoutProps} from "../../src/utils/wordpress_api";
import {getProduct} from "../api/products/[slug]";
import {getProductMainCategory} from "../../src/utils/utils";
import {WORDPRESS_RANK_MATH_SEO_ENDPOINT} from "../../src/utils/endpoints";
import {useTranslation} from "next-i18next";

const ProductView = dynamic(() => import('../../src/pages/product/ProductView'), { ssr: false });
const ProductsSlider = dynamic(() => import('../../src/components/ProductsSlider'), { ssr: false });
const SeoFooter = dynamic(() => import('../../src/pages/product/SeoFooter'), { ssr: false });

export type ProductPageProps = PageBaseProps & {
	product: ProductType,
}
export default function Product({ product, layout }: ProductPageProps) {
	const category = getProductMainCategory(product as unknown as BaseProduct) as ProductCategory
	const { t } = useTranslation('common')
	return (
		<Layout layout={layout}>
			<ProductView product={product} category={category} shipping={layout.shipping} />
			<ProductsSlider products={product.related ?? []} title={t('related-products')} />
			<SeoFooter category={category} />
		</Layout>
	);
}

export async function getStaticProps({ locale, params: {slug} }: { locales: string[], locale: 'it' | 'en', params: { slug: string }}) {
	const [
		{ssrTranslations, ...layoutProps},
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
	let seo = { head: '' }
	try {
		seo = await fetch(`${ WORDPRESS_RANK_MATH_SEO_ENDPOINT}?url=${product.link}`).then(response => response.json())
	}
	catch (e) {
		console.error('RANKMATH SEO ERROR', product.link)
		console.error(e)
	}
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const breadcrumbs = [
		{ name: 'Home', href: urlPrefix + '/' },
		{ name: 'Shop', href: urlPrefix + '/shop' },
		{ name: sanitize(product.name), href: urlPrefix +  '/products/' + slug },
	]
	return {
		props: {
			layout: {
				...layoutProps,
				breadcrumbs,
				seo: seo?.head ?? null,
			},
			product,
			...ssrTranslations
		},
		revalidate: 10
	}
}

export async function getStaticPaths() {
	const paths = await getAllProductsIds();
	return {
		paths,
		fallback: 'blocking',
	};
}
