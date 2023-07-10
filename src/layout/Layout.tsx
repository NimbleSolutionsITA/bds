import React, {useEffect} from "react";
import NavBar from "./nav/NavBar";
import NavBarMobile from "./nav/mobile/NavBarMobile";
import {BaseLayoutProps} from "../types/settings";
import Footer from "./footer/Footer";
import {useDispatch} from "react-redux";
import {initCart} from "../redux/cartSlice";
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

const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

type LayoutProps = {
    children: React.ReactNode,
    layout: BaseLayoutProps
}

export default function Layout({children, layout: {
    seo, breadcrumbs, googlePlaces, menus: {leftMenu, rightMenu, mobileMenu}, shipping, categories
}}: LayoutProps) {
    const {locale} = useRouter()
    const dispatch = useDispatch()
    const isAnalyticsEnabled = Cookies.get("analytics") === "true";
    /*const isProfilingEnabled = Cookies.get("profiling") === "true";*/
    /*const isUsageEnabled = Cookies.get("usage") === "true";*/

    useEffect(() => {
        dispatch(initCart())
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
                {seo && parse(seo)}
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
            </Head>
            <Hidden mdUp>
                <NavBarMobile mobileMenu={mobileMenu} />
            </Hidden>
            <Hidden mdDown>
                <NavBar leftMenu={leftMenu} rightMenu={rightMenu} breadcrumbs={breadcrumbs} />
            </Hidden>
            <CookiesDrawer />
            <InStockNotifierDrawer />
            <NewsletterDrawer />
            <CartDrawer shipping={shipping} categories={categories} />
            {children}
            <Footer googlePlaces={googlePlaces} />
        </Elements>
    )
}