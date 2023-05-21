export const WORDPRESS_API_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2`
export const WORDPRESS_RANK_MATH_SEO_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/rankmath/v1/getHead`
export const WORDPRESS_MENUS_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/menus/v1/menus`

export const WORDPRESS_IN_STOCK_NOTIFIER_ENDPOINT = `${ process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wc-instocknotifier/v3/create_subscriber`
export const NEXT_API_ENDPOINT = process.env.NEXT_PUBLIC_SITE_URL + '/api'