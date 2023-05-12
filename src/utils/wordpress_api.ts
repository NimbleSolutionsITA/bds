import {
	NEXT_API_ENDPOINT,
	WORDPRESS_API_ENDPOINT,
	WORDPRESS_MENUS_ENDPOINT,
	WORDPRESS_RANK_MATH_SEO_ENDPOINT
} from "./endpoints"
import {AcfImage, Category, Image, Product, Variation, WooProductCategory} from "../types/woocommerce";
import {getGooglePlaces} from "../../pages/api/google-places";
import {getProductCategories} from "../../pages/api/products/categories";
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
	return { page, seo, menus, googlePlaces }
}

export const getDesignersPageProps = async (locale: string) => {
	const productCategories = await getProductCategories(locale, '188')
	return { productCategories: productCategories.map(mapProductCategory) }
}

export const getDesignerPageProps = async (locale: string, slug: string) => {
	const { productCategory } = (await fetch(`${ NEXT_API_ENDPOINT}/products/categories/${slug}?lang=${locale}`).then(response => response.json()))
	const { menus, googlePlaces } = await getLayoutProps(locale)
	return { menus, googlePlaces, productCategory: productCategory ? mapProductCategory(productCategory) : null }
}

export const getProducts = async (locale: string, categories?: string): Promise<{products: Product[]}> => {
	const { products } = (await fetch(`${ NEXT_API_ENDPOINT}/products?lang=${locale}${categories ? '&categories='+categories : ''}`).then(response => response.json()))
	return { products }
}

export const getProductVariations = async (id: number): Promise<{productVariations: Variation[]}> => {
	const { productVariations } = (await fetch(`${ NEXT_API_ENDPOINT}/products/${id}/variations`).then(response => response.json()))
	return { productVariations: productVariations.map(mapVariation) }
}


export const mapProduct = ({
		id,
		slug,
		name,
		description,
		price,
		type,
		categories,
		attributes,
		related_ids,
		short_description,
		regular_price,
		sale_price,
		tags,
		default_attributes,
		variations,
		images,
		colors,
		stock_status,
		lang,
		translations,
		stock_quantity,
		manage_stock,
		backordered,
		backorders_allowed,
		backorders
}: Product) => ({
		id,
		slug,
		name,
		description,
		price,
		type,
		categories: categories.map(mapCategory),
		attributes,
		related_ids,
		short_description,
		regular_price,
		sale_price,
		tags,
		default_attributes,
		variations,
		images: images.map(mapImage),
		colors,
		stock_status,
		lang,
		translations,
		stock_quantity,
		manage_stock,
		backordered,
		backorders_allowed,
		backorders
})

export const mapVariation = ({
	id,
	price,
	attributes,
	regular_price,
	sale_price,
	image,
	stock_status,
	lang,
	translations,
	stock_quantity,
	manage_stock,
	backordered,
	backorders_allowed,
	backorders
}: Variation) => ({
	id,
	price,
	attributes,
	regular_price,
	sale_price,
	image: mapImage(image),
	stock_status,
	lang,
	translations,
	stock_quantity,
	manage_stock,
	backordered,
	backorders_allowed,
	backorders
})

export const mapCategory = ({id, name, slug}: Category) => ({
	id, name, slug
})

export const mapProductCategory = (category: WooProductCategory) => ({
	id: category.id,
	name: category.name,
	slug: category.slug,
	description: category.description,
	image: mapImage(category.image),
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