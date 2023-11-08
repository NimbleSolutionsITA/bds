import React, {useEffect} from "react";
import NavBar from "./nav/NavBar";
import NavBarMobile from "./nav/mobile/NavBarMobile";
import {BaseLayoutProps} from "../types/settings";
import Footer from "./footer/Footer";
import {useDispatch} from "react-redux";

import {fetchCartData} from "../redux/cartSlice";
import CartDrawer from "./cart/CartDrawer";
import NewsletterDrawer from "./drawers/NewsletterDrawer";
import {Hidden} from "@mui/material";
import Head from "next/head";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from '@stripe/react-stripe-js';
import parse from "html-react-parser";
import InStockNotifierDrawer from "./drawers/InStockNotifierDrawer";
import CookiesDrawer from "./drawers/CookiesDrawer";
import {openCookiesDrawer} from "../redux/layout";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import Script from 'next/script'
import ShippingBannerMobile from "./nav/ShippingBannerMobile";
import SearchModal from "./drawers/SearchModal";
import {AppDispatch} from "../redux/store";

const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

type LayoutProps = {
    children: React.ReactNode,
    layout: BaseLayoutProps
}

export default function Layout({children, layout: {
    seo, breadcrumbs, googlePlaces, menus: {leftMenu, rightMenu, mobileMenu}, shipping, categories
}}: LayoutProps) {
    const {locale} = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const isAnalyticsEnabled = Cookies.get("analytics") === "true";
    /*const isProfilingEnabled = Cookies.get("profiling") === "true";*/
    /*const isUsageEnabled = Cookies.get("usage") === "true";*/

    useEffect(() => {
        dispatch(fetchCartData());
        const firstAccess = Cookies.get('firstAccess');
        if (!firstAccess) {
            // 'firstAccess' cookie doesn't exist. Setting the cookie and opening the CookiesDrawer.
            Cookies.set('firstAccess', 'false');
            dispatch(openCookiesDrawer());
        }
    })

    const stripePublicKey = process.env.NODE_ENV === 'production' ?
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_PRODUCTION :
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_SANDBOX;

    const stripePromise = loadStripe(stripePublicKey ?? '');

    return (
        <Elements stripe={stripePromise}>
            <Head>
                {/* Set HTML language attribute */}
                <meta httpEquiv="content-language" content={locale} />
                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                {seo && parse(seo)}
            </Head>
            {/* Google Tag Manager code */}
            {isAnalyticsEnabled && googleTagManagerId && (<>
                <Script id="google-analytics">
                    {`
                            window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                            ga('create', '${googleTagManagerId}', 'auto');
                            ga('send', 'pageview');
                        `}
                </Script>
                <Script src="https://www.google-analytics.com/analytics.js" />
            </>)}
            <Script id="twak" type="text/javascript">
                {`
                        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                        (function(){
                            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                            s1.async=true;
                            s1.src='https://embed.tawk.to/623ae69c5a88d50db1a6e778/1fur19kvb';
                            s1.charset='UTF-8';
                            s1.setAttribute('crossorigin','*');
                            s0.parentNode.insertBefore(s1,s0);
                        })();
                    `}
            </Script>
            <Hidden mdUp>
                <NavBarMobile mobileMenu={mobileMenu} breadcrumbs={breadcrumbs} />
                <ShippingBannerMobile />
            </Hidden>
            <Hidden mdDown>
                <NavBar leftMenu={leftMenu} rightMenu={rightMenu} breadcrumbs={breadcrumbs} />
            </Hidden>
            <CookiesDrawer />
            <InStockNotifierDrawer />
            <NewsletterDrawer />
            <CartDrawer shipping={shipping} categories={categories} />
            <SearchModal
                designers={categories.designers}
                profumum={categories.fragrances.profumum}
                liquides={categories.fragrances.liquides}
            />
            {children}
            <Footer googlePlaces={googlePlaces} />
        </Elements>
    )
}