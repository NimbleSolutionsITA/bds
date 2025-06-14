import React, {useState} from "react";
import dynamic from "next/dynamic";
import Layout from "../src/layout/Layout";
import {getPageProps, getPosts, mapAcfImage} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {AcfImage, Article, BaseProduct, WooProductCategory} from "../src/types/woocommerce";
import {EYEWEAR_CATEGORY, LOCALE} from "../src/utils/utils";
import {cacheGetLayoutProps, cacheGetPostAttributes} from "../src/utils/cache";
import ArticlesRow from "../src/components/ArticlesRow";
import {Container} from "@mui/material";

const Hero = dynamic(() => import("../src/pages/home/Hero"), { ssr: true });

const HomeProductsSlider = dynamic(() => import("../src/pages/home/HomeProductsSlider"), { ssr: false });
const BannerShop = dynamic(() => import("../src/pages/home/BannerShop"), { ssr: false });
const BannerShipping = dynamic(() => import("../src/pages/home/BannerShipping"), { ssr: false });
const BannerFragrances = dynamic(() => import("../src/pages/home/BannerFragrances"), { ssr: false });
const OurProductionBanner = dynamic(() => import("../src/pages/home/OurProductionBanner"), { ssr: false });

export type ProdSelection = {
    isActive: boolean
    title: string
    sunglasses: BaseProduct[]
    optical: BaseProduct[]
}
export type BannerBase = {
    isActive: boolean
    title: string
    body: string
    ctaText: string
}
export type Banner = BannerBase & {
    image: AcfImage
}
export type BannerGallery = BannerBase & {
    gallery: string[]
}

export type OurProduction = {
    title: string
    categories: {
        category: WooProductCategory
        image: AcfImage
    }[]
}

export type HeroProps = {
    video: string
    images: string[]
    buttonVariant: "contained"| "outlined"
    buttonColor: "primary" | "secondary"
}

export type Press = {
    title: string
    background: string
    quotes: {
        body: string
        author: string
    }[]
}

export type HomeProps = PageBaseProps & {
    page: {
        hero: HeroProps
        selectionTop: ProdSelection
        shop: Banner,
        ourProduction: OurProduction
        selectionBottom: ProdSelection
        fragrances: BannerGallery
        press: Press
        shipping: {
            bodyLeft: string
            bodyRight: string
            bodyCenter: string
        }
        postsByCategory: {
            type: string
            id: number
            posts: Article[]
        }[],
    }
}

export default function Home({page, layout}: HomeProps) {
    const [showRest, setShowRest] = useState(false);

    return (
        <Layout layout={layout}>
            <Hero {...page.hero} onLoadComplete={() => setShowRest(true)} />

            {showRest && (
                <>
                    <HomeProductsSlider {...page.selectionTop} />
                    <BannerShop {...page.shop} />
                    <OurProductionBanner {...page.ourProduction} />
                    <HomeProductsSlider {...page.selectionBottom} />
                    <BannerFragrances {...page.fragrances} />
                    <Container>
                        <ArticlesRow postsByCategory={page.postsByCategory[0]} />
                    </Container>
                    <BannerShipping shipping={page.shipping} />
                </>
            )}
        </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: LOCALE}) {
    const [
        {ssrTranslations, ...layoutProps},
        { seo, page },
        {  categories },
    ] = await Promise.all([
        cacheGetLayoutProps(locale),
        getPageProps('home', locale),
        cacheGetPostAttributes(locale)
    ]);

    if (!page) {
        return {
            notFound: true
        }
    }
    const postsByCategory = (await Promise.all(categories.map(category =>
        getPosts(locale, 1, 4, undefined, [category.id])
    ))).map(({posts}, index) => ({
        type: categories[index].name,
        id: categories[index].id,
        posts
    }));

    const { acf: {
        hero,
        selectionTop,
        shop,
        ourProduction,
        selectionBottom,
        fragrances,
        press,
        shipping,
    } } = page;

    return {
        props: {
            page: {
                hero,
                selectionTop,
                shop: {
                    ...shop,
                    image: mapAcfImage(shop.image)
                },
                ourProduction: {
                    ...ourProduction,
                    categories: ourProduction.categories.map((p: any) => ({
                        category: layoutProps.categories.find(c => Object.values(EYEWEAR_CATEGORY).includes(c.id))?.child_items?.find(c => c.id === Number(p.category)) ?? null,
                        image: mapAcfImage(p.image),
                    }))
                },
                selectionBottom,
                fragrances,
                press,
                shipping,
                postsByCategory,
            },
            layout: {
                ...layoutProps,
                seo
            },
            ...ssrTranslations
        },
        revalidate: 10
    }
}
