import type { NextApiRequest, NextApiResponse } from 'next'
import { wooApi as api } from "../../../../src/utils/woocommerce";

export type CreateOrderResponse = {
	success: boolean
	error?: string
}


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateOrderResponse>
) {
	const responseData: CreateOrderResponse = {
		success: false,
	}
	try {
		if (req.method === 'PUT') {
			const {data: order} = await api.get(`orders/${req.query.id}`)
			if (order.status === "pending") {
				if (req.body.isFailed) {
					await api.put(`orders/${req.query.id}`, {
						status: 'failed'
					})
				} else {
					await api.delete(`orders/${req.query.id}`)
				}
			}
		} else {
			throw new Error('Method not allowed')
		}
	} catch (error) {
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