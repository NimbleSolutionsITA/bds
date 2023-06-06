import {
	WORDPRESS_API_ENDPOINT,
	WORDPRESS_MENUS_ENDPOINT,
	WORDPRESS_RANK_MATH_SEO_ENDPOINT
} from "./endpoints"
import {AcfImage, Category, Image, Page, WooProductCategory, WPPage} from "../types/woocommerce";
import {getGooglePlaces} from "../../pages/api/google-places";
import {getProductCategories} from "../../pages/api/products/categories";
import {getProductCategory} from "../../pages/api/products/categories/[slug]";
import {EYEWEAR_CATEGORY, PROFUMUM_ROMA_CATEGORY, LIQUIDES_IMAGINAIRES_CATEGORY, sanitize} from "./utils";
import {getShippingInfo} from "../../pages/api/shipping";
import {getProducts} from "../../pages/api/products";
import {getAttributes} from "../../pages/api/products/colors";
import {getProductTags} from "../../pages/api/products/tags";

type MenuCategories = {
	designers: WooProductCategory[],
	fragrances: {
		profumum: WooProductCategory[],
		liquides: WooProductCategory[]
	},
}
function mapMenuItem(categories?: MenuCategories) {
	return function (item: any) {
		let child_items
		let groups = null
		if (item.slug ==='designers' && categories?.designers) {
			groups = ['A-J', 'K-Z']
			child_items = categories.designers.map(categoryToMenu('designers'))
		}
		else if (item.slug ==='fragranze' && categories?.fragrances) {
			groups = ['liquides-imaginaires', 'profumum-roma']
			child_items = [
				...categories.fragrances.profumum.map(categoryToMenu('profumum-roma')),
				...categories.fragrances.liquides.map(categoryToMenu('liquides-imaginaires'))
			]
		}
		else {
			child_items = item.child_items ? item.child_items.map(mapMenuItem()) : null
		}
		return {
			id: item.ID,
			title: item.title,
			url: item.url,
			child_items,
			groups
		}
	}
}
function categoryToMenu(path: string) {
	return function (category: WooProductCategory) {
		let parent
		if(path === 'designers') {
			const regex = /^[a-jA-J0-9\W]/;
			parent = regex.test(category.name) ? 'A-J' : 'K-Z'
		}
		else {
			parent = path
		}
		return {
			id: category.id,
			title: category.name,
			url: '/' + path + '/' + category.slug,
			child_items: null,
			parent
		}
	}
}

export const getLayoutProps = async (locale: 'it' | 'en') => {
	const categories = {
		designers: await getProductCategories(locale, EYEWEAR_CATEGORY[locale].toString()),
		fragrances: {
			profumum: await getProductCategories(locale, PROFUMUM_ROMA_CATEGORY[locale].toString()),
			liquides: await getProductCategories(locale, LIQUIDES_IMAGINAIRES_CATEGORY[locale].toString())
		}
	}
	const menus = {
		leftMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-left${locale !== 'it' ? '-'+locale : ''}`)
			.then(response => response.json())).items.map(mapMenuItem(categories)),
		rightMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-right${locale !== 'it' ? '-'+locale : ''}`)
			.then(response => response.json())).items.map(mapMenuItem(categories)),
		mobileMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/menu-mobile${locale !== 'it' ? '-'+locale : ''}`)
			.then(response => response.json())).items.map(mapMenuItem()),
		privacyMenu: (await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/policy${locale !== 'it' ? '-'+locale : ''}`)
			.then(response => response.json())).items.map(mapMenuItem())
	}
	const googlePlaces = await getGooglePlaces(locale)
	return { menus, googlePlaces}
}
export const getPageProps = async (slug: string, locale: 'it' | 'en', parent?: number) => {
	const page: WPPage = (await fetch(
		`${ WORDPRESS_API_ENDPOINT}/pages?slug=${slug}&lang=${locale}${parent ? `&parent=${parent}`: ''}`
	)
		.then(response => response.json()))[0]
	const seo = (await fetch(`${ WORDPRESS_RANK_MATH_SEO_ENDPOINT}?url=${page.link}`).then(response => response.json()))
	const { menus, googlePlaces } = await getLayoutProps(locale)
	return { page: mapPage(page), seo: seo.head, menus, googlePlaces }
}

export const getDesignersPageProps = async (locale: 'it' | 'en') => {
	const productCategories = await getProductCategories(locale, EYEWEAR_CATEGORY[locale].toString())
	return { productCategories: productCategories.map(mapProductCategory) }
}

export const getDesignerPageProps = async (locale: 'it' | 'en', slug: string) => {
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

export const getShopPageProps = async (locale: 'it' | 'en', query: {sunglasses?: boolean, optical?:boolean, man?:boolean, woman?: boolean} = {}, slug = 'shop', parent?: number) => {
	const [
		{ page, seo, menus, googlePlaces },
		products,
		{colors, attributes},
		tags,
		designers
	] = await Promise.all([
		getPageProps(slug, locale, parent),
		getProducts({
			lang: locale,
			per_page: '12',
			...query
		}),
		getAttributes(locale),
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
		attributes,
		breadcrumbs: [
			{ name: 'Home', href: urlPrefix + '/' },
			{ name: 'Shop', href: urlPrefix + '/shop' }
		],
		tags,
		designers: designers.map(mapCategory)
	}
}

export const getAllPagesIds = async () => {
	const pages: WPPage[] = (await fetch(`${ WORDPRESS_API_ENDPOINT}/pages?per_page=99`).then(response => response.json()))
	return pages.filter(({slug}) => ![
		'fragranze',
		'man',
		'woman',
		'optical',
		'sunglasses',
		'nostra-produzione',
		'dentro-diaries',
		'shop',
		'home',
		'designers'
	].includes(slug)).map(page => ({
		params: {
			page: page.slug,
		}
	}))
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

export const mapPage = ({id, slug, title, content, translations, link, acf}: WPPage): Page => ({
	id, slug, translations, link, acf, title: title.rendered, content: content.rendered
})