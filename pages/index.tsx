import React from "react";
import dynamic from "next/dynamic";
import Layout from "../src/layout/Layout";
import {getPageProps, mapAcfImage} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {AcfImage, BaseProduct, WooProductCategory} from "../src/types/woocommerce";
import {EYEWEAR_CATEGORY, LOCALE} from "../src/utils/utils";
import {cacheGetLayoutProps} from "../src/utils/cache";

const Hero = dynamic(() => import("../src/pages/home/Hero"));
const HomeProductsSlider = dynamic(() => import("../src/pages/home/HomeProductsSlider"));
const BannerShop = dynamic(() => import("../src/pages/home/BannerShop"));
const BannerShipping = dynamic(() => import("../src/pages/home/BannerShipping"));
const BannerFragrances = dynamic(() => import("../src/pages/home/BannerFragrances"));
const BannerPress = dynamic(() => import("../src/pages/home/BannerPress"));
const OurProductionBanner = dynamic(() => import("../src/pages/home/OurProductionBanner"));

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
    buttonColor: string
    buttonTextColor: string
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
    }
}

export default function Home({page, layout}: HomeProps) {
    return (
      <Layout layout={layout}>
          <Hero {...page.hero} />
          <HomeProductsSlider {...page.selectionTop} />
          <BannerShop {...page.shop} />
          <OurProductionBanner {...page.ourProduction} />
          <HomeProductsSlider {...page.selectionBottom} />
          <BannerFragrances {...page.fragrances} />
          <BannerPress {...page.press} />
          <BannerShipping shipping={page.shipping} />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: LOCALE}) {
    const [
        {ssrTranslations, ...layoutProps},
        { seo, page }
    ] = await Promise.all([
        cacheGetLayoutProps(locale),
        getPageProps('home', locale)
    ]);

    if (!page) {
        return {
            notFound: true
        }
    }

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
