import Layout from "../../../src/layout/Layout";
import {getShopPageProps} from "../../../src/utils/wordpress_api";
import {BreadCrumb, Menus} from "../../../src/types/settings";
import {GooglePlaces} from "../../api/google-places";
import {BaseProduct, Category, Color, ProductTag} from "../../../src/types/woocommerce";
import dynamic from "next/dynamic";
import {ShopProps} from "../../shop";

const ProductsGrid = dynamic(() => import("../../../src/pages/shop/ProductsGrid"));

export default function ShopOpticalMan({
    menus, googlePlaces, products, breadcrumbs, colors, tags, designers, attributes
}: ShopProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ProductsGrid products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isOptical isMan />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const props = await getShopPageProps(locale, {optical: true, man: true})
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			...props,
			breadcrumbs: [
				...props.breadcrumbs,
				{ name: 'Optical', href: urlPrefix + '/shop/optical' },
				{ name: 'Man', href: urlPrefix + '/shop/optical/man' }
			]
		},
		revalidate: 10
	}
}