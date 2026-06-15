import { CoCartError } from "../redux/cartSlice";

/**
 * Traduce gli errori del carrello CoCart (codici tipo cocart_coupon_not_exist,
 * cocart_quantity_invalid_amount, ...) in messaggi leggibili e localizzati, con
 * fallback generico. Mappa per sottostringa del codice (i codici hanno il prefisso
 * cocart_/woocommerce_).
 */
const CART_ERROR_KEYS: { code: string; key: string }[] = [
	{ code: 'coupon_not_exist', key: 'coupon_not_exist' },
	{ code: 'coupon_already_applied', key: 'coupon_already_applied' },
	{ code: 'coupon_used', key: 'coupon_invalid' },
	{ code: 'coupon_email', key: 'coupon_invalid' },
	{ code: 'coupon', key: 'coupon_invalid' }, // catch-all coupon (dopo i casi specifici)
	{ code: 'quantity', key: 'quantity_invalid' }, // cocart_quantity_invalid_amount
	{ code: 'exceeds_stock', key: 'out_of_stock' },
	{ code: 'out_of_stock', key: 'out_of_stock' },
	{ code: 'not_enough_stock', key: 'out_of_stock' },
	{ code: 'invalid_product', key: 'invalid_product' },
	{ code: 'no_variation_found', key: 'invalid_product' },
	{ code: 'cannot_be_purchased', key: 'invalid_product' },
	{ code: 'authentication', key: 'session_expired' }, // woocommerce_rest_authentication_error
];

export const getCartErrorMessage = (
	error: CoCartError | null | undefined,
	t: (key: string) => string
): string => {
	const code = String(error?.error ?? '').toLowerCase();
	const match = CART_ERROR_KEYS.find(({ code: c }) => code.includes(c));
	return t(`cart.errors.${match ? match.key : 'generic'}`);
};

export default getCartErrorMessage;
