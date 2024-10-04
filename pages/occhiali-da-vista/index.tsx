import Layout from "../../src/layout/Layout";
import dynamic from "next/dynamic";
import {ShopProps} from "../shop";
import {LOCALE} from "../../src/utils/utils";
import {cacheGetShopPageProps} from "../../src/utils/cache";

const ShopLayout = dynamic(() => import("../../src/pages/shop/ShopLayout"));

export default function ShopSunglassesMan({ layout, products, colors, tags, designers, attributes }: ShopProps) {
	return (
		<Layout layout={layout}>
			<ShopLayout products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isOptical />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locale: LOCALE }) {
	const props = await cacheGetShopPageProps(locale, {optical: true}, 'occhiali-da-vista')
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			...props,
			layout: {
				...props.layout,
				breadcrumbs: [
					{ name: 'Occhiali da vista', href: urlPrefix + '/occhiali-da-vista' }
				]
			}
		},
		revalidate: 10
	}
}