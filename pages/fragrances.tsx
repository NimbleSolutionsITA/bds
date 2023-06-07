import Layout from "../src/layout/Layout";
import {getPageProps} from "../src/utils/wordpress_api";
import {BreadCrumb, Menus} from "../src/types/settings";
import {GooglePlaces} from "./api/google-places";
import {WooProductCategory} from "../src/types/woocommerce";
import dynamic from "next/dynamic";

const FragrancesList = dynamic(() => import("../src/pages/fragrances/FragrancesList"));

export type FragrancesProps = {
    menus: Menus,
    googlePlaces: GooglePlaces,
    fragrances: WooProductCategory[],
    breadcrumbs?: BreadCrumb[],
    seo: string
}

export default function Fragrances({
    menus, googlePlaces, fragrances, breadcrumbs, seo
}: FragrancesProps) {
    return (
      <Layout seo={seo} menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
          <FragrancesList fragrances={fragrances} />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
    const [
        { page, seo, menus, googlePlaces, categories: {fragrances} },
    ] = await Promise.all([
        getPageProps("fragrances", locale),
    ]);
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return {
        props: {
            menus,
            googlePlaces,
            fragrances: [...fragrances.profumum, ...fragrances.liquides],
            breadcrumbs: [
                { name: 'Home', href: urlPrefix + '/' },
                { name: 'Fragranze', href: urlPrefix + '/fragrances' }
            ],
            seo
        },
        revalidate: 10
    }
}
