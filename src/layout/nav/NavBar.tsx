import TopBar from "./TopBar";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import {Menus} from "../../types/settings";

type NavBarProps = {
    leftMenu: Menus['leftMenu'],
    rightMenu: Menus['rightMenu']
}
export default function NavBar({leftMenu, rightMenu}: NavBarProps) {
    return (
        <>
            <TopBar />
            <AppBar leftMenu={leftMenu} rightMenu={rightMenu} />
            <BottomBar />
        </>
    )
}