import Layout from "../src/layout/Layout";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {WooProductCategory} from "../src/types/woocommerce";
import dynamic from "next/dynamic";

const FragrancesList = dynamic(() => import("../src/pages/fragrances/FragrancesList"));

export type FragrancesProps = PageBaseProps & {
    fragrances: WooProductCategory[],
}

export default function Fragrances({ fragrances, layout }: FragrancesProps) {
    return (
      <Layout layout={layout}>
          <FragrancesList fragrances={fragrances} />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
    const [
        { categories: {fragrances}, ...layoutProps },
        {  seo },
    ] = await Promise.all([
        getLayoutProps(locale),
        getPageProps("fragrances", locale),
    ]);
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return {
        props: {
            fragrances: [...fragrances.profumum, ...fragrances.liquides],
            layout: {
                ...layoutProps,
                breadcrumbs: [
                    { name: 'Home', href: urlPrefix + '/' },
                    { name: 'Fragranze', href: urlPrefix + '/fragrances' }
                ],
                seo,
            }
        },
        revalidate: 10
    }
}
