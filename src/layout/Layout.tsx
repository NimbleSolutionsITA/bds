import React, {useEffect} from "react";
import NavBar from "./nav/NavBar";
import NavBarMobile from "./nav/mobile/NavBarMobile";
import {BaseLayoutProps} from "../types/settings";
import Footer from "./footer/Footer";
import {useDispatch, useSelector} from "react-redux";
import CartDrawer from "./cart/CartDrawer";
import NewsletterDrawer from "./drawers/NewsletterDrawer";
import {useMediaQuery, useTheme} from "@mui/material";
import Head from "next/head";
import parse from "html-react-parser";
import InStockNotifierDrawer from "./drawers/InStockNotifierDrawer";
import CookiesDrawer from "./drawers/CookiesDrawer";
import {openNewsletterDrawer} from "../redux/layoutSlice";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import ShippingBannerMobile from "./nav/ShippingBannerMobile";
import SearchModal from "./drawers/SearchModal";
import {AppDispatch, RootState} from "../redux/store";
import GoogleAnalytics from "../components/GoogleAnalytics";
import SignUpDrawer from "./drawers/SignUpDrawer";
import LogInDrawer from "./drawers/LogInDrawer";
import ForgotPasswordDrawer from "./drawers/ForgotPasswordDrawer";
import CartErrorModal from "./cart/CartErrorModal";
import Loading from "../components/Loading";
import WhatsAppButton from "../components/WhatsAppButton";

type LayoutProps = {
    children: React.ReactNode,
    layout: BaseLayoutProps
}



export default function Layout({children, layout: {
    seo, breadcrumbs, googlePlaces, menus, shipping, categories
}}: LayoutProps) {
    const {locale} = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const theme = useTheme();
    const mdUp = useMediaQuery(() => theme.breakpoints.up('md'));
    const { cart} = useSelector((state: RootState) => state.cart);
    const { cookiesDrawerOpen, newsletterDrawerOpen } = useSelector((state: RootState) => state.layout);

    useEffect(() => {
        const cookiesSeen = Cookies.get('is_cookies_seen');
        const newsletterSeen = Cookies.get('is_newsletter_seen');
        if (cookiesSeen && !cookiesDrawerOpen && !newsletterDrawerOpen && !newsletterSeen) {
            dispatch(openNewsletterDrawer());
        }
    }, [cookiesDrawerOpen])

    return (
        <>
            <Head>
                 Set HTML language attribute
                <meta httpEquiv="content-language" content={locale} />
                <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                {seo && parse(seo)}
            </Head>

            <GoogleAnalytics />

            {mdUp ?
                <NavBar left={menus.left} right={menus.right} categories={categories} breadcrumbs={breadcrumbs} /> : (<>
                <NavBarMobile mobileMenu={menus.mobile} breadcrumbs={breadcrumbs} categories={categories} />
                <ShippingBannerMobile />
            </>)}
            <WhatsAppButton />
            <CookiesDrawer />
            <InStockNotifierDrawer />
            <NewsletterDrawer />
            <LogInDrawer />
            <SignUpDrawer />
            <ForgotPasswordDrawer />
            <CartDrawer shipping={shipping} categories={categories} />
            <CartErrorModal />
            <SearchModal categories={categories} />
            {cart ? children : <Loading />}
            <Footer googlePlaces={googlePlaces} categories={categories} mobileMenu={menus.mobile} />
        </>
    )
}