import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAccessToken } from "../index";
import { wooApi } from "../../../../src/utils/woocommerce";
import * as Sentry from "@sentry/nextjs";

const base = process.env.PAYPAL_API_URL;

export type CreateOrderResponse = {
	success: boolean;
	error?: string;
	status?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateOrderResponse>
) {
	const responseData: CreateOrderResponse = {
		success: false,
	};

	try {
		if (req.method === 'POST') {
			const paypalOrderId = req.query.id as string;
			if (!paypalOrderId) throw new Error('Paypal Order ID is missing');

			const { ok, data: captureData } = await captureOrder(paypalOrderId);
			const purchaseUnit = captureData?.purchase_units?.[0];
			const capture = purchaseUnit?.payments?.captures?.[0];
			const wooOrderId = purchaseUnit?.reference_id;
			const status = capture?.status;

			responseData.success = ok && status === 'COMPLETED';
			responseData.status = status;

			if (responseData.success && wooOrderId) {
				// COMPLETED: marca subito l'ordine come pagato (oltre al webhook PayPal,
				// che resta come fallback). Idempotente: WooCommerce ignora set_paid se
				// gia pagato. In try/catch separato per non far fallire la conferma al
				// cliente: il pagamento e gia avvenuto, un errore qui non deve dare 500.
				try {
					await wooApi.put(`orders/${wooOrderId}`, {
						transaction_id: capture.id,
						set_paid: true,
					});
				} catch (updateError) {
					Sentry.setTag("area", "checkout");
					Sentry.setTag("step", "capture_mark_paid");
					Sentry.setContext("paypal_capture", { paypalOrderId, wooOrderId });
					Sentry.captureException(updateError);
				}
			} else if (status === 'PENDING' && wooOrderId) {
				// REVIEW: PayPal ha accettato ma il pagamento e in revisione. NON e un
				// fallimento: l'ordine va in 'on-hold' (mai eliminato) e si attende l'esito
				// dal webhook (COMPLETED -> paid, DENIED -> failed). Il client mostra la
				// pagina "pagamento in attesa".
				responseData.status = 'PENDING';
				try {
					await wooApi.put(`orders/${wooOrderId}`, {
						transaction_id: capture?.id,
						status: 'on-hold',
					});
				} catch (updateError) {
					Sentry.setTag("area", "checkout");
					Sentry.setTag("step", "capture_on_hold");
					Sentry.setContext("paypal_capture", { paypalOrderId, wooOrderId });
					Sentry.captureException(updateError);
				}
			} else {
				// FALLIMENTO (declino/errore): restituiamo il codice issue PayPal (es.
				// INSTRUMENT_DECLINED) per il messaggio utente, ed eliminiamo l'ordine WC
				// se ancora pending (scelta: elimina sempre i tentativi falliti).
				responseData.error = captureData?.details?.[0]?.issue
					?? status
					?? captureData?.name
					?? 'PAYMENT_FAILED';

				if (wooOrderId) {
					try {
						const { data: order } = await wooApi.get(`orders/${wooOrderId}`);
						if (order?.status === 'pending') {
							await wooApi.delete(`orders/${wooOrderId}`, { force: true });
						}
					} catch (cleanupError) {
						Sentry.captureException(cleanupError);
					}
				}

				Sentry.setTag("area", "checkout");
				Sentry.setTag("step", "capture_order");
				Sentry.setContext("paypal_capture", {
					paypalOrderId,
					captureData,
					responseData
				});
				Sentry.captureException(new Error(`Capture failed: ${responseData.error}`));
			}
		}
	} catch (error) {
		console.error(error);
		Sentry.setTag("area", "checkout");
		Sentry.setTag("step", "capture_order");
		Sentry.setContext("paypal_capture", {
			paypalOrderId: req.query.id,
			responseData
		});
		Sentry.captureException(error);

		responseData.success = false;
		responseData.error = error instanceof Error ? error.message : String(error);
		res.status(500);
	}

	return res.json(responseData);
}

const captureOrder = async (orderID: string) => {
	const accessToken = await generateAccessToken();

	const response = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`
		},
	});

	// Anche in caso di errore (es. carta rifiutata -> 422) il body contiene
	// l'issue PayPal (es. INSTRUMENT_DECLINED): lo restituiamo invece di perderlo.
	const data = await response.json().catch(() => ({}));
	return { ok: response.ok, data };
};
