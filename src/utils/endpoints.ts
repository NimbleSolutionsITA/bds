
export const WORDPRESS_HOSTNAME = process.env.NEXT_PUBLIC_WP_SUBDOMAIN + '.' + process.env.NEXT_PUBLIC_DOMAIN
export const WORDPRESS_SITE_URL = process.env.NEXT_PUBLIC_SITE_PROTOCOL + '://' + WORDPRESS_HOSTNAME
export const WORDPRESS_API_ENDPOINT = WORDPRESS_SITE_URL + '/wp-json/wp/v2'
export const WORDPRESS_RANK_MATH_SEO_ENDPOINT = `${ WORDPRESS_SITE_URL}/wp-json/rankmath/v1/getHead`
export const WORDPRESS_MENUS_ENDPOINT = `${ WORDPRESS_SITE_URL}/wp-json/menus/v1/menus`
export const WORDPRESS_IN_STOCK_NOTIFIER_ENDPOINT = `${ WORDPRESS_SITE_URL}/wp-json/wc-instocknotifier/v3/create_subscriber`
export const NEXT_SITE_HOSTNAME = (process.env.NEXT_PUBLIC_SITE_SUBDOMAIN ?
	process.env.NEXT_PUBLIC_SITE_SUBDOMAIN + '.' : '') + process.env.NEXT_PUBLIC_DOMAIN;
export const NEXT_SITE_URL = process.env.NEXT_PUBLIC_SITE_PROTOCOL + '://' + NEXT_SITE_HOSTNAME
export const NEXT_API_ENDPOINT =  NEXT_SITE_URL + '/api'

/**
 * Costruisce i link hreflang da una mappa { lingua: slug } (esposta dai payload WP
 * via Polylang). `buildPath(slug)` ritorna il path SENZA prefisso lingua e con lo
 * slash iniziale, es. `/products/${slug}`. La lingua 'it' (default) non ha prefisso.
 */
export const buildHrefAlternates = (
	translations: { [locale: string]: string } | undefined,
	buildPath: (slug: string) => string
): { locale: string; href: string }[] | undefined => {
	if (!translations || Object.keys(translations).length === 0) return undefined;
	return Object.entries(translations).map(([locale, slug]) => ({
		locale,
		href: `${NEXT_SITE_URL}${locale === 'it' ? '' : '/' + locale}${buildPath(slug)}`,
	}));
};
export const BLOG_POST_SUB_PATH = 'blog'
export const CHECKOUT_SUB_PATH = 'checkout'
export const DESIGNERS_SUB_PATH = 'eyewear-designers'
export const FRAGRANCES_SUB_PATH = 'fragranze'
export const OUR_PRODUCTION_SUB_PATH = 'nostra-produzione'
export const PRODUCT_SUB_PATH = 'products'

export const INSTAGRAM_LINK = 'https://www.instagram.com/bottegadisguardi/'
export const FACEBOOK_LINK = 'https://www.facebook.com/bottegadisguardi'
export const DESIGNERS_CATEGORY = "eyewear"