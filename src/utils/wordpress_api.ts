import {
	WORDPRESS_API_ENDPOINT,
	WORDPRESS_MENUS_ENDPOINT,
	WORDPRESS_RANK_MATH_SEO_ENDPOINT
} from "./endpoints"
import {
	AcfImage,
	ACFListArticle,
	Category,
	Image,
	ListArticle,
	Page, PostCategory,
	WooProductCategory,
	WPPage
} from "../types/woocommerce";
import {getGooglePlaces} from "../../pages/api/google-places";
import {getProductCategories} from "../../pages/api/products/categories";
import {EYEWEAR_CATEGORY, PROFUMUM_ROMA_CATEGORY, LIQUIDES_IMAGINAIRES_CATEGORY, sanitize} from "./utils";
import {getShippingInfo} from "../../pages/api/shipping";
import {getProducts} from "../../pages/api/products";
import {getAttributes} from "../../pages/api/products/colors";
import {getProductTags} from "../../pages/api/products/tags";
import {mapArticle} from "./mappers";

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
		else if (item.slug ==='fragrances' && categories?.fragrances) {
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
		let base = path
		if(path === 'designers') {
			const regex = /^[a-jA-J0-9\W]/;
			parent = regex.test(category.name) ? 'A-J' : 'K-Z'
		}
		else {
			parent = path
			base = 'fragrances'
		}
		return {
			id: category.id,
			title: category.name,
			url: '/' + base + '/' + category.slug,
			child_items: null,
			parent
		}
	}
}

export const getLayoutProps = async (locale: 'it' | 'en') => {
	const productCategories = (await getProductCategories(locale))
	const categories = {
		designers: productCategories.filter(cat => cat.parent === EYEWEAR_CATEGORY[locale]),
		fragrances: {
			profumum: productCategories.filter(cat => cat.parent === PROFUMUM_ROMA_CATEGORY[locale]),
			liquides: productCategories.filter(cat => cat.parent === LIQUIDES_IMAGINAIRES_CATEGORY[locale])
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

	const { classes: shipping} = await getShippingInfo(locale)
	return {
		menus,
		googlePlaces,
		categories: {
			designers: categories.designers.map(mapProductCategory),
			fragrances: {
				profumum: categories.fragrances.profumum.map(mapProductCategory),
				liquides: categories.fragrances.liquides.map(mapProductCategory)
			}
		},
		shipping
	}
}
export const getPageProps = async (slug: string, locale: 'it' | 'en', parent?: number) => {
	const page: WPPage = (await fetch(
		`${ WORDPRESS_API_ENDPOINT}/pages?slug=${slug}&lang=${locale}${parent ? `&parent=${parent}`: ''}`
	)
		.then(response => response.json()))[0]
	const seo = (await fetch(`${ WORDPRESS_RANK_MATH_SEO_ENDPOINT}?url=${page.link}`).then(response => response.json()))
	return { page: mapPage(page), seo: seo.head }
}

export const getPosts = async (locale: 'it' | 'en', page?: number, perPage?: number, slug?: string, categories?: number[], tags?: number[]) => {
	const posts = await fetch(
		`${ WORDPRESS_API_ENDPOINT}/posts?lang=${locale}&page=${page || 1}&per_page=${perPage || 10}${slug ? '&slug=${slug}' : ''}${categories ? `&categories=${categories.join(',')}` : ''}${tags ? `&tags=${tags.join(',')}` : ''}`
	)
		.then(response => response.json())
	return {posts: posts.map(mapArticle)}
}

export const getPostsAttributes = async (locale: 'it' | 'en'): Promise<{ tags: PostCategory[], categories: PostCategory[] }> => {
	const tags = await fetch(
		`${ WORDPRESS_API_ENDPOINT}/tags?lang=${locale}&per_page=100&hide_empty=true`
	)
		.then(response => response.json())
	const categories = await fetch(
		`${ WORDPRESS_API_ENDPOINT}/categories?lang=${locale}&per_page=100&hide_empty=true`
	)
		.then(response => response.json())
	return {
		tags: tags.map(mapTag),
		categories: categories.map(mapTag)
	}
}

export const getCategoryPageProps = async (locale: 'it' | 'en', slug: string) => {
	const layout = await getLayoutProps(locale)
	const productCategory = [
		...layout.categories.designers,
		...layout.categories.fragrances.liquides,
		...layout.categories.fragrances.profumum
	].find(cat => cat.slug === slug)
	return { layout, productCategory }
}

export const getCheckoutPageProps = async (locale: string) => {
	const shipping = await getShippingInfo(locale)
	return { shipping }
}

export const mapCategory = ({id, name, slug, count}: Category) => ({
	id, name: sanitize(name), slug, count
})

export const mapTag = ({id, name, slug}: Category) => ({
	id, name: sanitize(name), slug
})

export const getShopPageProps = async (locale: 'it' | 'en', query: {sunglasses?: boolean, optical?:boolean, man?:boolean, woman?: boolean} = {}, slug = 'shop', parent?: number) => {
	const [
		layoutProps,
		{ seo },
		products,
		{ colors, attributes },
		tags,
		designers
	] = await Promise.all([
		getLayoutProps(locale),
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
		layout: {
			...layoutProps,
			seo,
			breadcrumbs: [
				{ name: 'Home', href: urlPrefix + '/' },
				{ name: 'Shop', href: urlPrefix + '/shop' }
			],
		},
		products,
		colors,
		attributes,
		tags,
		designers: designers.map(mapCategory)
	}
}

export const getAllPagesIds = async () => {
	const pages: WPPage[] = (await fetch(`${ WORDPRESS_API_ENDPOINT}/pages?per_page=99`).then(response => response.json()))
	return pages.filter(({slug}) => ![
		'fragrances',
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

export const mapProductCategory = (category: WooProductCategory): WooProductCategory => ({
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

export const mapListArticle = ({ID, post_title, post_excerpt, featured_image, post_date, author_data, post_name, category_data, minutes_read}: ACFListArticle): ListArticle => ({
	id: ID,
	slug: post_name,
	title: post_title,
	excerpt: post_excerpt,
	image: featured_image,
	date: post_date,
	minutesRead: minutes_read,
	categories: category_data,
	author: {
		displayName: author_data.display_name,
		url: author_data.url ?? '',
	},
})