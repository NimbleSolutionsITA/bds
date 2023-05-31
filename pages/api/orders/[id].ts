// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {WooOrder} from "../../../src/types/woocommerce";


type Data = {
  success: boolean
  error?: string
  order?: WooOrder
}

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3"
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
  const responseData: Data = {
    success: false,
  }
  // const data = req.body
  const endpoint = `orders/${req.query.id}`
  let resp;
  try {
    switch (req.method) {
      case 'PUT':
        resp = await api.post(
            endpoint,
            req.body
        )
        break;
      case 'DELETE':
        resp = await api.delete(endpoint)
        break;
    }
    responseData.order = resp.data
    responseData.success = true
  } catch (error) {
    responseData.success = false
    // @ts-ignore
    responseData.error = error.response.data.message ?? error.message ?? 'bad request'
    // @ts-ignore
    res.status(error.response.data.data.status ?? 500)
  }
  return res.json(responseData)
}