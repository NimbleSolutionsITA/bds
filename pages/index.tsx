import React from "react";
import dynamic from "next/dynamic";
import Layout from "../src/layout/Layout";
import {getLayoutProps, getPageProps, mapAcfImage} from "../src/utils/wordpress_api";
import {PageBaseProps} from "../src/types/settings";
import {AcfAdvancedLink, AcfImage, AcfProductCategory, BaseProduct} from "../src/types/woocommerce";

const SliderWithText = dynamic(() => import("../src/components/SliderWithText"));
const ProductsCategorySlider = dynamic(() => import("../src/components/ProductsCategorySlider"));
const BannerNewsletter = dynamic(() => import("../src/components/BannerNewsletter"));
const BannerShipping = dynamic(() => import("../src/pages/home/BannerShipping"));
const BannerDesigners = dynamic(() => import("../src/pages/home/BannerDesigners"));
const BannerTop = dynamic(() => import("../src/pages/home/BannerTop"));
const BannerBrands = dynamic(() => import("../src/pages/home/BannerBrands"));
const BannerBottom = dynamic(() => import("../src/pages/home/BannerBottom"));
const BannerBottom2 = dynamic(() => import("../src/pages/home/BannerBottom2"));
const BannerTestimonials = dynamic(() => import("../src/pages/home/BannerTestimonials"));
const BannerContact = dynamic(() => import("../src/pages/home/BannerContact"));

export type HomeProps = PageBaseProps & {
    page: {
        sliderWithText: {
            body: string
            images: string[]
        }
        ourSelection: {
            title: string
            products: BaseProduct[]
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
          <SliderWithText body={page.sliderWithText.body} images={page.sliderWithText.images} />
          <ProductsCategorySlider {...page.selectionTop} />
          <BannerBrands {...page.brands} />
          <ProductsCategorySlider {...page.selectionBottom} />
          <BannerDesigners designers={page.designers}/>
          <BannerTop bannerTop={page.bannerTop} />
          <BannerBottom bannerBottom={page.bannerBottom} />
          <BannerBottom2 bannerBottom2={page.bannerBottom2} />
          <BannerNewsletter body={page.newsletter.body} ctaText={page.newsletter.cta} />
          <BannerShipping shipping={page.shipping} />
          <BannerTestimonials reviews={layout.googlePlaces.main.reviews} />
          <BannerContact bannerContact={page.bannerContact}  />
      </Layout>
    );
}

export async function getStaticProps({ locale }: { locales: string[], locale: 'it' | 'en'}) {
    const [
        {ssrTranslations, ...layoutProps},
        { seo, page }
    ] = await Promise.all([
        getLayoutProps(locale),
        getPageProps('home', locale)
    ]);

    if (!page) {
        return {
            notFound: true
        }
    }

    const { acf: {
        sliderWithText,
        ourSelection,
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
