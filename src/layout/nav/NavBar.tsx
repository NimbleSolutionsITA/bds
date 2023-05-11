import TopBar from "./TopBar";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import {BreadCrumb, Menus} from "../../types/settings";

type NavBarProps = {
    leftMenu: Menus['leftMenu']
    rightMenu: Menus['rightMenu']
    breadcrumbs?: BreadCrumb[]
}
export default function NavBar({leftMenu, rightMenu, breadcrumbs}: NavBarProps) {
    return (
        <>
            <TopBar />
            <AppBar leftMenu={leftMenu} rightMenu={rightMenu} />
            <BottomBar breadcrumbs={breadcrumbs} />
        </>
    )
}