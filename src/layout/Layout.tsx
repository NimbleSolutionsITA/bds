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
import { parse, HTMLElement } from 'node-html-parser'
import Head from "next/head";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from '@stripe/react-stripe-js';

type LayoutProps = {
    children: React.ReactNode,
    layout: BaseLayoutProps
}
const VOID_TAGS = [
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
    'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
];
export default function Layout({children, layout: {
    seo, breadcrumbs, googlePlaces, menus: {leftMenu, rightMenu, mobileMenu}, shipping
}}: LayoutProps) {
    const dispatch = useDispatch()
    const root = parse(seo ?? '');
    const headElements = root.childNodes;

    useEffect(() => {
        dispatch(initCart())
    })

    const stripePublicKey = process.env.NODE_ENV === 'production' ?
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_PRODUCTION :
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_SANDBOX;

    const stripePromise = loadStripe(stripePublicKey ?? '');

    return (
        <Elements stripe={stripePromise}>
            <Head>
                {headElements.map((node, index) => {
                    if (node instanceof HTMLElement) {
                        const tagName = node.tagName.toLowerCase();
                        const attributes = node.attributes;
                        const innerText = node.rawText;
                        return (
                            <React.Fragment key={index}>
                                {VOID_TAGS.includes(tagName) ?
                                    React.createElement(tagName, attributes) :
                                    React.createElement(tagName, attributes, innerText)
                                }
                            </React.Fragment>
                        )
                    }
                })}
            </Head>
            <Hidden mdUp>
                <NavBarMobile mobileMenu={mobileMenu} />
            </Hidden>
            <Hidden mdDown>
                <NavBar leftMenu={leftMenu} rightMenu={rightMenu} breadcrumbs={breadcrumbs} />
            </Hidden>
            <CartDrawer shipping={shipping} />
            <NewsletterDrawer />
            {children}
            <Footer googlePlaces={googlePlaces} />
        </Elements>
    )
}