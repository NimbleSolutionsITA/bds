import React from "react";
import NavBar from "./nav/NavBar";
import {useMediaQuery, useTheme} from "@mui/material";
import NavBarMobile from "./nav/mobile/NavBarMobile";
import {Menus} from "../types/settings";

type LayoutProps = {
    children: React.ReactNode,
    menus: Menus
}
export default function Layout({children, menus: {leftMenu, rightMenu, mobileMenu}}: LayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <>
            {isMobile ?
                <NavBarMobile mobileMenu={mobileMenu} />  :
                <NavBar leftMenu={leftMenu} rightMenu={rightMenu} />
            }
            {children}
        </>
    )
}