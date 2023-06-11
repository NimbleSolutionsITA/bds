import Layout from "../src/layout/Layout";
import {getShopPageProps} from "../src/utils/wordpress_api";
import {BreadCrumb, Menus} from "../src/types/settings";
import {GooglePlaces} from "./api/google-places";
import {Attribute, BaseProduct, Category, Color, ProductTag} from "../src/types/woocommerce";
import dynamic from "next/dynamic";

const ShopLayout = dynamic(() => import("../src/pages/shop/ShopLayout"));

export type ShopProps = {
	menus: Menus,
	googlePlaces: GooglePlaces,
	products: BaseProduct[],
	breadcrumbs?: BreadCrumb[]
	colors: Color[],
	attributes: Attribute[],
	tags: ProductTag[],
	designers: Category[]
}

export default function Shop({
  menus, googlePlaces, products, breadcrumbs, colors, tags, designers, attributes
}: ShopProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ShopLayout
				products={products}
				colors={colors}
				tags={tags}
				designers={designers}
				attributes={attributes}
			/>
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