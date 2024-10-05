import Layout from "../../src/layout/Layout";
import { getPageProps} from "../../src/utils/wordpress_api";
import {PageBaseProps} from "../../src/types/settings";
import dynamic from "next/dynamic";
import {LOCALE, OUR_PRODUCTION_CATEGORIES} from "../../src/utils/utils";
import {WooProductCategory} from "../../src/types/woocommerce";
import {DESIGNERS_CATEGORY, OUR_PRODUCTION_SUB_PATH} from "../../src/utils/endpoints";
import {cacheGetLayoutProps} from "../../src/utils/cache";

const DesignersList = dynamic(() => import("../../src/pages/designers/DesignersList"));

export type OurProductionProps = PageBaseProps & {
	ourProductionCategories: WooProductCategory[]
}

export default function Index({ layout, ourProductionCategories }: OurProductionProps) {
	return (
		<Layout layout={layout}>
			<DesignersList designers={ourProductionCategories} subpath={OUR_PRODUCTION_SUB_PATH} />
		</Layout>
	);
}

export async function getStaticProps({ locale }: { locales: string[], locale: LOCALE}) {
	const [
		{ssrTranslations, ...layoutProps},
		{ seo },
	] = await Promise.all([
		cacheGetLayoutProps(locale),
		getPageProps(OUR_PRODUCTION_SUB_PATH, locale)
	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			ourProductionCategories:
				layoutProps?.categories?.find(c => c.slug === DESIGNERS_CATEGORY)?.child_items?.filter((category) =>
					OUR_PRODUCTION_CATEGORIES[locale].includes(category.id)
				),
			layout: {
				...layoutProps,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'Nostra Produzione', href: urlPrefix + '/'+OUR_PRODUCTION_SUB_PATH }
				],
				seo
			},
			...ssrTranslations
		},
		revalidate: 10
	}
}
