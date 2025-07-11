import React, {createContext, useContext, useEffect, useState} from "react";
import {OnApproveActions, OnApproveData, PayPalCardFieldsStyleOptions} from "@paypal/paypal-js";
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
import * as Sentry from "@sentry/nextjs";
import {WooOrder} from "../types/woocommerce";

interface PayPalProviderProps {
	children: React.ReactNode | React.ReactNode[];
	shipping: ShippingData
}


const PayPalCheckoutContext = createContext({
	createOrder: async () => { return ""},
	onApprove: async (data: OnApproveData) => {},
	onError: (data: {error: any, step?: string}) => {},
	shipping: {} as ShippingData,
	isPaying: false,
	setIsPaying: (isPaying: boolean) => {},
});

export const PayPalCheckoutProvider = ({children, shipping}: PayPalProviderProps) => {
	const [error, setError] = useState<string>();
	const [wooOrder, setWooOrder] = useState<WooOrder>();
	const [isPaying, setIsPaying] = useState(false);
	const [completed, setCompleted] = useState<{query?: {pending: boolean}}>();
	const { user } = useAuth();
	const { cart, customerNote } = useSelector((state: RootState) => state.cart);
	const { watch } = useFormContext()
	const { invoice } = watch()
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>()

	const createOrder = useMutation({
		mutationFn: async (paymentMethod: string) => {
			setWooOrder(undefined);
			setIsPaying(true);
			try {
				const response = await fetch("/api/orders", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ cart, customerNote, invoice, customerId: user?.user_id, paymentMethod }),
				});
				const orderData = await response.json();
				if (!orderData.success) {
					throw new Error(orderData.error);
				}
				setWooOrder(orderData.wooOrder);
				return orderData.id;
			} catch (error: any) {
				await onError({error, step: 'createOrder'});
			}
		}
	})

	async function onApprove(data: OnApproveData, actions?: OnApproveActions) {
		try {
			const response = await fetch(`/api/orders/${data.orderID}/capture`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				await onError({error: new Error(`Server error: ${response.statusText}`), step: 'onApprove'});
			}

			const { status, success, error = null } = await response.json();
			if (success) {
				if (wooOrder) {
					gtagPurchase(wooOrder);
				}
				dispatch(destroyCart());
				setCompleted({})
				await router.push("/checkout/completed");
			} else {
				if (status === "PENDING") {
					dispatch(destroyCart());
					setCompleted({query: {
							pending: true
						}})
				} else {
					await onError({ error: new Error(error ?? "An error occurred"), step: 'onApprove' });
				}
			}
		} catch (error: any) {
			await onError({error, step: 'onApprove'});
		}
	}

	const {mutateAsync: onError} = useMutation({
		mutationFn: async ({error, step}: { error: Record<string, any>, step?: string })=> {
			if (wooOrder && step === 'createOrder') {
				await fetch(`/api/orders/${wooOrder.id}/abort`, {
					method: "PUT",
				});
			}
			Sentry.setTag("area", "checkout");
			if (step) {
				Sentry.setTag('step', step);
			}
			Sentry.setContext("checkout", {
				orderId: wooOrder?.id,
				user: user?.user_id,
				cart,
				customerNote,
				invoice,
			});
			Sentry.captureException(error);
			setWooOrder(undefined);
			setError(error.message ?? error.details?.[0]?.description ?? "An error occurred");
		}
	})

	const createCardOrder = async () => await createOrder.mutateAsync('PayPal - carta di credito')
	const createPayPalOrder = async () => await createOrder.mutateAsync('PayPal')
	const onCardError = (error: Record<string, any>) => onError({error, step: 'onCardError'});

	useEffect(() => {
		if (completed) {
			router.push({
				pathname: "/checkout/completed",
				...completed
			});
		}
	}, [completed, router]);

	return (
		<PayPalCardFieldsProvider
			createOrder={createCardOrder}
			onApprove={onApprove}
			onError={onCardError}
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
			<PayPalCheckoutContext.Provider value={{createOrder: createPayPalOrder, onApprove, onError, shipping, isPaying, setIsPaying}}>
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