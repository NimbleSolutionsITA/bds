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
import useAuth from "../utils/useAuth";
import PaymentErrorDialog from "../pages/checkout/PaymentErrorDialog";
import {useMutation} from "@tanstack/react-query";

interface PayPalProviderProps {
	children: React.ReactNode | React.ReactNode[];
	shipping: ShippingData
}


const PayPalCheckoutContext = createContext({
	createOrder: async () => { return ""},
	onApprove: async (data: OnApproveData) => {},
	setError: (error: string) => {},
	shipping: {} as ShippingData,
	isPaying: false,
	setIsPaying: (isPaying: boolean) => {},
});

export const PayPalCheckoutProvider = ({children, shipping}: PayPalProviderProps) => {
	const [error, setError] = useState<string>();
	const [isPaying, setIsPaying] = useState(false);
	const { user } = useAuth();
	const { cart } = useSelector((state: RootState) => state.cart);
	const { watch } = useFormContext()
	const { invoice, customerNote, billing, shipping: shippingForm } = watch()
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>()

	const createOrder = useMutation({
		mutationFn: async () => {
			setIsPaying(true);
			try {
				const response = await fetch("/api/orders", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ cart, customerNote, invoice, customerId: user?.user_id }),
				});

				const orderData = await response.json();
				if (!orderData.success) {
					throw new Error(orderData.error);
				}
				return orderData.id;
			} catch (error: any) {
				setError(error.message);
			}
		},
		onSuccess: (data) => {
			console.log(data)
		}
	})

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

				await fetch(`/api/orders/${wooOrder.id}/abort`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ isFailed: true }),
				});

				throw new Error(errorMessage);
			}
			dispatch(destroyCart());
			gtagPurchase(wooOrder);
			await router.push("/checkout/completed");
		} catch (error: any) {
			setError(error.message);
		}
	}
	function onError(error:  Record<string, any>) {
		setError(error.message);
	}
	return (
		<PayPalCardFieldsProvider
			createOrder={createOrder.mutateAsync}
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
			<PayPalCheckoutContext.Provider value={{createOrder: createOrder.mutateAsync, onApprove, setError, shipping, isPaying, setIsPaying}}>
				{children}
			</PayPalCheckoutContext.Provider>
			<PaymentErrorDialog setError={(value) => {
				setIsPaying(false)
				setError(value)
			}} error={error} />
		</PayPalCardFieldsProvider>
	)
}

const usePayPalCheckout = () => useContext(PayPalCheckoutContext);

export default usePayPalCheckout;