import Layout from "../src/layout/Layout";
import {getShopPageProps} from "../src/utils/wordpress_api";
import {BreadCrumb, Menus} from "../src/types/settings";
import {GooglePlaces} from "./api/google-places";
import {BaseProduct, Category, Color, ProductTag} from "../src/types/woocommerce";
import dynamic from "next/dynamic";

const ProductsGrid = dynamic(() => import("../src/pages/shop/ProductsGrid"));

export type DesignersProps = {
	menus: Menus,
	googlePlaces: GooglePlaces,
	products: BaseProduct[],
	breadcrumbs?: BreadCrumb[]
	colors: Color[],
	tags: ProductTag[],
	designers: Category[]
}

export default function Shop({
  menus, googlePlaces, products, breadcrumbs, colors, tags, designers
}: DesignersProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ProductsGrid products={products} colors={colors} tags={tags} designers={designers} />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const props =  await getShopPageProps(locale)
	return {
		props,
		revalidate: 10
	}
}