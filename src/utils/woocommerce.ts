import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { WORDPRESS_SITE_URL } from "./endpoints";

/**
 * Singleton del client REST WooCommerce condiviso da tutte le API route server-side.
 * Sostituisce le ~12 istanziazioni duplicate sparse in pages/api.
 */
export const wooApi = new WooCommerceRestApi({
	url: WORDPRESS_SITE_URL ?? '',
	consumerKey: process.env.WC_CONSUMER_KEY ?? '',
	consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
	version: "wc/v3",
});

export default wooApi;
