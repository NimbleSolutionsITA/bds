import type { NextApiRequest, NextApiResponse } from 'next'
import { wooApi as api } from "../../../src/utils/woocommerce";
import {getIsEU} from "../../../src/utils/utils";
import {Cart, Item} from "../../../src/types/cart-type";
import {WooOrder} from "../../../src/types/woocommerce";
import * as Sentry from "@sentry/nextjs";

const base = process.env.PAYPAL_API_URL;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET

export type CreateOrderResponse = {
	success: boolean
	id?: string
	error?: string
	wooOrder?: WooOrder
}


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateOrderResponse>
) {
	const responseData: CreateOrderResponse = {
		success: false,
	}
	let orderPayload = {}
	try {
		if (req.method === 'POST') {
			const { cart, invoice = null, customerNote = "", customerId = 0, paymentMethod, wooOrderId } = req.body

			if (!cart) {
				throw new Error('Cart or customer data is missing')
			}
			const cartAmount = Number(cart.totals.total) / 100
			if (cartAmount === 0) {
				throw new Error('Cart amount is 0')
			}
			// Riusa l'ordine pending del tentativo precedente (stesso carrello) o ne crea
			// uno nuovo. Evita orfani/pile-up: un solo ordine per sessione di checkout.
			const order = await getOrCreateOrder(cart, invoice, customerNote, customerId, paymentMethod, wooOrderId)
			responseData.wooOrder = order
			if (Number(order.total) === 0) {
				await api.delete(`orders/${order.id}`, { force: true })
				throw new Error('Order amount is 0')
			}

			try {
				const paypalOrder = await createOrder(order, paymentMethod)
				responseData.id = paypalOrder.id
				responseData.success = true
			} catch (paypalError) {
				// Creazione ordine PayPal fallita: elimina subito l'ordine WC orfano
				// (cleanup affidabile server-side, non dipende dal client).
				await api.delete(`orders/${order.id}`, { force: true }).catch(() => {})
				throw paypalError
			}
			return res.json(responseData)
		}
	} catch (error) {
		console.error(error)
		Sentry.setTag("area", "checkout");
		Sentry.setTag("step", "create_order");
		// Dettaglio errore PayPal (issue/description/debug_id/breakdown), se presente:
		// e' il "motivo esatto" della mancata transazione, utile per diagnosticare i
		// fallimenti sugli ordini grandi (es. mismatch del breakdown importi).
		if (error && typeof error === "object" && "paypal" in error) {
			Sentry.setContext("paypal_error", (error as any).paypal);
		}
		Sentry.setContext("paypal_create", {
			orderPayload,
			body: req.body,
			responseData
		});
		Sentry.captureException(error);
		responseData.success = false
		if (typeof error === "string") {
			responseData.error = error
		} else if (error instanceof Error) {
			responseData.error = error.message
		}
		res.status(500)
	}
	return res.json(responseData)
}

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (order: WooOrder, paymentMethod: string) => {
	const { billing, shipping, line_items, id, total, shipping_lines, shipping_total, discount_total, shipping_tax, discount_tax } = order
	const accessToken = await generateAccessToken();
	const requiredFields = [
		'first_name',
		'last_name',
		'address_1',
		'city',
		'country',
		'postcode'
	] as const;
	const shippingAddress = requiredFields.every(field => shipping[field]) ? shipping : billing;

	const round2 = (n: number) => Number(n.toFixed(2));
	const TOTAL = round2(parseFloat(total));
	const shippingTotal = round2(Number(shipping_total) + Number(shipping_tax));

	// unit_amount arrotondato per unita; item_total = somma(unit*qty) cosi da combaciare
	// col ricalcolo di PayPal ed evitare ITEM_TOTAL_MISMATCH (frequente sugli ordini con
	// quantita multiple, causa dei fallimenti silenziosi). L'importo addebitato NON cambia.
	const items = line_items.map((item) => {
		const unit = round2((Number(item.subtotal) + Number(item.subtotal_tax)) / item.quantity);
		return {
			name: item.name,
			sku: item.sku,
			unit_amount: { currency_code: "EUR", value: unit.toFixed(2) },
			quantity: item.quantity + "",
			lineTotal: round2(unit * item.quantity),
		};
	});
	const itemTotal = round2(items.reduce((sum, i) => sum + i.lineTotal, 0));

	// Bilancia il breakdown all'importo esatto (TOTAL) senza modificarlo: la differenza
	// va in "discount" (totale < item+spedizione) o in "handling" (caso opposto, raro,
	// solo arrotondamento), entrambi >= 0 -> la somma del breakdown e sempre valida.
	const diff = round2(itemTotal + shippingTotal - TOTAL);
	const discountTotal = diff > 0 ? diff : 0;
	const handlingTotal = diff < 0 ? round2(-diff) : 0;

	const payload = {
		intent: "CAPTURE",
		purchase_units: [
			{
				reference_id: id,
				amount: {
					currency_code: "EUR",
					value: TOTAL.toFixed(2),
					breakdown: {
						item_total: {
							currency_code: "EUR",
							value: itemTotal.toFixed(2),
						},
						shipping: {
							currency_code: "EUR",
							value: shippingTotal.toFixed(2),
						},
						discount: {
							currency_code: "EUR",
							value: discountTotal.toFixed(2),
						},
						...(handlingTotal > 0 ? {
							handling: {
								currency_code: "EUR",
								value: handlingTotal.toFixed(2),
							}
						} : {})
					}
				},
				items: items.map(({ lineTotal, ...rest }) => rest),
				shipping: {
					type: shipping_lines[0].method_id === "local_pickup" ? "PICKUP_IN_STORE" : "SHIPPING",
					name: {
						full_name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
					},
					email_address: billing.email,
					address: {
						address_line_1: shippingAddress.address_1,
						address_line_2: shippingAddress.address_2,
						admin_area_2: shippingAddress.city,
						admin_area_1: shippingAddress.state,
						postal_code: shippingAddress.postcode,
						country_code: shippingAddress.country
					}
				}
			},
		],
		...(["PayPal", "PayPal - carta di credito"].includes(paymentMethod) ? {
			payment_source: paymentMethod === "PayPal" ? {
				paypal: {
					experience_context: {
						brand_name: "Bottega di Sguardi",
						shipping_preference: "SET_PROVIDED_ADDRESS",
						user_action: "PAY_NOW"
					}
				}
			} : {
				card: {
					attributes: {
						customer: {
							email_address: billing.email,
						},
						verification: {
							method: "SCA_WHEN_REQUIRED"
						}
					}
				}
			}
		} : {})
	};

	const response = await fetch(`${base}/v2/checkout/orders`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`
		},
		method: "POST",
		body: JSON.stringify(payload),
	});

	const paypalOrder = await response.json();

	// PRIMA non si controllava l'esito: su errore (es. breakdown/importo non valido,
	// frequente sugli ordini grandi) si restituiva il body d'errore con id undefined e
	// l'handler impostava comunque success=true -> il pagamento falliva SENZA errore.
	// Ora lanciamo, esponendo l'issue PayPal (per messaggio utente + diagnosi Sentry).
	if (!response.ok || !paypalOrder?.id) {
		const detail = paypalOrder?.details?.[0];
		const err: any = new Error(detail?.issue ?? paypalOrder?.name ?? 'PAYPAL_ORDER_CREATE_FAILED');
		err.paypal = {
			status: response.status,
			name: paypalOrder?.name,
			issue: detail?.issue,
			description: detail?.description,
			debug_id: paypalOrder?.debug_id,
			breakdown: payload.purchase_units?.[0]?.amount,
		};
		throw err;
	}

	return paypalOrder;
};

/**
 * Riusa l'ordine pending del tentativo precedente quando corrisponde al carrello
 * corrente (stesso totale), altrimenti elimina quello stale e ne crea uno nuovo.
 * Garantisce un solo ordine WooCommerce per sessione di checkout (no pile-up).
 */
const getOrCreateOrder = async (cart: Cart, invoice: any, customerNote: string, customerId: any, paymentMethod: string, wooOrderId?: number | string) => {
	if (wooOrderId) {
		const { data: existing } = await api.get(`orders/${wooOrderId}`).catch(() => ({ data: null }))
		if (existing && existing.status === 'pending') {
			const cartTotal = (Number(cart.totals.total) / 100).toFixed(2)
			if (Number(existing.total).toFixed(2) === cartTotal) {
				return existing // carrello invariato: riusa lo stesso ordine
			}
			// carrello cambiato: elimina lo stale e ricrea, evitando dati obsoleti
			await api.delete(`orders/${wooOrderId}`, { force: true }).catch(() => {})
		}
	}
	const payload = await prepareOrderPayload(cart, invoice, customerNote, customerId, paymentMethod)
	const { data: order } = await api.post("orders", payload)
	return order
}

const prepareOrderPayload = async (cart: Cart, invoice?: any, customerNote?: string, customerId?: string, paymentMethod: string = "PayPal") => {
	const selectedShipping = cart.shipping?.packages.default.rates[cart.shipping.packages.default.chosen_method]
	const isEu = getIsEU(cart.customer)

	return ({
		customer_id: customerId,
		currency: "EUR",
		payment_method: 'ppcp-gateway',
		payment_method_title: paymentMethod,
		billing: mapAddress(cart.customer.billing_address, 'billing'),
		shipping: mapAddress(cart.customer.shipping_address, 'shipping'),
		line_items: await Promise.all(cart.items.map(prepareOrderLineItem(api, isEu))),
		shipping_lines: [
			{
				method_id: selectedShipping?.method_id,
				method_title: selectedShipping?.label,
				total: (Number(selectedShipping?.cost) / 1.22 / 100) + '',
			}
		],
		coupon_lines:  cart.coupons?.[0] ? [{ code: cart.coupons[0].coupon ?? '' }] : [],
		customer_note: customerNote,
		meta_data: invoice ? [
			{ key: '_billing_choice_type', value: invoice.billingChoice ?? "receipt" },
			{ key: '_billing_invoice_type', value: invoice.invoiceType ?? "private" },
			{ key: '_billing_sdi_type', value: invoice.sdi ?? "" },
			{ key: '_billing_vat_number', value: invoice.vat ?? "" },
			{ key: '_billing_tax_code', value: (!invoice.tax || invoice.tax === "") ?
					(cart.customer.billing_address.billing_country === 'IT' ?
						"" :
						`${cart.customer.billing_address.billing_first_name}${cart.customer.billing_address.billing_last_name}`.slice(0,11).toUpperCase().padEnd(11, '0')) :
					invoice.tax
			},
		] : []
	})
}

const mapAddress = (address: any, type: 'billing' | 'shipping') =>
	Object.fromEntries(Object.entries(address).map(([key, value]) => [key.replace(`${type}_`, ''), value]))

const prepareOrderLineItem = (api: any, isEu: boolean) => async (item: Item) => {
	const {data: product} = await api.get("products/" + item.id)
	const itemPrice = isEu ?
		getProductEuPrice(product) :
		product.price
	const total = ((Number(itemPrice) * item.quantity.value) / 1.22) + ''
	return {
		product_id: item.meta.product_type === 'variation' ? item.meta.variation.parent_id : item.id,
		variation_id: item.meta.product_type === 'variation' ? item.id : undefined,
		quantity: item.quantity.value,
		total,
	}
}

const getProductEuPrice = (product: {meta_data: {key: string, value: string}[], price: string}) => {
	let euPrice = product.price
	const hasEuPrice = product.meta_data.find((m: {
		key: string,
		value: string
	}) => m.key === '_europa_price_method')?.value === 'manual'
	if (hasEuPrice) {
		euPrice = product.meta_data.find((m: { key: string, value: string }) => m.key === '_europa_price')?.value ?? product.price
	}
	return euPrice
}

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Cache del token a livello di processo. L'access token PayPal vale ~9h: rigenerarlo
// a ogni creazione ordine moltiplica le chiamate all'endpoint OAuth e, sommato al
// cluster PM2 (instances:'max') e ai retry sui fallimenti, ha fatto flaggare l'IP del
// server da PayPal/Cloudflare (429 Too Many Requests -> token vuoto -> 401 sulla create
// order -> PAYPAL_ORDER_CREATE_FAILED). Riusare il token finche' valido azzera quasi del
// tutto le chiamate OAuth. Cache per-worker (sufficiente; uno shared store non serve).
let cachedToken: { value: string; expiresAt: number } | null = null;

export const generateAccessToken = async () => {
	if (!base) {
		throw new Error("MISSING_PAYPAL_API_URL");
	}
	if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
		throw new Error("MISSING_API_CREDENTIALS");
	}

	// Riusa il token in cache (margine 60s) prima di ricontattare l'OAuth.
	if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
		return cachedToken.value;
	}

	const auth = Buffer.from(
		PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
	).toString("base64");

	// PRIMA: su errore si faceva solo console.error e si ritornava undefined -> la
	// create order partiva con "Bearer undefined" e PayPal rispondeva con un body privo
	// di name/details, finendo nel fallback generico PAYPAL_ORDER_CREATE_FAILED.
	// ORA: ritentiamo solo i transitori di rete e i 5xx (OAuth client_credentials e'
	// idempotente -> zero rischio doppi addebiti). I 4xx di autenticazione e il 429
	// (rate-limit) NON sono ritentati: ritentare amplificherebbe il throttle dell'IP;
	// si fallisce subito esponendo l'errore reale a Sentry e al messaggio utente.
	const MAX_ATTEMPTS = 3;
	let lastErr: any;
	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
		let response: Response;
		let raw: string;
		try {
			response = await fetch(`${base}/v1/oauth2/token`, {
				method: "POST",
				body: "grant_type=client_credentials",
				headers: {
					Authorization: `Basic ${auth}`,
				},
			});
			// Leggiamo il body come TESTO e poi parsiamo: quando l'IP e' rate-limitato,
			// Cloudflare risponde con una PAGINA HTML ("<!doctype html>..."), non JSON.
			// Un response.json() diretto lanciava SyntaxError "Unexpected token '<'" che
			// veniva scambiato per errore di rete e ritentato (amplificando il throttle).
			raw = await response.text();
		} catch (networkErr) {
			// fetch/lettura body fallita = errore di rete transitorio: ritenta.
			lastErr = networkErr;
			if (attempt === MAX_ATTEMPTS) throw networkErr;
			await sleep(300 * attempt);
			continue;
		}

		let data: any = null;
		try { data = raw ? JSON.parse(raw) : null; } catch { /* body non-JSON (es. HTML di Cloudflare) */ }

		if (response.ok && data?.access_token) {
			cachedToken = {
				value: data.access_token,
				expiresAt: Date.now() + (Number(data.expires_in) || 3000) * 1000,
			};
			return data.access_token;
		}

		const reason = data?.error_description ?? data?.error
			?? (response.status === 429 ? "PAYPAL_RATE_LIMITED" : "PAYPAL_AUTH_FAILED");
		const err: any = new Error(reason);
		err.paypal = {
			status: response.status,
			error: data?.error,
			error_description: data?.error_description,
			// se il body non era JSON (HTML di blocco) ne salviamo un estratto per la diagnosi
			bodySnippet: data ? undefined : raw.slice(0, 120),
		};
		// Solo i 5xx sono transitori e si ritentano. 4xx (auth) e 429 (rate-limit):
		// fallisci subito col motivo reale, senza aggiungere carico all'endpoint.
		if (response.status < 500 || attempt === MAX_ATTEMPTS) throw err;
		lastErr = err;
		await sleep(300 * attempt);
	}
	throw lastErr ?? new Error("PAYPAL_AUTH_FAILED");
};