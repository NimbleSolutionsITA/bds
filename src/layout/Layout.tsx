import React from "react";
import NavBar from "./nav/NavBar";
import {useMediaQuery, useTheme} from "@mui/material";
import NavBarMobile from "./nav/mobile/NavBarMobile";
import {Menus} from "../types/settings";
import Footer from "./footer/Footer";
import {GooglePlaces} from "../../pages/api/google-places";

type LayoutProps = {
    children: React.ReactNode,
    menus: Menus,
    googlePlaces: GooglePlaces
}
export default function Layout({children, googlePlaces, menus: {leftMenu, rightMenu, mobileMenu}}: LayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <>
            {isMobile ?
                <NavBarMobile mobileMenu={mobileMenu} />  :
                <NavBar leftMenu={leftMenu} rightMenu={rightMenu} />
            }
            {children}
            <Footer googlePlaces={googlePlaces} />
        </>
    )
}