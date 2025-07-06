import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAccessToken } from "../index";
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

			const captureData = await captureOrder(paypalOrderId);
			const purchaseUnit = captureData?.purchase_units?.[0];
			const capture = purchaseUnit?.payments?.captures?.[0];
			const wooOrderId = purchaseUnit?.reference_id;

			if (wooOrderId) {
				responseData.success = capture?.status === 'COMPLETED';
				responseData.status = capture?.status;
			} else {
				responseData.error = 'Reference ID (WooCommerce Order ID) not found in PayPal response.';
			}

			if (!responseData.success) {
				responseData.error = captureData.details?.[0]?.description ?? (capture ?
					`Transaction ${capture.status}: ${capture.id}` :
					'Payment capture was not successful.');

				Sentry.setTag("area", "checkout");
				Sentry.setTag("step", "capture_order");
				Sentry.setContext("paypal_capture", {
					paypalOrderId,
					responseData
				});
				Sentry.captureException(responseData.error);
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

	if (!response.ok) {
		throw new Error(`Failed to capture order: ${response.statusText}`);
	}

	return await response.json();
};
