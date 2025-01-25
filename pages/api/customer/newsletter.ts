import { NextApiRequest, NextApiResponse } from 'next';
import md5 from 'md5';

const apiKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.MAILCHIMP_LIST_ID;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		// Check subscription status
		const { email } = req.query;

		if (!email || typeof email !== 'string') {
			return res.status(400).json({ error: 'Email address is required' });
		}

		const subscriberHash = md5(email.toLowerCase());
		const url = `https://us5.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Basic ${Buffer.from(`user:${apiKey}`).toString('base64')}`,
				},
			});

			if (response.status === 200) {
				const subscriberInfo = await response.json();
				return res.status(200).json({ subscribed: true, subscriberInfo, error: null });
			} else if ([401, 404].includes(response.status)) {
				return res.status(200).json({ subscribed: false, error: "unauthorized" });
			} else {
				const data = await response.json();
				return res.status(response.status).json({ subscribed: false, error: data });
			}
		} catch (error) {
			return res.status(500).json({ subscribed: false, error: (error as Error).message || 'Internal Server Error' });
		}
	} else if (req.method === 'DELETE') {
		// Unsubscribe email address
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ error: 'Email address is required' });
		}

		const subscriberHash = md5(email.toLowerCase());
		const url = `https://us5.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;

		try {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Basic ${Buffer.from(`user:${apiKey}`).toString('base64')}`,
				},
			});

			if (response.status === 204) {
				return res.status(200).json({ success: true });
			} else {
				const data = await response.json();
				return res.status(response.status).json({ error: data });
			}
		} catch (error) {
			return res.status(500).json({ error: (error as Error).message || 'Internal Server Error' });
		}
	} else {
		return res.status(405).json({error: 'Method Not Allowed', allowedMethods: ['GET', 'DELETE']});
	}
}
