import Layout from "../src/layout/Layout";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import dynamic from "next/dynamic";

const FragrancesList = dynamic(() => import("../src/pages/fragrances/FragrancesList"));

export type FragrancesProps = PageBaseProps & {

}

export default function Fragrances({ layout }: FragrancesProps) {
    return (
      <Layout layout={layout}>
          <FragrancesList
              fragrances={[
                  ...layout.categories.fragrances.profumum,
                  ...layout.categories.fragrances.liquides
              ]}
          />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
    const [
        {ssrTranslations, ...layoutProps},
        {  seo },
    ] = await Promise.all([
        getLayoutProps(locale),
        getPageProps("fragrances", locale),
    ]);
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return {
        props: {
            layout: {
                ...layoutProps,
                breadcrumbs: [
                    { name: 'Home', href: urlPrefix + '/' },
                    { name: 'Fragranze', href: urlPrefix + '/fragrances' }
                ],
                seo,
            },
            ...ssrTranslations
        },
        revalidate: 10
    }
}
