import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {PayPalWithGooglePay} from "./PayPalProvider";
import PaymentAuthorizationResult = google.payments.api.PaymentAuthorizationResult;
import PaymentData = google.payments.api.PaymentData;
import {callCart, PaymentButtonProps} from "./AppleGooglePayButtons";
import TransactionInfo = google.payments.api.TransactionInfo;
import IntermediatePaymentData = google.payments.api.IntermediatePaymentData;
import {Cart, Package} from "../types/cart-type";
import {CartState, destroyCart} from "../redux/cartSlice";
import {Country} from "../types/woocommerce";
import PaymentDataRequestUpdate = google.payments.api.PaymentDataRequestUpdate;
import CallbackIntent = google.payments.api.CallbackIntent;
import {useRouter} from "next/router";
import {gtagPurchase} from "../utils/utils";

const GooglePayButton = ({cart, shipping, invoice, customerNote, askForShipping}: PaymentButtonProps) => {
	const { googlePayConfig } = useSelector((state: RootState) => state.cart);
	const [paymentsClient, setPaymentsClient] = useState<google.payments.api.PaymentsClient>();
	const paypal = window.paypal as PayPalWithGooglePay;
	const cartKey = cart.cart_key;
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	const processPayment = async (paymentData: PaymentData) =>{
		try {
			if (!paypal.Googlepay) {
				throw new Error("Google Pay not available");
			}
			const googlePay = new paypal.Googlepay();
			/* Create Order */
			const {id} = await fetch(`/orders`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ cart, invoice, customerNote }),
			}).then((res) => res.json());
			const {status} = await googlePay.confirmOrder({
				orderId: id,
				paymentMethodData: paymentData.paymentMethodData,
			});
			if (status === "APPROVED") {
				/* Capture the Order */
				const {wooOrder, payPalOrder} = await fetch(`/orders/${id}/capture`, {
					method: "POST",
				}).then((res) => res.json());

				if (payPalOrder.status === "COMPLETED") {
					gtagPurchase(wooOrder);
					if (!askForShipping) {
						dispatch(destroyCart());
						router.push('/success')
					}
				}
				return {transactionState: "SUCCESS"};
			} else {
				return {transactionState: "ERROR"};
			}
		} catch (err: any) {
			return {
				transactionState: "ERROR",
				error: {
					message: err.message,
				},
			};
		}
	}

	useEffect(() => {
		const onGooglePaymentButtonClicked = (paymentsClient: google.payments.api.PaymentsClient) => async () => {
			if (googlePayConfig && cart.shipping) {
				const { isEligible, countryCode, ...config} = googlePayConfig;
				const paymentRequest = {
					...config,
					callbackIntents: (askForShipping ? ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS', 'SHIPPING_OPTION'] : ["PAYMENT_AUTHORIZATION"]) as CallbackIntent[],
					transactionInfo: getGoogleTransactionInfo(cart, googlePayConfig),
					...getGoogleShippingInfo(cart.shipping?.packages.default, askForShipping, shipping.countries),
				}
				await paymentsClient.loadPaymentData(paymentRequest);
			}
		}
		function onPaymentAuthorized(paymentData: PaymentData): Promise<PaymentAuthorizationResult> {
			return new Promise(function (resolve, reject) {
				processPayment(paymentData)
					.then(function (data) {
						resolve({ transactionState: "SUCCESS" });
					})
					.catch(function (errDetails) {
						resolve({ transactionState: "ERROR" });
					});
			});
		}
		function onPaymentDataChanged(paymentData: IntermediatePaymentData): Promise<PaymentDataRequestUpdate> {
			console.log(paymentData)
			const getResponse = async () => {
				const updatedCart = await callCart(cartKey)
				if (!updatedCart.totals?.total || !updatedCart.shipping?.packages.default) {
					console.error("No total returned from CoCart");
					throw new Error("No total returned from CoCart");
				}
				return {
					newTransactionInfo: getGoogleTransactionInfo(updatedCart, googlePayConfig),
					newShippingOptionParameters: getShippingOptionParameters(updatedCart.shipping.packages.default),
				}
			}
			return new Promise(function (resolve, reject) {
				if (askForShipping) {
					if (["INITIALIZE", "SHIPPING_ADDRESS"].includes(paymentData.callbackTrigger)) {
						callCart(cartKey, '/v2/cart/update', "POST", { namespace: "update-customer"}, {
							state: paymentData.shippingAddress?.administrativeArea,
							postcode: paymentData.shippingAddress?.postalCode,
							country: paymentData.shippingAddress?.countryCode,
							city: paymentData.shippingAddress?.locality,
							s_state: paymentData.shippingAddress?.administrativeArea,
							s_postcode: paymentData.shippingAddress?.postalCode,
							s_country: paymentData.shippingAddress?.countryCode,
							s_city: paymentData.shippingAddress?.locality,
						}).then(() => {
							getResponse().then((data) => {
								console.log(data)
								resolve(data)
							}).catch(reject)
						})
					}
					else if (paymentData.callbackTrigger === "SHIPPING_OPTION") {
						callCart(cartKey, '/v1/shipping-methods', "POST", undefined, {
							key: paymentData.shippingOptionData?.id
						}).then(() => {
							getResponse().then((data) => {
								console.log(data)
								resolve(data)
							}).catch(reject)
						})
					}
				}
				else {
					resolve({})
				}
			});
		}
		function getGooglePaymentsClient() {
			if (paymentsClient) {
				return paymentsClient;
			}
			const paymentsClientObject = new google.payments.api.PaymentsClient({
				environment: "TEST",
				paymentDataCallbacks: {
					onPaymentAuthorized,
					onPaymentDataChanged: askForShipping ? onPaymentDataChanged : undefined,
				},
			});
			setPaymentsClient(paymentsClientObject)
			return paymentsClientObject;
		}
		function addGooglePayButton(paymentsClient: google.payments.api.PaymentsClient) {
			const button = paymentsClient.createButton({
				onClick: onGooglePaymentButtonClicked(paymentsClient),
				buttonSizeMode: "fill",
				buttonType: "pay",
				buttonRadius: 0,
				buttonLocale: "en",
			});
			const element = document.getElementById("google-pay-container")
			if (element) {
				console.log('relead applepay button')
				element.innerHTML = "";
				element.appendChild(button);
			}
		}

		if (!googlePayConfig) { return }
		const paymentsClientObject = getGooglePaymentsClient();
		const { allowedPaymentMethods, apiVersion, apiVersionMinor } = googlePayConfig;
		paymentsClientObject
			.isReadyToPay({ allowedPaymentMethods, apiVersion, apiVersionMinor })
			.then(function (response) {
				if (response.result) {
					addGooglePayButton(paymentsClientObject);
				}
			})
			.catch(function (err) {
				console.error(err);
			});

	}, [askForShipping, cart, cartKey, googlePayConfig, paymentsClient, processPayment, shipping.countries]);

	return <div id="google-pay-container" style={{width: '100%', height: "47px"}} />
}

const getGoogleTransactionInfo = (cart: Cart, googlePayConfig: CartState['googlePayConfig']): TransactionInfo => ({
	displayItems: [
		...cart.items.map((item) => ({
			label: item.name,
			type: "LINE_ITEM" as const,
			price: (Number(item.price) / 100).toString(),
		})),
		{
			label: cart.shipping?.packages.default.package_name ?? "Shipping",
			type: "SHIPPING_OPTION" as const,
			price: (Number(cart.totals.shipping_total) / 100).toString(),
		},
		{
			label: "Tax",
			type: "LINE_ITEM" as const,
			price: (Number(cart.totals.total_tax) / 100).toString(),
		},
	],
	currencyCode: "EUR",
	countryCode: googlePayConfig?.countryCode,
	totalPriceStatus: "FINAL",
	totalPrice: (Number(cart.totals.total) / 100).toString(),
	totalPriceLabel: "Total",

})

const  getGoogleShippingInfo = (shippingPackage: Package, askForShipping: boolean, countries: Country[]): {
	shippingAddressRequired: boolean;
	shippingAddressParameters?: google.payments.api.ShippingAddressParameters;
	shippingOptionRequired: boolean;
	shippingOptionParameters?: google.payments.api.ShippingOptionParameters;
} => {
	return {
		shippingAddressRequired: !!askForShipping,
		shippingAddressParameters: askForShipping ? {
			allowedCountryCodes: countries.map((country) => country.code),
			phoneNumberRequired: true,
		} : undefined,
		shippingOptionRequired: !!askForShipping,
		shippingOptionParameters: askForShipping ? getShippingOptionParameters(shippingPackage) : undefined,
	};
}

const getShippingOptionParameters = (shippingPackage: Package) => ({
	defaultSelectedOptionId: shippingPackage.chosen_method,
	shippingOptions: Object.values(shippingPackage.rates ?? {})?.map((rate) => ({
		id: rate.key,
		label: rate.label,
		description: rate.html,
	})),
})

export default GooglePayButton