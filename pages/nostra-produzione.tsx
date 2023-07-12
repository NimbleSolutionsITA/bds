import Layout from "../src/layout/Layout";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import dynamic from "next/dynamic";
import {OUR_PRODUCTION_CATEGORIES} from "../src/utils/utils";
import {WooProductCategory} from "../src/types/woocommerce";

const DesignersList = dynamic(() => import("../src/pages/designers/DesignersList"));

export type OurProductionProps = PageBaseProps & {
	ourProductionCategories: WooProductCategory[]
}

export default function NostraProduzione({ layout, ourProductionCategories }: OurProductionProps) {
	return (
		<Layout layout={layout}>
			<DesignersList designers={ourProductionCategories} />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
	const [
		{ssrTranslations, ...layoutProps},
		{ seo },
	] = await Promise.all([
		getLayoutProps(locale),
		getPageProps("our-production", locale)
	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			ourProductionCategories:
				layoutProps.categories.designers.filter((category) =>
					OUR_PRODUCTION_CATEGORIES[locale].includes(category.id)
				),
			layout: {
				...layoutProps,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'Nostra Produzione', href: urlPrefix + '/our-production' }
				],
				seo
			},
			...ssrTranslations
		},
		revalidate: 10
	}
}
