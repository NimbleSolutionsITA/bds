import {getLayoutProps, getShopPageProps} from "./wordpress_api";
import {LOCALE} from "./utils";

interface CacheItem {
	data: any;
	timestamp: number;
}

const cache: { [key: string]: CacheItem } = {};
const CACHE_TTL = 60 * 60 * 1000; // Cache for 1 hour

export const cacheGetLayoutProps = async (locale: LOCALE ): Promise<ReturnType<typeof getLayoutProps>> => {
	const cacheKey = `layoutProps_${locale}`;
	const cachedItem = cache[cacheKey];

	if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_TTL) {
		// Return the cached data if it is still valid
		console.log('cached value PDPDPD')
		return cachedItem.data;
	}

	// Fetch new data if not cached or cache expired
	const data = await getLayoutProps(locale);

	// Store it in the cache
	cache[cacheKey] = {
		data,
		timestamp: Date.now(),
	};

	return data;
};

const generateCacheKey = (locale: LOCALE, query?: any, slug?: string, parent?: number) => {
	return `shopPageProps_${locale}_${slug ?? ""}_${JSON.stringify(query ?? "")}_${parent ?? ''}`;
};

export const cacheGetShopPageProps = async (locale: LOCALE, query?: any, slug?: string, parent?: number) => {
	const cacheKey = generateCacheKey(locale, query, slug, parent);
	const cachedItem = cache[cacheKey];

	if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_TTL) {
		return cachedItem.data;
	}

	// Fetch fresh data if not cached or cache expired
	const data= await getShopPageProps(locale, query, slug, parent);

	// Store it in the cache
	cache[cacheKey] = {
		data,
		timestamp: Date.now(),
	};

	return data;
};