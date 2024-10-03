import {Container} from "@mui/material";
import {PageBaseProps} from "../../src/types/settings";
import {getAllPagesIds, getLayoutProps, getPageProps} from "../../src/utils/wordpress_api";
import Layout from "../../src/layout/Layout";
import {BaseProduct, Page, WooProductCategory} from "../../src/types/woocommerce";
import HtmlBlock from "../../src/components/HtmlBlock";
import {getProducts} from "../api/products";
import {FRAGRANCES_CATEGORY} from "../../src/utils/endpoints";
import React from "react";
import dynamic from "next/dynamic";

const FragranceTop = dynamic(() => import("../../src/components/CategoryTop"))
const FragranceProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"))
const FragrancesBottom = dynamic(() => import("../../src/components/CategoryBottom"))

export type GenericPageProps = PageBaseProps & {
    fragrancePage?: {
        productCategory: WooProductCategory,
        products: BaseProduct[],
    },
    page?: Page
}

export default function GenericPage({page, layout, fragrancePage}: GenericPageProps) {
    return (
        <Layout layout={layout}>
            {fragrancePage && (<>
                <FragranceTop
                    name={fragrancePage.productCategory.name}
                    gallery={fragrancePage.productCategory.acf.gallery}
                    description={fragrancePage.productCategory.description}
                />
                <FragranceProductGrid products={fragrancePage.products} />
                <FragrancesBottom bottomText={fragrancePage.productCategory.acf.bottomText} />
            </>)}
            {page && (
                <Container>
                    <HtmlBlock sx={{width: '100%', overflowX: 'hidden'}} html={page.content} />
                </Container>
            )}
        </Layout>
    )
}

export async function getStaticProps({ locale, params: { page: slug } }: { locale: 'it' | 'en', params: {page: string}}) {
    const { ssrTranslations, ...layoutProps } = await getLayoutProps(locale);

    const productCategory = layoutProps.categories.find(category => category.slug === FRAGRANCES_CATEGORY)?.child_items?.find(category => category.slug === slug);

    if (productCategory) {
        const products = await getProducts({
            categories: productCategory.slug,
            lang: locale,
            per_page: '99',
            fragrances: true
        })
        const urlPrefix = locale === 'it' ? '' : '/' + locale;
        const breadcrumbs = [
            { name: 'Home', href: urlPrefix + '/' },
            { name: productCategory, href: urlPrefix + '/'+ productCategory.slug }
        ]
        return {
            props: {
                layout: {
                    ...layoutProps,
                    breadcrumbs,
                },
                fragrancePage: {
                    productCategory,
                    products
                },
                ...ssrTranslations
            },
            revalidate: 10
        }
    }

    const { page, seo } = await getPageProps(slug, locale)

    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return page ? {
        props: {
            page,
            layout: {
                seo,
                ...layoutProps,
                breadcrumbs: [
                    { name: 'Home', href: urlPrefix + '/' },
                    { name: page.title, href: urlPrefix + '/' + page.slug },
                ]
            },
            ...ssrTranslations
        },
        revalidate: 10
    } : {
        notFound: true,
    }
}

export async function getStaticPaths() {
    const paths = await getAllPagesIds();
    return {
        paths,
        fallback: 'blocking',
    };
}
