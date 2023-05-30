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

type LayoutProps = {
    children: React.ReactNode,
    menus: Menus,
    googlePlaces: GooglePlaces,
    breadcrumbs?: BreadCrumb[]
}
export default function Layout({children, breadcrumbs, googlePlaces, menus: {leftMenu, rightMenu, mobileMenu}}: LayoutProps) {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initCart())
    })
    return (
        <>
            <Hidden implementation="css" mdUp>
                <NavBarMobile mobileMenu={mobileMenu} />
            </Hidden>
            <Hidden implementation="css" mdDown>
                <NavBar leftMenu={leftMenu} rightMenu={rightMenu} breadcrumbs={breadcrumbs} />
            </Hidden>
            <CartDrawer />
            <NewsletterDrawer />
            {children}
            <Footer googlePlaces={googlePlaces} />
        </>
    )
}