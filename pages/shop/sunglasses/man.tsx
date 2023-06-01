import Layout from "../../../src/layout/Layout";
import {getShopPageProps} from "../../../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {ShopProps} from "../../shop";

const ProductsGrid = dynamic(() => import("../../../src/pages/shop/ProductsGrid"));

export default function ShopSunglassesMan({
    menus, googlePlaces, products, breadcrumbs, colors, tags, designers, attributes
}: ShopProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ProductsGrid products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isSunglasses isMan />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const props = await getShopPageProps(locale, {sunglasses: true, man: true})
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			...props,
			breadcrumbs: [
				...props.breadcrumbs,
				{ name: 'Sunglasses', href: urlPrefix + '/shop/sunglasses' },
				{ name: 'Man', href: urlPrefix + '/shop/sunglasses/man' }
			]
		},
		revalidate: 10
	}
}