import Layout from "../../src/layout/Layout";
import {getShopPageProps} from "../../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {ShopProps} from "../shop";

const ProductsGrid = dynamic(() => import("../../src/pages/shop/ProductsGrid"));

export default function ShopOpticalWoman({
    menus, googlePlaces, products, breadcrumbs, colors, tags, designers, attributes
}: ShopProps) {
	return (
		<Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
			<ProductsGrid products={products} attributes={attributes} colors={colors} tags={tags} designers={designers} isOptical isWoman />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const props = await getShopPageProps(locale, {optical: true, woman: true})
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