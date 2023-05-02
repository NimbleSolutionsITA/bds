import React from "react";
import Layout from "../src/layout/Layout";
import {getPageProps, mapAcfImage} from "../src/utils/wordpress_api";
import {Menus} from "../src/types/settings";
import {AcfAdvancedLink, AcfImage, AcfProduct, AcfProductCategory} from "../src/types/woocommerce";
import SliderWithText from "../src/components/SliderWithText";
import OurSelection from "../src/pages/home/OurSelection";
import BannerNewsletter from "../src/components/BannerNewsletter";
import bannerNewsletter from "../src/components/BannerNewsletter";

export type HomeProps = {
    page: {
        sliderWithText: {
            body: string
            images: string[]
        }
        ourSelection: {
            title: string
            products: AcfProduct[]
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
    menus: Menus
}
export default function Home({page: {sliderWithText, ourSelection, newsletter}, menus}: HomeProps) {
    return (
      <Layout menus={menus}>
          <SliderWithText body={sliderWithText.body} images={sliderWithText.images} />
          <OurSelection ourSelection={ourSelection} />
          <BannerNewsletter body={newsletter.body} ctaText={newsletter.cta} />
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
        } }, seo, menus }
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
            menus
        },
        revalidate: 10
    }
}
