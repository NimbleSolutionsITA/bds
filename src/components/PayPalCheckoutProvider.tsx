import React, {createContext, useContext, useState} from "react";
import {OnApproveData, PayPalCardFieldsStyleOptions} from "@paypal/paypal-js";
import {PayPalCardFieldsProvider} from "@paypal/react-paypal-js";
import {ShippingData} from "../redux/layoutSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {useFormContext} from "react-hook-form";
import {gtagPurchase} from "../utils/utils";
import {useRouter} from "next/router";
import {destroyCart} from "../redux/cartSlice";

interface PayPalProviderProps {
	children: React.ReactNode | React.ReactNode[];
	shipping: ShippingData
}


const PayPalCheckoutContext = createContext({
	createOrder: async () => { return ""},
	onApprove: async (data: OnApproveData) => {},
	onError: (error: any) => {},
	shipping: {} as ShippingData,
	setIsPaying: (isPaying: boolean) => {},
	isPaying: false
});

export const PayPalCheckoutProvider = ({children, shipping}: PayPalProviderProps) => {
	const [isPaying, setIsPaying] = useState(false);
	const { cart } = useSelector((state: RootState) => state.cart);
	const { watch } = useFormContext()
	const { invoice, customerNote } = watch()
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>()

	async function createOrder() {
		try {
			console.log("Creating order", cart, customerNote, invoice);
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ cart, customerNote, invoice }),
			});

			const orderData = await response.json();
			if (!orderData.success) {
				throw new Error(orderData.error);
			}
			return orderData.id;
		} catch (error) {
			console.error(error);
		}
	}
	async function onApprove(data: OnApproveData) {
		try {
			const response = await fetch(`/api/orders/${data.orderID}/capture`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const orderData = await response.json();
			if (!orderData.success) {
				throw new Error(orderData.error);
			}
			const { wooOrder, payPalOrder } = orderData;
			// Three cases to handle:
			//   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
			//   (2) Other non-recoverable errors -> Show a failure message
			//   (3) Successful transaction -> Show confirmation or thank you message

			const transaction =
				payPalOrder?.purchase_units?.[0]?.payments?.captures?.[0] ||
				payPalOrder?.purchase_units?.[0]?.payments?.authorizations?.[0];
			const errorDetail = payPalOrder?.details?.[0];

			if (errorDetail || !transaction || transaction.status === "DECLINED") {
				// (2) Other non-recoverable errors -> Show a failure message
				let errorMessage;
				if (transaction) {
					errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
				} else if (errorDetail) {
					errorMessage = `${errorDetail.description} (${payPalOrder.debug_id})`;
				} else {
					errorMessage = JSON.stringify(payPalOrder);
				}

				throw new Error(errorMessage);
			}
			dispatch(destroyCart());
			gtagPurchase(wooOrder);
			await router.push("/completed");
		} catch (error) {
			console.error(error);
		}
	}
	function onError(error: any) {
		console.error(error);
	}
	return (
		<PayPalCardFieldsProvider
			createOrder={createOrder}
			onApprove={onApprove}
			onError={onError}
			style={{
				'input': {
					'font-size': '14px',
					'font-family': 'Apercu, sans-serif',
					'font-weight': "300",
					'padding': '16.5px 14px',
					'border-radius': '0',
					'border': '1px solid rgba(0, 0, 0, 0.23)',
				},
				":focus": {
					"box-shadow": "none",
					'border': '2px solid #000',
					'padding': '15.5px 13px',
				},
				"input:hover": {
					'border': '2px solid #000',
					'padding': '15.5px 13px',
				},
				"input.invalid:hover": {
					'border': '1px solid #d9360b',
					'padding': '16.5px 14px',
				},
			} as Record<string, PayPalCardFieldsStyleOptions>}
		>
			<PayPalCheckoutContext.Provider value={{createOrder, onApprove, onError, shipping, isPaying, setIsPaying}}>
				{children}
			</PayPalCheckoutContext.Provider>
		</PayPalCardFieldsProvider>
	)
}

const usePayPalCheckout = () => useContext(PayPalCheckoutContext);

export default usePayPalCheckout;