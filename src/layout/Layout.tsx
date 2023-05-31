import React, {useEffect} from "react";
import NavBar from "./nav/NavBar";
import NavBarMobile from "./nav/mobile/NavBarMobile";
import {BreadCrumb, Menus} from "../types/settings";
import Footer from "./footer/Footer";
import {GooglePlaces} from "../../pages/api/google-places";
import {useDispatch} from "react-redux";
import {initCart} from "../redux/cartSlice";
import CartDrawer from "./cart/CartDrawer";
import NewsletterDrawer from "./drawers/NewsletterDrawer";
import {Hidden} from "@mui/material";
import { parse, HTMLElement } from 'node-html-parser'
import Head from "next/head";

type LayoutProps = {
    children: React.ReactNode,
    menus: Menus,
    googlePlaces: GooglePlaces,
    breadcrumbs?: BreadCrumb[]
    seo?: string
}
const VOID_TAGS = [
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
    'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
];
export default function Layout({children, seo, breadcrumbs, googlePlaces, menus: {leftMenu, rightMenu, mobileMenu}}: LayoutProps) {
    const dispatch = useDispatch()
    const root = parse(seo ?? '');
    const headElements = root.childNodes;

    useEffect(() => {
        dispatch(initCart())
    })

    return (
        <>
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
            <CartDrawer />
            <NewsletterDrawer />
            {children}
            <Footer googlePlaces={googlePlaces} />
        </>
    )
}