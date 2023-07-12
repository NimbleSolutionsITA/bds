import Layout from "../../src/layout/Layout";
import {getShopPageProps} from "../../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {ShopProps} from "../shop";
import {SHOP_CATEGORIES} from "../../src/utils/utils";

const ShopLayout = dynamic(() => import("../../src/pages/shop/ShopLayout"));

export default function ShopSunglassesMan({ layout, products, colors, tags, designers, attributes }: ShopProps) {
	return (
		<Layout layout={layout}>
			<ShopLayout products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isSunglasses />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locale: 'it' | 'en', }) {
	const props = await getShopPageProps(locale, {sunglasses: true}, 'occhiali-da-sole')
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			...props,
			layout: {
				...props.layout,
				breadcrumbs: [
					{ name: 'Occhiali da sole', href: urlPrefix + '/occhiali-da-sole' }
				]
			}
		},
		revalidate: 10
	}
}