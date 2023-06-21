import Layout from "../../src/layout/Layout";
import {getShopPageProps} from "../../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {ShopProps} from "../shop";
import {SHOP_CATEGORIES} from "../../src/utils/utils";

const ShopLayout = dynamic(() => import("../../src/pages/shop/ShopLayout"));

export default function ShopOpticalMan({ layout, products, colors, tags, designers, attributes }: ShopProps) {
	return (
		<Layout layout={layout}>
			<ShopLayout products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isOptical isMan />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const props = await getShopPageProps(locale, {optical: true, man: true}, 'man', SHOP_CATEGORIES.optical[locale])
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			...props,
			layout: {
				...props.layout,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'Optical', href: urlPrefix + '/optical' },
					{ name: 'Man', href: urlPrefix + '/optical/man' }
				]
			}
		},
		revalidate: 10
	}
}