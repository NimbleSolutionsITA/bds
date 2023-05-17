import React from "react";
import dynamic from "next/dynamic";
import Layout from "../src/layout/Layout";
import {getPageProps, mapAcfImage} from "../src/utils/wordpress_api";
import {Menus} from "../src/types/settings";
import {AcfAdvancedLink, AcfImage, AcfProductCategory, BaseProduct} from "../src/types/woocommerce";
import {GooglePlaces} from "./api/google-places";

const SliderWithText = dynamic(() => import("../src/components/SliderWithText"));
const ProductsSlider = dynamic(() => import("../src/components/ProductsSlider"));
const BannerNewsletter = dynamic(() => import("../src/components/BannerNewsletter"));
const BannerShipping = dynamic(() => import("../src/pages/home/BannerShipping"));
const BannerDesigners = dynamic(() => import("../src/pages/home/BannerDesigners"));
const BannerTop = dynamic(() => import("../src/pages/home/BannerTop"));
const BannerBottom = dynamic(() => import("../src/pages/home/BannerBottom"));
const BannerBottom2 = dynamic(() => import("../src/pages/home/BannerBottom2"));
const BannerTestimonials = dynamic(() => import("../src/pages/home/BannerTestimonials"));
const BannerContact = dynamic(() => import("../src/pages/home/BannerContact"));

export type HomeProps = {
    page: {
        sliderWithText: {
            body: string
            images: string[]
        }
        ourSelection: {
            title: string
            products: BaseProduct[]
        }
        newsletter: {
            body: string
            cta: string
        }
        shipping: {
            bodyLeft: string
            bodyRight: string
            bodyCenter: string
        }
        designers: {
            slider: AcfProductCategory[]
            body: string
        }
        bannerTop: {
            imageLeft: AcfImage
            body: string
            imageRight: AcfImage
        }
        bannerBottom: {
            leftColumn: {
                body: string
                cta: AcfAdvancedLink
            }
            imageCenter: AcfImage
            rightColumn: {
                body: string
                cta: AcfAdvancedLink
            }
        }
        bannerBottom2: {
            leftColumn: {
                body: string
                cta: AcfAdvancedLink
            }
            image: AcfImage
        }
    },
    menus: Menus,
    googlePlaces: GooglePlaces
}

export default function Home({page, menus, googlePlaces}: HomeProps) {
    return (
      <Layout menus={menus} googlePlaces={googlePlaces}>
          <SliderWithText body={page.sliderWithText.body} images={page.sliderWithText.images} />
          <ProductsSlider products={page.ourSelection.products ?? []} title={page.ourSelection.title} />
          <BannerNewsletter body={page.newsletter.body} ctaText={page.newsletter.cta} />
          <BannerShipping shipping={page.shipping} />
          <BannerDesigners designers={page.designers}/>
          <BannerTop bannerTop={page.bannerTop} />
          <BannerBottom bannerBottom={page.bannerBottom} />
          <BannerTestimonials reviews={googlePlaces.main.reviews} />
          <BannerBottom2 bannerBottom2={page.bannerBottom2} />
          <BannerContact />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: string}) {
    const [
        { page: { acf: {
            sliderWithText,
            ourSelection,
            newsletter,
            shipping,
            designers,
            bannerTop: { imageLeft, body, imageRight },
            bannerBottom: { leftColumn, imageCenter, rightColumn },
            bannerBottom2
        } }, seo, menus, googlePlaces }
    ] = await Promise.all([
        getPageProps('home', locale)
    ]);
    return {
        props: {
            page: {
                sliderWithText,
                ourSelection,
                newsletter,
                shipping,
                designers,
                bannerTop: {
                    imageLeft: mapAcfImage(imageLeft),
                    body,
                    imageRight: mapAcfImage(imageRight)
                },
                bannerBottom: {
                    leftColumn,
                    imageCenter: mapAcfImage(imageCenter),
                    rightColumn
                },
                bannerBottom2
            },
            seo,
            menus,
            googlePlaces
        },
        revalidate: 10
    }
}
