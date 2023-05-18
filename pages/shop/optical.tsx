import Layout from "../../src/layout/Layout";
import {getPageProps, mapCategory} from "../../src/utils/wordpress_api";
import {BreadCrumb, Menus} from "../../src/types/settings";
import {GooglePlaces} from "../api/google-places";
import {BaseProduct, Category, Color, ProductTag} from "../../src/types/woocommerce";
import dynamic from "next/dynamic";
import {getProducts} from "../api/products";
import {getColors} from "../api/products/colors";
import {getProductTags} from "../api/products/tags";
import {getProductCategories} from "../api/products/categories";
import {EYEWEAR_CATEGORY} from "../../src/utils/utils";

const ProductsGrid = dynamic(() => import("../../src/pages/shop/ProductsGrid"));

export type DesignersProps = {
	menus: Menus,
	googlePlaces: GooglePlaces,
	products: BaseProduct[],
	breadcrumbs?: BreadCrumb[]
	colors: Color[],
	tags: ProductTag[],
	designers: Category[]
}

export default function ShopOptical({
     menus, googlePlaces, products, breadcrumbs, colors, tags, designers
 }: DesignersProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ProductsGrid products={products} colors={colors} tags={tags} designers={designers} isOptical />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const [
		{ page, seo, menus, googlePlaces },
		products,
		colors,
		tags,
		designers
	] = await Promise.all([
		getPageProps("shop", locale),
		getProducts({
			lang: locale,
			per_page: '12',
			optical: true
		}),
		getColors(locale),
		getProductTags(locale),
		getProductCategories(locale, EYEWEAR_CATEGORY[locale].toString())

	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			menus,
			googlePlaces,
			products,
			colors,
			breadcrumbs: [
				{ name: 'Home', href: urlPrefix + '/' },
				{ name: 'Shop', href: urlPrefix + '/shop' },
				{ name: 'Optical', href: urlPrefix + '/shop/optical' }
			],
			tags,
			designers: designers.map(mapCategory)
		},
		revalidate: 10
	}
}