import Layout from "../../src/layout/Layout";
import {getShopPageProps} from "../../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {ShopProps} from "../shop";

const ShopLayout = dynamic(() => import("../../src/pages/shop/ShopLayout"));

export default function ShopOptical({
     menus, googlePlaces, products, breadcrumbs, colors, tags, designers, attributes
 }: ShopProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ShopLayout products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isOptical />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const props =  await getShopPageProps(locale, {optical: true}, 'optical')
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			...props,
			breadcrumbs: [
				{ name: 'Optical', href: urlPrefix + '/optical' }
			]
		},
		revalidate: 10
	}
}