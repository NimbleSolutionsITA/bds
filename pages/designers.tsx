import Layout from "../src/layout/Layout";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import dynamic from "next/dynamic";

const DesignersList = dynamic(() => import("../src/pages/designers/DesignersList"));

export type DesignersProps = PageBaseProps & {

}

export default function Designers({ layout }: DesignersProps) {
    return (
      <Layout layout={layout}>
          <DesignersList designers={layout.categories.designers} />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
    const [
        layoutProps,
        { seo },
    ] = await Promise.all([
        getLayoutProps(locale),
        getPageProps("designers", locale)
    ]);
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return {
        props: {
            productCategories: layoutProps.categories.designers,
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
