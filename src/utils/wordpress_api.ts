import {WORDPRESS_API_ENDPOINT, WORDPRESS_MENUS_ENDPOINT, WORDPRESS_RANK_MATH_SEO_ENDPOINT} from "./endpoints"
import {AcfImage, Category, Image, Product} from "../types/woocommerce";
function mapMenuItem(item: any) {
	return {
		id: item.ID,
		title: item.title,
		url: item.url,
		child_items: item.child_items ? item.child_items.map(mapMenuItem) : null,
	}
}
export const getPageProps = async<T> (slug: string, locale: string) => {
	const page = (await fetch(`${ WORDPRESS_API_ENDPOINT}/pages?slug=${slug}&lang=${locale}`).then(response => response.json()))[0]
	const seo = (await fetch(`${ WORDPRESS_RANK_MATH_SEO_ENDPOINT}?url=${page.link}`).then(response => response.json()))
	const menus = {
		leftMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-left${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())).items.map(mapMenuItem),
		rightMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-right${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())).items.map(mapMenuItem),
		mobileMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-mobile${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())).items.map(mapMenuItem),
		privacyMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/policy${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())).items.map(mapMenuItem)
	}
	return { page, seo, menus }
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
	   colors
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
		colors
})

export const mapCategory = ({id, name, slug}: Category) => ({
	id, name, slug
})

export const mapImage = ({id, src, name, alt}: Image) => ({
	id, src, name, alt
})

export const mapAcfImage = ({id, url, title, alt, width, height}: AcfImage) => ({
	id, url, title, alt, width, height
})