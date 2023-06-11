import Layout from "../../src/layout/Layout";
import {getShopPageProps} from "../../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {ShopProps} from "../shop";
import {SHOP_CATEGORIES} from "../../src/utils/utils";

const ShopLayout = dynamic(() => import("../../src/pages/shop/ShopLayout"));

export default function ShopOpticalWoman({
    menus, googlePlaces, products, breadcrumbs, colors, tags, designers, attributes
}: ShopProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ShopLayout products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isOptical isWoman />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const props = await getShopPageProps(locale, {optical: true, woman: true}, 'woman', SHOP_CATEGORIES.optical[locale])
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			...props,
			breadcrumbs: [
				...props.breadcrumbs,
				{ name: 'Optical', href: urlPrefix + '/shop/optical' },
				{ name: 'Woman', href: urlPrefix + '/shop/optical/woman' }
			]
		},
		revalidate: 10
	}
}