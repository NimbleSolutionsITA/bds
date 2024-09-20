import type { NextApiRequest, NextApiResponse } from 'next'

const base = process.env.PAYPAL_API_URL;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET

export type CreateOrderResponse = {
	success: boolean
	paypalOrderId?: string
	error?: string
	order?: any
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateOrderResponse>
) {
	const responseData: CreateOrderResponse = {
		success: false,
	}
	try {
		if (req.method === 'POST') {
			const { jsonResponse, httpStatusCode } = await generateClientToken();
			res.status(httpStatusCode).json(jsonResponse);
		}
	} catch (error) {
		console.error(error)
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
 * Generate a client token for rendering the hosted card fields.
 * @see https://developer.paypal.com/docs/checkout/advanced/integrate/#link-integratebackend
 */
const generateClientToken = async () => {
	const accessToken = await generateAccessToken();
	const url = `${base}/v1/identity/generate-token`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Accept-Language": "en_US",
			"Content-Type": "application/json",
		},
	});

	return handleResponse(response);
};

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
	try {
		if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
			throw new Error("MISSING_API_CREDENTIALS");
		}
		const auth = Buffer.from(
			PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
		).toString("base64");
		const response = await fetch(`${base}/v1/oauth2/token`, {
			method: "POST",
			body: "grant_type=client_credentials",
			headers: {
				Authorization: `Basic ${auth}`,
			},
		});

		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error("Failed to generate Access Token:", error);
	}
};

async function handleResponse(response: Response) {
	try {
		const jsonResponse = await response.json();
		return {
			jsonResponse,
			httpStatusCode: response.status,
		};
	} catch (err) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}
}