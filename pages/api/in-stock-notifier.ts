import { NextApiRequest, NextApiResponse } from "next";
import { WORDPRESS_IN_STOCK_NOTIFIER_ENDPOINT } from "../../src/utils/endpoints";


const woo_key = process.env.WC_CONSUMER_KEY ?? "";
const woo_secret = process.env.WC_CONSUMER_SECRET ?? '';
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{code: string, message: string, data: {status: string}}>
) {
	let headers = new Headers();
	headers.set("Authorization", "Basic " + Buffer.from(woo_key + ":" + woo_secret).toString("base64"));
	headers.set("Content-Type", "application/json");

	const response = await fetch(WORDPRESS_IN_STOCK_NOTIFIER_ENDPOINT, {
		method: "POST",
		headers,
		body: JSON.stringify({
			product_id: req.query.product_id,
			variation_id: req.query.variation_id,
			subscriber_name: req.query.subscriber_name,
			email: req.query.email,
			status: "cwg_subscribed",
		}),
	}).then(response => response.json())
		.then(result =>result);

	const status = response.data?.status ? Number(response.data.status) : 200

	res.status(status).json(response);

	return res;
}
