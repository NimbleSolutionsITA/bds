import Layout from "../src/layout/Layout";
import {getDesignersPageProps, getPageProps} from "../src/utils/wordpress_api";
import {BreadCrumb, Menus} from "../src/types/settings";
import {GooglePlaces} from "./api/google-places";
import {WooProductCategory} from "../src/types/woocommerce";
import dynamic from "next/dynamic";

const DesignersList = dynamic(() => import("../src/pages/designers/DesignersList"));

export type DesignersProps = {
    menus: Menus,
    googlePlaces: GooglePlaces,
    productCategories: WooProductCategory[],
    breadcrumbs?: BreadCrumb[]
}

export default function Designers({
    menus, googlePlaces, productCategories, breadcrumbs
}: DesignersProps) {
    return (
      <Layout menus={menus} googlePlaces={googlePlaces} breadcrumbs={breadcrumbs}>
          <DesignersList designers={productCategories} />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
    const [
        { page, seo, menus, googlePlaces },
        { productCategories }
    ] = await Promise.all([
        getPageProps("designers", locale),
        getDesignersPageProps(locale)
    ]);
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return {
        props: {
            menus,
            googlePlaces,
            productCategories,
            breadcrumbs: [
                { name: 'Home', href: urlPrefix + '/' },
                { name: 'Designers', href: urlPrefix + '/designers' }
            ]
        },
        revalidate: 10
    }
}
