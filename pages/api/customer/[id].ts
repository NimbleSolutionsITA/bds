import type { NextApiRequest, NextApiResponse } from 'next'
import { wooApi as api } from "../../../src/utils/woocommerce";

export type CreateOrderResponse = {
	success: boolean
	customer?: any
	error?: string
}


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CreateOrderResponse>
) {
	const responseData: CreateOrderResponse = {
		success: false,
	}
	if (req.method === 'GET') {
		try {
			const id = req.query.id as string;
			const {data} = await api.get(`customers/${id}`)

			responseData.success = true
			responseData.customer = data
		}
		catch ( error ) {
			if (typeof error === "string") {
				responseData.error = error
			} else if (error instanceof Error) {
				responseData.error = error.message
			}
			res.status(500)
		}
		return res.json(responseData)
	}
	if (req.method === 'PUT') {
		try {
			const id = req.query.id as string;
			const {data} = await api.put(`customers/${id}`, req.body)

			responseData.success = true
			responseData.customer = data
		}
		catch ( error ) {
			if (typeof error === "string") {
				responseData.error = error
			} else if (error instanceof Error) {
				responseData.error = error.message
			}
			const errorData = error as any
			if (errorData?.response?.data?.message) {
				responseData.error = errorData.response.data.message
			}
			res.status(500)
		}
		return res.json(responseData)
	}
}