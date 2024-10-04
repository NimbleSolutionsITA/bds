import Layout from "../../src/layout/Layout";
import {getPageProps} from "../../src/utils/wordpress_api";
import {PageBaseProps} from "../../src/types/settings";
import dynamic from "next/dynamic";
import {DESIGNERS_CATEGORY, DESIGNERS_SUB_PATH} from "../../src/utils/endpoints";
import {LOCALE} from "../../src/utils/utils";
import {cacheGetLayoutProps} from "../../src/utils/cache";

const DesignersList = dynamic(() => import("../../src/pages/designers/DesignersList"));

export type DesignersProps = PageBaseProps & {

}

export default function Index({ layout }: DesignersProps) {
    const designers = layout.categories.find(c => c.slug === DESIGNERS_CATEGORY)?.child_items
    return (
      <Layout layout={layout}>
          {designers && <DesignersList designers={designers} />}
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: LOCALE}) {
    const [
        {ssrTranslations, ...layoutProps},
        { seo },
    ] = await Promise.all([
        cacheGetLayoutProps(locale),
        getPageProps(DESIGNERS_SUB_PATH, locale)
    ]);
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return {
        props: {
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
