import Layout from "../../src/layout/Layout";
import {getShopPageProps} from "../../src/utils/wordpress_api";
import dynamic from "next/dynamic";
import {ShopProps} from "../shop";
import {SHOP_CATEGORIES} from "../../src/utils/utils";

const ShopLayout = dynamic(() => import("../../src/pages/shop/ShopLayout"));

export default function ShopSunglassesMan({ layout, products, colors, tags, designers, attributes, isMan }: ShopProps & {isMan: boolean}) {
	return (
		<Layout layout={layout}>
			<ShopLayout
				products={products}
				attributes={attributes}
				colors={colors}
				tags={tags}
				designers={designers}
				isOptical
				isMan={isMan}
				isWoman={!isMan}
			/>
		</Layout>
	);
}

export async function getStaticProps({ locale, params: {gender} }: { locale: 'it' | 'en', params: {gender: 'uomo' | 'donna'} }) {
	const man = gender === 'uomo'
	const woman = gender === 'donna'
	const props = await getShopPageProps(locale, {optical: true, woman, man}, gender, SHOP_CATEGORIES.optical[locale])
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	const category = {
		it: "Vista",
		en: "Optical"
	}
	const title = {
		it: {
			uomo: "Occhiali da vista uomo",
			donna: "Occhiali da vista donna"
		},
		en: {
			uomo: "Optical man",
			donna: "Optical woman"
		}
	}
	return {
		props: {
			...props,
			layout: {
				...props.layout,
				breadcrumbs: [
					{ name: category[locale], href: urlPrefix + '/occhiali-da-vista' },
					{ name: title[locale][gender], href: urlPrefix + `/occhiali-da-vista/${gender}` }
				]
			},
			isMan: man
		},
		revalidate: 10
	}
}

export const getStaticPaths = async () => {
	const genders = ['uomo', 'donna'];
	const locales = ['it', 'en'];

	const paths = locales.flatMap(locale =>
		genders.map(gender => ({
			params: { gender },
			locale,
		})),
	);

	return {
		paths,
		fallback: false,
	};
};