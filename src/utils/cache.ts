import {
	getLayoutProps,
	getMenu,
	getPosts,
	getPostsAttributes,
	getProduct,
	getShopPageProps,
	GetShopPagePropsQuery
} from "./wordpress_api";
import {LOCALE} from "./utils";
import {getShippingInfo} from "../../pages/api/shipping";
import {getAttributes} from "../../pages/api/products/colors";
import {getProductTags} from "../../pages/api/products/tags";
import {getProductCategories} from "../../pages/api/products/categories";
import {getProducts} from "../../pages/api/products";

interface CacheItem {
	data: any;
	timestamp: number;
}

const cache: { [key: string]: CacheItem } = {};
const CACHE_TTL = 60 * 60 * 1000; // Cache for 1 hour

export const cacheGetLayoutProps = async (locale: LOCALE ): Promise<ReturnType<typeof getLayoutProps>> =>
	cacheFunction(async () => await getLayoutProps(locale), `layoutProps_${locale}`);

export const cacheGetShopPageProps = async (locale: LOCALE, query?: any, slug?: string, parent?: number): Promise<ReturnType<typeof getShopPageProps>> =>
	cacheFunction(
		async () => await getShopPageProps(locale, query, slug, parent),
		`shopPageProps_${locale}_${slug ?? ""}_${JSON.stringify(query ?? "")}_${parent ?? ''}`
	);

export const cacheGetProductCategories = async (locale?: LOCALE, parent?: number): Promise<ReturnType<typeof getProductCategories>> =>
	cacheFunction(
		async () => await getProductCategories(locale, parent),
		`productCategories_${locale ?? ""}_${parent ?? ''}`
	);

export const cacheGetShippingInfo = async (locale: LOCALE ): Promise<ReturnType<typeof getShippingInfo>> =>
	cacheFunction(async () => await getShippingInfo(locale), `shippingInfo_${locale}`);

export const cacheGetAttributes = async (locale: LOCALE ): Promise<ReturnType<typeof getAttributes>> =>
	cacheFunction(async () => await getAttributes(locale), `attributes_${locale}`);

export const cacheGetProductTags = async (locale: LOCALE ): Promise<ReturnType<typeof getProductTags>> =>
	cacheFunction(async () => await getProductTags(locale), `productTags_${locale}`);

export const cacheGetMenu = async (locale: LOCALE, menuSlug: string): Promise<ReturnType<typeof getMenu>> =>
	cacheFunction(async () => await getMenu(locale, menuSlug), `menu_${locale}_${menuSlug}`);

export const cacheGetPosts = async (locale: LOCALE, page?: number, perPage?: number, slug?: string, categories?: number[]): Promise<ReturnType<typeof getPosts>> =>
	cacheFunction(
		async () => await getPosts(locale, page, perPage, slug, categories),
		`posts_${locale}_${page}_${perPage}_${slug ?? ""}_${JSON.stringify(categories ?? [])}`
	)

export const cacheGetProduct = async (locale: LOCALE, slug: string): Promise<ReturnType<typeof getProduct>> =>
	cacheFunction(async () => await getProduct(locale, slug), `product_${locale}_${slug}`)

export const cacheGetPostAttributes = async (locale: LOCALE): Promise<ReturnType<typeof getPostsAttributes>> =>
	cacheFunction(async () => await getPostsAttributes(locale), `postAttributes_${locale}`);

export const cacheGetProducts = async (locale: LOCALE, query: GetShopPagePropsQuery = {}): Promise<ReturnType<typeof getProducts>> =>
	cacheFunction(
		async () => await getProducts({
			lang: locale,
			per_page: '12',
			...query
		}),
		`products_${locale}_${JSON.stringify(query)}`);


const cacheFunction = async (fn: Function, cacheKey: string) => {
	const cachedItem = cache[cacheKey];

	if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_TTL) {
		return cachedItem.data;
	}

	const data = await fn();

	cache[cacheKey] = {
		data,
		timestamp: Date.now(),
	};

	return data;
}