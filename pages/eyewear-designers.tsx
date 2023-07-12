import Layout from "../src/layout/Layout";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import dynamic from "next/dynamic";
import {DESIGNERS_SUB_PATH} from "../src/utils/endpoints";

const DesignersList = dynamic(() => import("../src/pages/designers/DesignersList"));

export type DesignersProps = PageBaseProps & {

}

export default function EyewearDesigners({ layout }: DesignersProps) {
    return (
      <Layout layout={layout}>
          <DesignersList designers={layout.categories.designers} />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
    const [
        {ssrTranslations, ...layoutProps},
        { seo },
    ] = await Promise.all([
        getLayoutProps(locale),
        getPageProps(DESIGNERS_SUB_PATH, locale)
    ]);
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return {
        props: {
            productCategories: layoutProps.categories.designers,
            layout: {
                ...layoutProps,
                breadcrumbs: [
                    { name: 'Home', href: urlPrefix + '/' },
                    { name: 'Designers', href: urlPrefix + '/'+DESIGNERS_SUB_PATH }
                ],
                seo
            },
            ...ssrTranslations
        },
        revalidate: 10
    }
}
