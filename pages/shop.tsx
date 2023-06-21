import Layout from "../src/layout/Layout";
import {getShopPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {Attribute, BaseProduct, Category, Color, ProductTag} from "../src/types/woocommerce";
import dynamic from "next/dynamic";

const ShopLayout = dynamic(() => import("../src/pages/shop/ShopLayout"));

export type ShopProps = PageBaseProps & {
	products: BaseProduct[],
	colors: Color[],
	attributes: Attribute[],
	tags: ProductTag[],
	designers: Category[]
}

export default function Shop({
  colors, tags, designers, attributes, layout, products
}: ShopProps) {
	return (
		<Layout layout={layout}>
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