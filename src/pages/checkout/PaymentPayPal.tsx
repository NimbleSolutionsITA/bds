import React from "react";
import {PayPalButtons} from "@paypal/react-paypal-js";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {OnApproveData} from "@paypal/paypal-js";
import {gtagPurchase} from "../../utils/utils";
import {useRouter} from "next/router";

const PaymentPayPal = () => {
	const { customer, customerNote, cart } = useSelector((state: RootState) => state.cart);
	const router = useRouter();
	const payWithPayPal = async () => {
		try {
			const order = await fetch('/api/order/paypal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					cart,
					customer,
					customerNote,
				})
			}).then((r) => r.json())
			if (order.error) {
				throw new Error(order.error);
			}
			if (!order.success || !order.paypalOrderId) {
				throw new Error('Order creation failed')
			}
			return order.paypalOrderId
		}
		catch (error) {
			console.error(error);
		}
	}

	const onPayPalApprove = async (data: OnApproveData) => {
		try {
			const response = await fetch(`/api/order/paypal`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					paypalOrderId: data.orderID
				}),
			});

			const orderData = await response.json();

			if (orderData.success) {
				gtagPurchase(orderData.order)
				await router.push({
					pathname: '/checkout/completed',
					query: {
						paid: true,
						email: customer?.billing?.email
					}
				});
			} else {
				throw new Error(orderData.error);
			}

		} catch (error) {
			console.log(error)
		}
	}

	const onPayPalError = async (err: any) => {
		console.log('onPayPalError', err)
		console.log(err.message ?? 'Paypal payment error')
	}

	const onPayPalCancel = async (data: any) => {
		if (data.orderID) {
			await fetch(`/api/order/paypal`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					paypalOrderId: data.orderID
				}),
			});
		}
	}

	return (
		<div style={{padding: '20px'}}>
			<PayPalButtons
				createOrder={payWithPayPal}
				onApprove={onPayPalApprove}
				onError={onPayPalError}
				onCancel={onPayPalCancel}
			/>
		</div>
	)
}

export default PaymentPayPal