import React from "react";
import Layout from "../../src/layout/Layout";
import {getCategoryPageProps} from "../../src/utils/wordpress_api";
import { PageBaseProps} from "../../src/types/settings";
import {BaseProduct, WooProductCategory} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import sanitize from "sanitize-html";
import {getAllProducts} from "../api/products";
import {FRAGRANCES_CATEGORY, getFragrancesCategories, LOCALE} from "../../src/utils/utils";
import {cacheGetProductCategories} from "../../src/utils/cache";

const FragranceTop = dynamic(() => import("../../src/components/CategoryTop"))
const FragranceProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"))
const FragrancesBottom = dynamic(() => import("../../src/components/CategoryBottom"))

export type FragranceProps = PageBaseProps & {
	productCategory: WooProductCategory,
	parentCategory: WooProductCategory,
	products: BaseProduct[],
}
export default function Fragrance({ productCategory, parentCategory, products, layout }: FragranceProps) {
	return (
		<Layout key={productCategory.slug} layout={layout}>
			<FragranceTop
				name={productCategory.name}
				brand={parentCategory.name}
				gallery={productCategory.acf.gallery}
				description={productCategory.description}
			/>
			<FragranceProductGrid products={products} />
			<FragrancesBottom bottomText={productCategory.acf.bottomText} />
		</Layout>
	);
}

export async function getStaticProps({ locale, params: {page, slug} }: { locales: string[], locale: 'it' | 'en', params: { slug: string, page: string }}) {
	try {
		const [
			{ productCategory, layout: {ssrTranslations, ...layout} }
		] = await Promise.all([
			getCategoryPageProps(locale, slug)
		]);
		const fragranceBrands = getFragrancesCategories(layout.categories).map(({id}) => id)
		if (!productCategory || fragranceBrands.includes(productCategory.id)) {
			return {
				notFound: true
			}
		}
		const products = await getAllProducts({
			categories: slug,
			lang: locale,
			per_page: '99',
			fragrances: true
		})
		const urlPrefix = locale === 'it' ? '' : '/' + locale;
		const productCategories = await cacheGetProductCategories();
		const parentCategory = productCategories.find(({id}) => id === productCategory.parent)
		const breadcrumbs = [
			{ name: 'Home', href: urlPrefix + '/' },
			{ name: parentCategory?.name, href: urlPrefix + '/'+page },
			{ name: sanitize(productCategory.name), href: urlPrefix +  '/'+page+'/' + productCategory.slug },
		]
		return {
			props: {
				layout: {
					...layout,
					breadcrumbs,
				},
				productCategory,
				parentCategory,
				products,
				...ssrTranslations
			},
			revalidate: 10
		}
	} catch (error) {
		console.error('Error fetching category:', error);
		return { notFound: true };
	}
}

export async function getStaticPaths({ locales }: { locales: LOCALE[] }) {
	const productCategories = await cacheGetProductCategories();
	const validPaths = [];

	for (const locale of locales) {
		const fragranceCategories = productCategories.filter(({parent}) => {
			if (!parent) return false;
			const parentCat = productCategories.find(category => category.id === parent)?.parent as number;
			return parentCat === FRAGRANCES_CATEGORY[locale];
		});

		for (const category of fragranceCategories) {
			const parentCategory = productCategories.find(({id}) => id === category.parent);
			if (parentCategory) {
				validPaths.push({
					params: { slug: category.slug, page: parentCategory.slug },
					locale
				});
			}
		}
	}

	return {
		paths: process.env.DISABLE_DYNAMIC_BUILD === "true" ? [] : validPaths,
		fallback: 'blocking',
	};
}