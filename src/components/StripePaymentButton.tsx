import {useState, useEffect} from "react";
import {PaymentRequestButtonElement, useStripe} from '@stripe/react-stripe-js';
import {PaymentRequest} from "@stripe/stripe-js/types/stripe-js/payment-request";
import {ShippingClass} from "../types/woocommerce";
import {NEXT_API_ENDPOINT} from "../utils/endpoints";
import {useRouter} from "next/router";
import {getName} from "../utils/utils";
import {useTranslation} from "next-i18next";

type StripePaymentButtonProps = {
	items: CartItem[]
	shipping: ShippingClass[]
}

type ShippingOption = {
	id: string
	label: string
	detail: string
	amount: number
}

type CartItem = {
	product_id: number
	variation_id?: number
	name: string
	price: number
	qty: number
}
const StripePaymentButton = ({items, shipping}: StripePaymentButtonProps) => {
	const stripe = useStripe();
	const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
	const total = items.reduce((acc, item) => acc + item.price * item.qty, 0) * 100;
	const router = useRouter();
	const { t } = useTranslation();

	const getShippingOptions = (country: string): ShippingOption[] => {
		const methods = shipping.find(s => s.locations.includes(country))?.methods
			.filter(m => m.enabled && m.requires === 'min_amount' ? parseFloat(m.minAmount) <= total : true)
		return methods?.map(m => ({
			id: m.methodId,
			label: m.title,
			detail: m.title,
			amount: Number(m.cost ?? 0) * 100
		})) ?? []
	}

	useEffect(() => {
		if (paymentRequest) {
			paymentRequest.update({
				total: {
					label: t('total'),
					amount: total,
				},
				displayItems: items.map(item => ({
					label: item.name,
					amount: item.price * 100,
				}))
			})
		}
	}, [total, paymentRequest]);


	useEffect(() => {
		if (stripe) {
			const pr = stripe.paymentRequest({
				country: 'IT',
				currency: 'eur',
				total: {
					label: t('total'),
					amount: total,
				},
				requestPayerName: true,
				requestPayerEmail: true,
				requestShipping: true,
				requestPayerPhone: true,
				shippingOptions: getShippingOptions('IT'),
				displayItems: items.map(item => ({
					label: item.name,
					amount: item.price * 100,
				}))
			});

			// Check the availability of the Payment Request API.
			pr.canMakePayment().then(result => {
				if (result) {
					setPaymentRequest(pr);
				}
			});

			pr.on('paymentmethod', async (e) => {

				const {error: backendError, paymentIntentId,  clientSecret} = await fetch(NEXT_API_ENDPOINT + '/orders/stripe-payment-intent',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(items.map(item => ({
							product_id: item.product_id,
							variation_id: item.variation_id,
							quantity: item.qty
						}))),
					}
				).then((r) => r.json());

				if (backendError) {
					console.log(backendError);
					return;
				}

				console.log('Client secret returned');

				const {
					error: stripeError,
					paymentIntent,
				} = await stripe.confirmCardPayment(clientSecret, {
					payment_method: e.paymentMethod.id,
				}, { handleActions: false });

				if (stripeError) {
					// Show error to your customer (e.g., insufficient funds)
					console.log(stripeError.message);
					return;
				}

				// Show a success message to your customer
				// There's a risk of the customer closing the window before callback
				// execution. Set up a webhook or plugin to listen for the
				// payment_intent.succeeded event that handles any business critical
				// post-payment actions.

				const { order } = await fetch(NEXT_API_ENDPOINT + '/orders', {
					method: 'POST',
					headers: [["Content-Type", 'application/json']],
					body: JSON.stringify({
						payment_method: "stripe",
						payment_method_title: e.walletName,
						set_paid: true,
						meta_data: [
							{
								key: "_stripe_intent_id",
								value: paymentIntentId,
							}
						],
						line_items: items.map(item => ({
							product_id: item.product_id,
							variation_id: item.variation_id,
							quantity: item.qty
						})),
						shipping_lines: [
							{
								method_id: e.shippingOption?.id,
								total: e.shippingOption?.amount.toString()
							}
						],
						shipping: {
							first_name: getName(e.shippingAddress?.recipient)[0] ?? '',
							last_name: getName(e.shippingAddress?.recipient)[1] ?? '',
							address_1: e.shippingAddress?.addressLine ? e.shippingAddress?.addressLine[0] : '',
							address_2: e.shippingAddress?.addressLine ? e.shippingAddress?.addressLine[1] : '',
							country: e.shippingAddress?.country ?? '',
							city: e.shippingAddress?.city ?? '',
							state: e.shippingAddress?.region ?? '',
							postcode: e.shippingAddress?.postalCode ?? '',
							phone: e.shippingAddress?.phone ?? ''
						},
						billing: {
							first_name: getName(e.paymentMethod.billing_details?.name)[0] ?? '',
							last_name: getName(e.paymentMethod.billing_details.name)[1] ?? '',
							address_1: e.paymentMethod.billing_details.address?.line1 ?? '',
							address_2: e.paymentMethod.billing_details.address?.line2 ?? '',
							country: e.paymentMethod.billing_details.address?.country ?? '',
							city: e.paymentMethod.billing_details.address?.city ?? '',
							state: e.paymentMethod.billing_details.address?.state ?? '',
							postcode: e.paymentMethod.billing_details.address?.postal_code ?? '',
							phone: e.paymentMethod.billing_details.phone ?? '',
							email: e.payerEmail
						}
					}),
				})
					.then(response => response.json());

				e.complete('success');

				await router.push({
					pathname: '/checkout/' + order.id,
					query: {
						paid: true
					}
				});
			});

			pr.on('shippingaddresschange', async (ev) => {
				if (!ev.shippingAddress.country) {
					ev.updateWith({status: 'invalid_shipping_address'});
					return;
				}
				const shippingOptions = getShippingOptions(ev.shippingAddress.country);
				if (shippingOptions.length === 0) {
					ev.updateWith({status: 'invalid_shipping_address'});
				} else {
					ev.updateWith({
						status: 'success',
						shippingOptions
					});
				}
			});
		}
	}, [stripe]);

	if (paymentRequest) {
		return <PaymentRequestButtonElement options={{
			paymentRequest,
			style: {
				paymentRequestButton: {
					type: 'buy',
					height: '55px',
				}
			}
		}} />
	}

	// Use a traditional checkout form.
	return <span />;
}

export default StripePaymentButton;