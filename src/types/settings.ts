import {GooglePlaces} from "../../pages/api/google-places";
import {Country, ShippingClass, WooProductCategory} from "./woocommerce";

export type MenuItem = {
	id: number
	slug: string,
	title: string
	url: string
	parent?: number | string
	child_items: MenuItem[] | null
	groups?: string[] | null
}

export type Menus = {
	left: MenuItem[],
	right: MenuItem[],
	mobile: MenuItem[],
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
	countries: Country[]
	categories: WooProductCategory[]
	seo: string
}