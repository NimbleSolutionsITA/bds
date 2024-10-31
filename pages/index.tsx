import React from "react";
import dynamic from "next/dynamic";
import Layout from "../src/layout/Layout";
import {getPageProps} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {BaseProduct} from "../src/types/woocommerce";
import {LOCALE} from "../src/utils/utils";
import {cacheGetLayoutProps} from "../src/utils/cache";

const Hero = dynamic(() => import("../src/pages/home/Hero"));
const HomeProductsSlider = dynamic(() => import("../src/pages/home/HomeProductsSlider"));
const BannerShipping = dynamic(() => import("../src/pages/home/BannerShipping"));

export type HomeProps = PageBaseProps & {
    page: {
        hero: {
            video: string
            images: string[]
        }
        selectionTop: {
            isActive: boolean
            title: string
            sunglasses: BaseProduct[]
            optical: BaseProduct[]
        }
        shop: {
            isActive: boolean
            title: string
            body: string
            ctaText: string
        }
        selectionBottom: {
            isActive: boolean
            title: string
            sunglasses: BaseProduct[]
            optical: BaseProduct[]
        }
        shipping: {
            bodyLeft: string
            bodyRight: string
            bodyCenter: string
        }
    }
}

export default function Home({page, layout}: HomeProps) {
    console.log(page.shop)
    return (
      <Layout layout={layout}>
          <Hero images={page.hero.images} video={page.hero.video} />
          {page.selectionTop.isActive && (
              <HomeProductsSlider
                  sunglasses={page.selectionTop.sunglasses}
                  optical={page.selectionTop.optical}
                  title={page.selectionTop.title}
              />
          )}
          {page.selectionBottom.isActive && (
              <HomeProductsSlider
                  sunglasses={page.selectionBottom.sunglasses}
                  optical={page.selectionBottom.optical}
                  title={page.selectionBottom.title}
              />
          )}
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
        shipping,
        bannerContact,
        selectionTop,
        shop,
        selectionBottom,
    } } = page;

    return {
        props: {
            page: {
                hero,
                shipping,
                bannerContact,
                selectionTop,
                shop,
                selectionBottom
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
