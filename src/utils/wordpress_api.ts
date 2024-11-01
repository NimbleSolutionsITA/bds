import {
	WORDPRESS_API_ENDPOINT,
	WORDPRESS_MENUS_ENDPOINT,
	WORDPRESS_RANK_MATH_SEO_ENDPOINT, WORDPRESS_SITE_URL
} from "./endpoints"
import {
	AcfImage,
	ACFListArticle, Article,
	Category,
	Image, ImageDetailed,
	ListArticle,
	Page, PostCategory, Product,
	WooProductCategory,
	WPPage
} from "../types/woocommerce";
import {googlePlaces} from "../../pages/api/google-places";
import {getProductCategory} from "../../pages/api/products/categories";
import {
	EYEWEAR_CATEGORY, LOCALE,
	sanitize,
} from "./utils";
import {mapArticle} from "./mappers";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {
	cacheGetAttributes,
	cacheGetLayoutProps, cacheGetMenu,
	cacheGetProductCategories, cacheGetProducts,
	cacheGetProductTags,
	cacheGetShippingInfo
} from "./cache";

export const getSSRTranslations = async (locale: LOCALE) => {
	return await serverSideTranslations(locale, [
		'common',
	])
}

export const getMenu = async (locale: LOCALE, menuSlug: string) => {
	const menu = await fetch(`${ WORDPRESS_MENUS_ENDPOINT}/${menuSlug}${locale !== 'it' ? '-'+locale : ''}`).then(response => response.json())
	return menu.items.map(mapMenuItems)
}

type MenuItem = {
	id: number
	slug: string
	title: string
	url: string
	child_items: MenuItem[] | null
}

const mapMenuItems = (item: any): MenuItem => ({
	id: item.ID,
	slug: item.slug,
	title: item.title,
	url: item.url,
	child_items: item.child_items ? item.child_items.map(mapMenuItems) : null
})

const getCategories = async (categories: WooProductCategory[]) =>
	categories.filter(cat => cat.parent === 0).map(mapProductCategory(categories))

export const getLayoutProps = async (locale: LOCALE) => {
	const ssrTranslations = await getSSRTranslations(locale)
	const productCategories = (await cacheGetProductCategories(locale))
	const { classes: shipping, countries} = await cacheGetShippingInfo(locale)
	return {
		menus: {
			left: await cacheGetMenu(locale, 'menu-left'),
			right: await cacheGetMenu(locale, 'menu-right'),
			mobile: await cacheGetMenu(locale, 'menu-mobile'),
			privacy: await cacheGetMenu(locale, 'policy')
		},
		categories: await getCategories(productCategories),
		googlePlaces,
		shipping,
		countries,
		ssrTranslations
	}
}
export const getPageProps = async (slug: string, locale: LOCALE, parent?: number) => {
	const page: WPPage = (await fetch(
		`${ WORDPRESS_API_ENDPOINT}/pages?slug=${slug}&lang=${locale}${parent ? `&parent=${parent}`: ''}`
	)
		.then(response => response.json()))[0]
	if (!page) {
		return {page: false as const, seo: null}
	}
	const seo = page?.link ? await getSeo(page.link) : null
	return { page: mapPage(page), seo }
}

export const getSeo = async (link: string) => {
	let normalizedLink = link.replace('/en/categoria-prodotto/', '/categoria-prodotto/')
	const seo = await fetch(`${ WORDPRESS_RANK_MATH_SEO_ENDPOINT}?url=${normalizedLink}`).then(response => response.json())
	return seo.head ?? null
}

export const getPosts = async (locale?: LOCALE, page?: number, perPage?: number, slug?: string, categories?: number[], tags?: number[]): Promise<{posts: Article[]}> => {
	const posts = await fetch(
		`${ WORDPRESS_API_ENDPOINT}/posts?&page=${page || 1}&per_page=${perPage || 99}${locale ? '&lang='+locale : ''}${slug ? '&slug='+slug : ''}${categories ? `&categories=${categories.join(',')}` : ''}${tags ? `&tags=${tags.join(',')}` : ''}`
	)
		.then(response => response.json())
	return {posts: posts.map(mapArticle)}
}

export const getPostsAttributes = async (locale: LOCALE): Promise<{ tags: PostCategory[], categories: PostCategory[] }> => {
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

export const getCategoryPageProps = async (locale: LOCALE, slug: string) => {
	const layout = await cacheGetLayoutProps(locale)
	const productCategory = await getProductCategory(locale, slug)
	const seo =  productCategory && await getSeo(productCategory?.link)
	return { layout: { ...layout, seo: seo ?? null }, productCategory }
}

export const getCheckoutPageProps = async (locale: LOCALE) => {
	const shipping = await cacheGetShippingInfo(locale)
	const ssrTranslations = await getSSRTranslations(locale)
	return { shipping, ssrTranslations }
}

export const mapCategory = ({id, name, slug, count}: Category) => ({
	id, name: sanitize(name), slug, count
})

export const mapTag = ({id, name, slug}: Category) => ({
	id, name: sanitize(name), slug
})

export type GetShopPagePropsQuery = {sunglasses?: boolean, optical?:boolean, man?:boolean, woman?: boolean}

export const getShopPageProps = async (locale: LOCALE, query: GetShopPagePropsQuery = {}, slug = 'shop', parent?: number) => {
	const [
		{ssrTranslations, ...layoutProps},
		{ seo },
		products,
		{ colors, attributes },
		tags,
		designers
	] = await Promise.all([
		cacheGetLayoutProps(locale),
		getPageProps(slug, locale, parent),
		cacheGetProducts(locale, query),
		cacheGetAttributes(locale),
		cacheGetProductTags(locale),
		cacheGetProductCategories(locale, EYEWEAR_CATEGORY[locale])

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
		designers: designers.map(mapCategory),
		...ssrTranslations
	}
}

export const getAllPagesIds = async () => {
	let pages: WPPage[] = [];
	let page: number = 1;

	while (true) {
		const response = await fetch(`${WORDPRESS_API_ENDPOINT}/pages?per_page=100&page=${page}`);

		if (!response.ok) {
			if (response.status === 400) {
				break;
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		}

		const pageData: WPPage[] = await response.json();
		pages = pages.concat(pageData);

		if (pageData.length === 0) {
			break;
		}

		page++;
	}
	return pages.map(page => ({
		params: {
			page: page.slug,
		},
		locale: page.lang
	}));
}

export const getAllProductsIds = async () => {
	let pages: WPPage[] = [];
	let page: number = 1;

	while (true) {
		const response = await fetch(`${WORDPRESS_API_ENDPOINT}/product?per_page=100&page=${page}`);
		if (!response.ok) {
			if (response.status === 400) {
				break;
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		}

		const products: WPPage[] = await response.json();
		pages = pages.concat(products);

		if (products.length === 0) {
			break;
		}

		page++;
	}

	return pages.map(page => ({
		params: {
			slug: page.slug,
		},
		locale: page.lang
	}));
}

export const getAllPostIds = async () => {
	let posts: Article[] = [];
	let page: number = 1;

	while (true) {
		const response = await fetch(`${WORDPRESS_API_ENDPOINT}/posts?per_page=100&page=${page}`);

		if (!response.ok) {
			if (response.status === 400) {
				break;
			} else {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		}
		const postData: Article[] = await response.json();
		posts = posts.concat(postData);
		if (postData.length === 0) {
			break;
		}

		page++;
	}

	return posts.map(post => ({
		params: {
			post: post.slug,
		},
		locale: post.lang
	}));
}

export const getProduct = async (lang: string, slug: string): Promise<Product | string> => {
	const params = new URLSearchParams({slug, lang})
	return await fetch(`${WORDPRESS_SITE_URL}/wp-json/nimble/v1/product?${params.toString()}`)
		.then(res => res.json())
}

export const mapProductCategory = (categories: WooProductCategory[]) => (category: WooProductCategory): WooProductCategory => {
	return {
		id: category.id,
		name: category.name,
		slug: category.slug,
		description: category.description,
		image: category.image ? mapImage(category.image) : null,
		menu_order: category.menu_order,
		count: category.count,
		acf: category.acf,
		parent: category.parent,
		link: category.link,
		child_items: categories?.filter(cat => cat.parent === category.id).map(mapProductCategory(categories)),
		lang: category.lang
	}
}

export const mapImage = ({id, src, name, alt}: Image) => ({
	id, src, name, alt
})

export const mapAcfImage = ({id, url, title, alt, width, height}: AcfImage): AcfImage => ({
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