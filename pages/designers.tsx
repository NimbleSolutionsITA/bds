import Layout from "../src/layout/Layout";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {WooProductCategory} from "../src/types/woocommerce";
import dynamic from "next/dynamic";

const DesignersList = dynamic(() => import("../src/pages/designers/DesignersList"));

export type DesignersProps = PageBaseProps & {
    productCategories: WooProductCategory[]
}

export default function Designers({ layout, productCategories }: DesignersProps) {
    return (
      <Layout layout={layout}>
          <DesignersList designers={productCategories} />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
    const [
        { categories: {designers}, ...layoutProps },
        { seo },
    ] = await Promise.all([
        getLayoutProps(locale),
        getPageProps("designers", locale)
    ]);
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return {
        props: {
            productCategories: designers,
            layout: {
                ...layoutProps,
                breadcrumbs: [
                    { name: 'Home', href: urlPrefix + '/' },
                    { name: 'Designers', href: urlPrefix + '/designers' }
                ],
                seo
            }
        },
        revalidate: 10
    }
}
