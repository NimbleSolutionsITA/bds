import React from "react";
import dynamic from "next/dynamic";
import Layout from "../src/layout/Layout";
import {getPageProps, mapAcfImage} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {AcfAdvancedLink, AcfImage, AcfProductCategory, BaseProduct} from "../src/types/woocommerce";
import {LOCALE} from "../src/utils/utils";
import {cacheGetLayoutProps} from "../src/utils/cache";

const Hero = dynamic(() => import("../src/pages/home/Hero"));
const BannerShipping = dynamic(() => import("../src/pages/home/BannerShipping"));
const BannerContact = dynamic(() => import("../src/pages/home/BannerContact"));

export type HomeProps = PageBaseProps & {
    page: {
        sliderWithText: {
            body: string
            images: string[]
        }
        selectionTop: {
            isActive: boolean
            title: string
            products: BaseProduct[]
        }
        brands: {
            isActive: boolean
            title: string
            left: {
                title: string
                photo: AcfImage
                link: AcfAdvancedLink
            },
            center: {
                title: string
                photo: AcfImage
                link: AcfAdvancedLink
            },
            right: {
                title: string
                photo: AcfImage
                link: AcfAdvancedLink
            }
        }
        selectionBottom: {
            isActive: boolean
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
        },
        bannerContact: {
            title: string
            subtitle: string
            subtitle2: string
            whatsapp1: string
            whatsapp2: string
            email: string
        }
    }
}

export default function Home({page, layout}: HomeProps) {
    return (
      <Layout layout={layout}>
          <Hero images={page.sliderWithText.images} video="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" />
          <BannerShipping shipping={page.shipping} />
          <BannerContact bannerContact={page.bannerContact}  />
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
        sliderWithText,
        newsletter,
        shipping,
        designers,
        bannerTop: { imageLeft, body, imageRight },
        bannerBottom: { leftColumn, imageCenter, rightColumn },
        bannerBottom2,
        bannerContact,
        selectionTop,
        selectionBottom,
        brands
    } } = page;

    return {
        props: {
            page: {
                sliderWithText,
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
                bannerBottom2,
                bannerContact,
                selectionTop,
                selectionBottom,
                brands: {
                    isActive: brands.isActive,
                    title: brands.title,
                    left: {
                        title: brands.left.title,
                        photo: mapAcfImage(brands.left.photo),
                        link: brands.left.link
                    },
                    center: {
                        title: brands.center.title,
                        photo: mapAcfImage(brands.center.photo),
                        link: brands.center.link
                    },
                    right: {
                        title: brands.right.title,
                        photo: mapAcfImage(brands.right.photo),
                        link: brands.right.link
                    }
                }
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
