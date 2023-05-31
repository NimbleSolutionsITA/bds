import {
	WORDPRESS_API_ENDPOINT,
	WORDPRESS_MENUS_ENDPOINT,
	WORDPRESS_RANK_MATH_SEO_ENDPOINT
} from "./endpoints"
import {AcfImage, Category, Image, WooProductCategory} from "../types/woocommerce";
import {getGooglePlaces} from "../../pages/api/google-places";
import {getProductCategories} from "../../pages/api/products/categories";
import {getProductCategory} from "../../pages/api/products/categories/[slug]";
import {EYEWEAR_CATEGORY, sanitize} from "./utils";
import {getShippingInfo} from "../../pages/api/shipping";
import {getProducts} from "../../pages/api/products";
import {getColors} from "../../pages/api/products/colors";
import {getProductTags} from "../../pages/api/products/tags";
function mapMenuItem(item: any) {
	return {
		id: item.ID,
		title: item.title,
		url: item.url,
		child_items: item.child_items ? item.child_items.map(mapMenuItem) : null,
	}
}

export const getLayoutProps = async (locale: string) => {
	const menus = {
		leftMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-left${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())).items.map(mapMenuItem),
		rightMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-right${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())).items.map(mapMenuItem),
		mobileMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-mobile${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())).items.map(mapMenuItem),
		privacyMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/policy${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())).items.map(mapMenuItem)
	}
	const googlePlaces = await getGooglePlaces(locale)
	return { menus, googlePlaces }
}
export const getPageProps = async (slug: string, locale: string) => {
	const page = (await fetch(`${ WORDPRESS_API_ENDPOINT}/pages?slug=${slug}&lang=${locale}`).then(response => response.json()))[0]
	const seo = (await fetch(`${ WORDPRESS_RANK_MATH_SEO_ENDPOINT}?url=${page.link}`).then(response => response.json()))
	const { menus, googlePlaces } = await getLayoutProps(locale)
	return { page, seo: seo.head, menus, googlePlaces }
}

export const getDesignersPageProps = async (locale: 'it' | 'en') => {
	const productCategories = await getProductCategories(locale, EYEWEAR_CATEGORY[locale].toString())
	return { productCategories: productCategories.map(mapProductCategory) }
}

export const getDesignerPageProps = async (locale: string, slug: string) => {
	const productCategory = await getProductCategory(locale, slug)
	const { menus, googlePlaces } = await getLayoutProps(locale)
	return { menus, googlePlaces, productCategory: productCategory ? mapProductCategory(productCategory) : null }
}

export const getCheckoutPageProps = async (locale: string) => {
	const shipping = await getShippingInfo(locale)
	return { shipping }
}

export const mapCategory = ({id, name, slug, count}: Category) => ({
	id, name: sanitize(name), slug, count
})

export const getShopPageProps = async (locale: string, query: {sunglasses?: boolean, optical?:boolean, man?:boolean, woman?: boolean} = {}) => {
	const [
		{ page, seo, menus, googlePlaces },
		products,
		colors,
		tags,
		designers
	] = await Promise.all([
		getPageProps("shop", locale),
		getProducts({
			lang: locale,
			per_page: '12',
			...query
		}),
		getColors(locale),
		getProductTags(locale),
		getProductCategories(locale, EYEWEAR_CATEGORY[locale as 'it' | 'en'].toString())

	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		seo,
		menus,
		googlePlaces,
		products,
		colors,
		breadcrumbs: [
			{ name: 'Home', href: urlPrefix + '/' },
			{ name: 'Shop', href: urlPrefix + '/shop' }
		],
		tags,
		designers: designers.map(mapCategory)
	}
}

export const mapProductCategory = (category: WooProductCategory) => ({
	id: category.id,
	name: category.name,
	slug: category.slug,
	description: category.description,
	image: category.image ? mapImage(category.image) : null,
	menu_order: category.menu_order,
	count: category.count,
	acf: category.acf,
	parent: category.parent,
})

export const mapImage = ({id, src, name, alt}: Image) => ({
	id, src, name, alt
})

export const mapAcfImage = ({id, url, title, alt, width, height}: AcfImage) => ({
	id, url, title, alt, width, height
})