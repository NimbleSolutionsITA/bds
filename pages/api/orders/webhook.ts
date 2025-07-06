import type { NextApiRequest, NextApiResponse } from 'next';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { WORDPRESS_SITE_URL } from "../../../src/utils/endpoints";
import axios from "axios";

const base = process.env.PAYPAL_API_URL;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

const api = new WooCommerceRestApi({
    url: WORDPRESS_SITE_URL ?? '',
    consumerKey: process.env.WC_CONSUMER_KEY ?? '',
    consumerSecret: process.env.WC_CONSUMER_SECRET ?? '',
    version: "wc/v3"
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("req", req.body);
    if (req.method !== 'POST') return res.status(405).end();

    const body = req.body;

    try {
        const isValid = await verifySignature(req, body);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const event = body.event_type;
        const resource = body.resource;

        switch (event) {
            case 'PAYMENT.CAPTURE.COMPLETED':
            case 'PAYMENT.CAPTURE.DECLINED':
            case 'PAYMENT.CAPTURE.DENIED':
            case 'PAYMENT.CAPTURE.REFUNDED':
            case 'PAYMENT.CAPTURE.PENDING': {
                const { status, supplementary_data, status_details } = resource;
                const paypalOrderId = supplementary_data?.related_ids?.order_id

                if (!paypalOrderId) {
                    console.warn('⚠️ Missing paypal order id in webhook');
                    break;
                }
                const paypalOrder = await getOrder(paypalOrderId)
                const wooOrderId = paypalOrder.purchase_units?.[0]?.reference_id;

                if (!wooOrderId) {
                    console.warn('⚠️ Missing reference_id in paypal order');
                    break;
                }

                console.log('paypalOrderId', paypalOrderId);
                console.log('wooOrderId', wooOrderId);

                if (event === 'PAYMENT.CAPTURE.REFUNDED') {
                    await api.put(`orders/${wooOrderId}`, { status: 'refunded' })
                    break
                }

                const orderPayload = {
                    transaction_id: paypalOrderId,
                    payment_data: [
                        { key: "ppcp_paypal_order_id", value: paypalOrderId },
                        { key: "ppcp_billing_token", value: "" },
                        { key: "wc-ppcp-new-payment-method", value: false }
                    ]
                }

                if (status === 'COMPLETED') {
                    await api.put(`orders/${wooOrderId}`, {
                        ...orderPayload,
                        set_paid: true
                    })
                } else if (status === 'DECLINED') {
                    await api.put(`orders/${wooOrderId}`, {
                        ...orderPayload,
                        status: 'failed',
                        note: status
                    })
                } else if (status === 'PENDING') {
                    await api.put(`orders/${wooOrderId}`, {
                        ...orderPayload,
                        status: 'on-hold',
                        note: status_details?.reason
                    })
                }
                break
            }
            default:
                console.log(`Unhandled event: ${event}`);
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error('Error processing webhook:', err);
        res.status(500).json({ error: 'Internal error' });
    }
}

const getOrder = async (id: string) => {
    const accessToken = await generateAccessToken();

    const response = await fetch(`${base}/v2/checkout/orders/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to capture order: ${response.statusText}`);
    }

    return await response.json();
};


async function verifySignature(req: NextApiRequest, body: any): Promise<boolean> {
    const token = await generateAccessToken();
    const verificationBody = {
        auth_algo: req.headers['paypal-auth-algo'],
        cert_url: req.headers['paypal-cert-url'],
        transmission_id: req.headers['paypal-transmission-id'],
        transmission_sig: req.headers['paypal-transmission-sig'],
        transmission_time: req.headers['paypal-transmission-time'],
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: body,
    }

    const { data } = await axios.post(
        `${base}/v1/notifications/verify-webhook-signature`,
        verificationBody,
        { headers: {
            ContentType: "application/json",
            Authorization: `Bearer ${token}`
        } }
    );

    return data.verification_status === 'SUCCESS';
}

export const generateAccessToken = async () => {
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
