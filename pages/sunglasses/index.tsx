import Layout from "../../src/layout/Layout";
import {getShopPageProps} from "../../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {ShopProps} from "../shop";

const ShopLayout = dynamic(() => import("../../src/pages/shop/ShopLayout"));

export default function ShopSunglasses({ layout, products, colors, tags, designers, attributes }: ShopProps) {
	return (
		<Layout layout={layout}>
			<ShopLayout products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isSunglasses />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const props =  await getShopPageProps(locale, {sunglasses: true}, 'sunglasses')
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			...props,
			layout: {
				...props.layout,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'Sunglasses', href: urlPrefix + '/sunglasses' }
				]
			}
		},
		revalidate: 10
	}
}