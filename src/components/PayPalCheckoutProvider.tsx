import React, {createContext, useContext, useEffect, useRef, useState} from "react";
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
import {useTranslation} from "next-i18next";
import {getPaymentErrorMessage} from "../utils/paymentErrors";

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
	// Id dell'ordine WC del tentativo corrente: passato al server per riusarlo sui
	// retry (no pile-up) e per il cleanup affidabile in caso di annullamento.
	const wooOrderIdRef = useRef<number | undefined>(undefined);
	const { user } = useAuth();
	const { cart, customerNote } = useSelector((state: RootState) => state.cart);
	const { watch } = useFormContext()
	const { invoice } = watch()
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>()
	const { t } = useTranslation('common')

	const createOrder = useMutation({
		mutationFn: async (paymentMethod: string) => {
			setIsPaying(true);
			try {
				const response = await fetch("/api/orders", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					// wooOrderId: riusa l'ordine pending del tentativo precedente (server-side)
					body: JSON.stringify({ cart, customerNote, invoice, customerId: user?.user_id, paymentMethod, wooOrderId: wooOrderIdRef.current }),
				});
				const orderData = await response.json();
				if (orderData.wooOrder?.id) {
					wooOrderIdRef.current = orderData.wooOrder.id;
				}
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
				wooOrderIdRef.current = undefined; // ordine finalizzato (pagato)
				dispatch(destroyCart());
				setCompleted({})
				await router.push("/checkout/completed");
			} else {
				if (status === "PENDING") {
					// Pagamento in revisione: l'ordine resta (on-hold lato server), non va
					// ripulito. Mostriamo la pagina "in attesa".
					wooOrderIdRef.current = undefined;
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
			// Cleanup affidabile dell'ordine pending non finalizzato (annullamento o
			// fallimento). L'abort elimina solo ordini 'pending' (idempotente), quindi
			// e sicuro anche se il server lo ha gia ripulito.
			if (wooOrderIdRef.current) {
				await fetch(`/api/orders/${wooOrderIdRef.current}/abort`, {
					method: "PUT",
				}).catch(() => {});
				wooOrderIdRef.current = undefined;
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
			setError(getPaymentErrorMessage(error, t));
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