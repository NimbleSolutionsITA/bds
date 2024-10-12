import TopBar from "./TopBar";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import {BreadCrumb, MenuItem, Menus} from "../../types/settings";
import {WooProductCategory} from "../../types/woocommerce";
import {
    DESIGNERS_CATEGORY,
    DESIGNERS_SUB_PATH,
    FRAGRANCES_SUB_PATH,
    OUR_PRODUCTION_SUB_PATH,
} from "../../utils/endpoints";
import {FRAGRANCES_CATEGORY, OUR_PRODUCTION_CATEGORIES} from "../../utils/utils";

type NavBarProps = {
    left: MenuItem[]
    right: MenuItem[]
    categories: WooProductCategory[]
    breadcrumbs?: BreadCrumb[]
}
export default function NavBar({left, right, categories, breadcrumbs}: NavBarProps) {
    const mapMenuItem = mapMenu(categories)
    return (
        <>
            <TopBar />
            <AppBar leftMenu={left.map(mapMenuItem)} rightMenu={right.map(mapMenuItem)} />
            <BottomBar breadcrumbs={breadcrumbs} />
        </>
    )
}

const mapMenu = (categories: WooProductCategory[]) => (item: MenuItem): MenuItem => {
    let child_items: MenuItem[]
    let groups = null
    if (item.slug === DESIGNERS_SUB_PATH) {
        groups = ['A-J', 'K-Z']
        const category = categories.find(c => c.slug === DESIGNERS_CATEGORY)
        child_items = category?.child_items?.map(categoryToMenu(DESIGNERS_SUB_PATH)) as MenuItem[]
    }
    else if (item.slug === FRAGRANCES_SUB_PATH) {
        const category = categories.find(c => Object.values(FRAGRANCES_CATEGORY).includes(c.id))
        const items = category?.child_items?.sort((a, b) => a.menu_order - b.menu_order)
        groups = items?.map(c => c.slug)
        child_items = items?.map(item => item.child_items?.sort((a, b) => a.menu_order - b.menu_order).map(c => categoryToMenu(item.slug)(c))).flat() as MenuItem[]
    }
    else if (item.slug === OUR_PRODUCTION_SUB_PATH) {
        child_items = categories?.find(c => c.slug === DESIGNERS_CATEGORY)?.child_items?.filter(c => [...OUR_PRODUCTION_CATEGORIES.it, ...OUR_PRODUCTION_CATEGORIES.en].includes(c.id))
            .map(categoryToMenu(OUR_PRODUCTION_SUB_PATH)) as MenuItem[]
    }
    else {
        child_items = item.child_items as MenuItem[]
    }
    return {
        id: item.id,
        title: item.title,
        url: item.url,
        slug: item.slug,
        child_items,
        groups,
        parent: item.parent
    }
}

const categoryToMenu = (path: string) => (category: WooProductCategory): MenuItem => {
    let parent = ""
    let base = path
    if (path === OUR_PRODUCTION_SUB_PATH) {
        base = path
    }
    else if(path === DESIGNERS_SUB_PATH) {
        const regex = /^[a-jA-J0-9\W]/;
        parent = regex.test(category.name) ? 'A-J' : 'K-Z'
    }
    else {
        parent = path
        base = path
    }
    return {
        id: category.id,
        title: category.name,
        slug: category.slug,
        url: '/' + base + '/' + category.slug,
        child_items: null,
        parent
    }
}