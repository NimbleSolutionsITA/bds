import {GooglePlaces} from "../../pages/api/google-places";
import {ShippingClass, WooProductCategory} from "./woocommerce";

export type MenuItem = {
	id: number
	title: string
	url: string
	child_items: MenuItem[] | null
	groups?: string[] | null
	parent?: string | null
}

export type Menus = {
	leftMenu: MenuItem[],
	rightMenu: MenuItem[],
	mobileMenu: MenuItem[],
	privacy: MenuItem[],
}

export type BreadCrumb = {
	name: string,
	href: string
}

export type PageBaseProps = {
	layout: BaseLayoutProps
}

export type BaseLayoutProps = {
	menus: Menus,
	googlePlaces: GooglePlaces,
	breadcrumbs?: BreadCrumb[]
	shipping: ShippingClass[]
	categories: {
		designers: WooProductCategory[],
		fragrances: {
			profumum: WooProductCategory[],
			liquides: WooProductCategory[]
		}
	}
	seo: string
}