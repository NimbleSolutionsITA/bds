import {Container} from "@mui/material";
import {PageBaseProps} from "../../src/types/settings";
import {getAllPagesIds, getCategoryPageProps, getPageProps} from "../../src/utils/wordpress_api";
import Layout from "../../src/layout/Layout";
import {BaseProduct, Page, WooProductCategory} from "../../src/types/woocommerce";
import HtmlBlock from "../../src/components/HtmlBlock";
import {getProducts} from "../api/products";
import React from "react";
import dynamic from "next/dynamic";
import {FRAGRANCES_CATEGORY, getFragrancesCategories, LOCALE} from "../../src/utils/utils";
import {cacheGetLayoutProps, cacheGetProductCategories} from "../../src/utils/cache";

const FragranceTop = dynamic(() => import("../../src/components/CategoryTop"), { ssr: true })
const FragranceProductGrid = dynamic(() => import("../../src/pages/designers/DesignerProductGrid"), { ssr: true })
const FragrancesBottom = dynamic(() => import("../../src/components/CategoryBottom"), { ssr: false })

export type GenericPageProps = PageBaseProps & {
    fragrancePage?: {
        productCategory: WooProductCategory,
        products: BaseProduct[],
        locale: LOCALE,
    },
    page?: Page
}

export default function GenericPage({page, layout, fragrancePage}: GenericPageProps) {
    return (
        <Layout layout={layout}>
            {fragrancePage && (<>
                <FragranceTop
                    name={fragrancePage.productCategory.name}
                    description={fragrancePage.productCategory.description}
                />
                <FragranceProductGrid
                    products={fragrancePage.products}
                    lazyLoad={{ categorySlug: fragrancePage.productCategory.slug, lang: fragrancePage.locale, fragrances: true }}
                />
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

export async function getStaticProps({ locale, params: { page: slug } }: { locale: LOCALE, params: {page: string}}) {
    try {
        const { ssrTranslations, ...layoutProps } = await cacheGetLayoutProps(locale);
        const isFragranceCategory = layoutProps.categories.find(category => category.id === FRAGRANCES_CATEGORY[locale])?.child_items?.find(category => category.slug === slug);

        if (isFragranceCategory) {
            const { layout: { seo }, productCategory } = await getCategoryPageProps(locale, slug)
            if (!productCategory) {
                return {
                    notFound: true
                }
            }
            const fragranceBrands = getFragrancesCategories(layoutProps.categories).map(({parent}) => parent)
            if (fragranceBrands.includes(productCategory.id)) {
                return {
                    notFound: true
                }
            }
            const products = await getProducts({
                categories: productCategory.slug,
                lang: locale,
                per_page: '24',
                fragrances: true
            })
            const urlPrefix = locale === 'it' ? '' : '/' + locale;
            const breadcrumbs = [
                { name: 'Home', href: urlPrefix + '/' },
                { name: productCategory.name, href: urlPrefix + '/'+ productCategory.slug }
            ]
            const slimProductCategory = {
                ...productCategory,
                acf: { bottomText: productCategory.acf?.bottomText ?? '', gallery: [] }
            }
            return {
                props: {
                    layout: {
                        seo,
                        ...layoutProps,
                        breadcrumbs,
                    },
                    fragrancePage: {
                        productCategory: slimProductCategory,
                        products,
                        locale
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
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            notFound: true
        };
    }
}

export async function getStaticPaths({ locales }: { locales: LOCALE[] }) {
    if (process.env.DISABLE_DYNAMIC_BUILD) {
        return { paths: [], fallback: 'blocking' as const };
    }
    const productCategories = await Promise.all(locales.map(async (locale) => await cacheGetProductCategories(locale, FRAGRANCES_CATEGORY[locale])));
    const pageIds = await getAllPagesIds()
    const categoryIds = productCategories.flat().map(({slug, lang}) => ({ params: { page: slug }, locale: lang }))
    const paths = [
        categoryIds,
        pageIds.filter(p => {
            !categoryIds.find(c => c.locale === p.locale && p.params.page === c.params.page)
        })
    ].flat().filter((path, index, self) =>
        index === self.findIndex((p) => !PAGES_TO_EXCLUDE.includes(path.params.page) && p.params.page === path.params.page && p.locale === path.locale)
    );
    return { paths, fallback: 'blocking' as const };
}

const PAGES_TO_EXCLUDE = [
    'my-area',
    'eyewear-designers',
    'nostra-produzione',
    'home',
    'blog',
    'occhiali-da-vista',
    'occhiali-da-sole',
    'negozi-ottica-firenze',
    'shop',
    'donna',
    'uomo',
    'checkout',
    'checkout-3',
    'checkout-2',
    'cart-2',
    'cart-3',
    'my-account',
    'cart',
    'fragranze',
]
