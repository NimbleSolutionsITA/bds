import {useState, useEffect, useRef} from "react";
import {PaymentRequestButtonElement, useStripe} from '@stripe/react-stripe-js';
import {PaymentRequest, PaymentRequestUpdateDetails} from "@stripe/stripe-js/types/stripe-js/payment-request";
import {ShippingClass} from "../types/woocommerce";
import {NEXT_API_ENDPOINT} from "../utils/endpoints";
import {useRouter} from "next/router";
import {getCartItemPriceWithoutTax, getIsEU, getName} from "../utils/utils";
import {useTranslation} from "next-i18next";
import {AppDispatch} from "../redux/store";
import {useDispatch} from "react-redux";
import {destroyCart} from "../redux/cartSlice";

type StripePaymentButtonProps = {
	items: CartItem[]
	shipping: ShippingClass[]
	isCart?: boolean
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
	priceEU?: number
	qty: number
}

type ShippingLine = {
	method_id: string
	total: string
	method_title: string
}
const StripePaymentButton = ({items, shipping, isCart}: StripePaymentButtonProps) => {
	const stripe = useStripe();
	const total = getTotalIT(items);
	const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
	const shippingCountry = useRef('IT')
	const shippingLine = useRef<ShippingLine>()
	const router = useRouter();
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>()

	const shippingOptions = getShippingOptions(shippingCountry.current, shipping, getTotalByCountry(items, shippingCountry.current) / 100)
	console.log({shippingCountry: shippingCountry.current})

	useEffect(() => {
		if (paymentRequest) {
			console.log('update')
			const shippingLine = shippingOptions[0]
			paymentRequest.update({
				total: {
					label: t('total'),
					amount: total,
				},
				displayItems: [
					...items.map(item => ({
						label: item.name,
						amount: item.price * 100,
					})),
					{
						label: shippingLine?.label ?? '',
						amount: shippingLine?.amount ?? 0,
					}
				]
			})
		}
	}, [total, paymentRequest, t, items]);


	useEffect(() => {
		if (stripe) {
			const pr = stripe.paymentRequest({
				country: 'IT',
				currency: 'eur',
				total: {
					label: t('total'),
					amount: total,
					pending: true
				},
				requestPayerName: true,
				requestPayerEmail: true,
				requestShipping: true,
				requestPayerPhone: true,
				shippingOptions,
				displayItems: [
					...items.map(item => ({
						label: item.name,
						amount: item.price * 100,
					})),
					{
						label: shippingOptions[0]?.label ?? '',
						amount: shippingOptions[0]?.amount ?? 0,
					}
				]
			});

			// Check the availability of the Payment Request API.
			pr.canMakePayment().then(result => {
				if (result) {
					setPaymentRequest(pr);
				}
			});

			pr.on('paymentmethod', async (e) => {
				console.log('paymentmethod', e)
				const {error: backendError, paymentIntentId,  clientSecret, success} = await fetch(NEXT_API_ENDPOINT + '/order/stripe-payment-intent',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							items: items.map(item => ({
								product_id: item.product_id,
								variation_id: item.variation_id,
								quantity: item.qty
							})),
							shippingCountry: shippingCountry.current,
							shippingLine: shippingLine.current
						}),
					}
				).then((r) => r.json());

				if (!success) {
					console.log(backendError);
					return;
				}

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

				const isEU = (e.shippingAddress?.country ?? e.paymentMethod.billing_details.address?.country ) !== 'IT'

				const orderBody = {
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
						...(item.variation_id ?
							{variation_id: item.variation_id} :
							{product_id: item.product_id}
						),
						quantity: item.qty,
						...(isEU && {price: item.priceEU} ?
								{total: (Number(item.priceEU) * item.qty / 1.22) + ''} : {}
						),
					})),
					shipping_lines: [ {
						...shippingLine.current,
						total: parseFloat(shippingLine.current?.total ?? '0') / 1.22 / 100 + ''
					} ],
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
				}

				console.log(orderBody)

				await fetch(NEXT_API_ENDPOINT + '/order', {
					method: 'POST',
					headers: [["Content-Type", 'application/json']],
					body: JSON.stringify(orderBody),
				})
					.then(response => response.json());

				if (isCart) {
					await dispatch(destroyCart());
				}

				e.complete('success');

				await router.push({
					pathname: '/checkout/completed',
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
				if (shippingOptions.length === 0) {
					ev.updateWith({status: 'invalid_shipping_address'});
				} else {
					const newTotal = getTotalByCountry(items, ev.shippingAddress.country)
					const shippingOptions = getShippingOptions(ev.shippingAddress.country, shipping, newTotal);
					shippingLine.current = {
						method_id: shippingOptions[0].id,
						total: shippingOptions[0].amount + '',
						method_title: shippingOptions[0].label
					}
					const payload = {
						status: 'success',
						shippingOptions,
						total: {
							label: t('total'),
							amount: (newTotal * 100) + shippingOptions[0].amount,
						},
						displayItems: [
							...items.map(item => ({
								label: item.name,
								amount: getTotalItemByCountry(item, ev.shippingAddress.country ?? shippingCountry.current) * 100
							})),
							{
								label: shippingOptions[0].label,
								amount: shippingOptions[0].amount,
							}
						]
					} as  PaymentRequestUpdateDetails
					shippingCountry.current = ev.shippingAddress.country
					console.log(payload)
					ev.updateWith(payload);
				}
			});

			pr.on('shippingoptionchange', function(event) {
				console.log({shippingCountry: shippingCountry.current})
				const shippingAmount = event.shippingOption.amount / 100
				const newTotal = getTotalByCountry(items, shippingCountry.current) + shippingAmount
				console.log('shippingoptionchange', newTotal, shippingCountry.current)
				shippingLine.current = {
					method_id: event.shippingOption?.id,
					total: shippingAmount + '',
					method_title: event.shippingOption?.label
				}
				const payload = {
					status: 'success',
					total: {
						label: t('total'),
						amount: newTotal * 100
					},
					displayItems: [
						...items.map(item => ({
							label: item.name,
							amount: getTotalItemByCountry(item, shippingCountry.current) * 100
						})),
						{
							label: event.shippingOption?.label,
							amount: event.shippingOption?.amount ?? 0,
						}
					]
				} as  PaymentRequestUpdateDetails
				console.log(payload)
				event.updateWith(payload);
			})
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
const getShippingOptions = (country: string, shipping: ShippingClass[], total: number): ShippingOption[] => {
	console.log(total)
	const methods = shipping.find(s => s.locations.includes(country))?.methods
		.filter(m => m.enabled && m.requires === 'min_amount' ? parseFloat(m.minAmount) <= total : true)
	return methods?.map(m => ({
		id: m.methodId,
		label: m.title,
		detail: m.title,
		amount: Number(m.cost ?? 0) * 100
	})) ?? []
}

const getTotalItemByCountry = (item: CartItem, country: string) => ((country !== 'IT' && item.priceEU && item.priceEU > 0) ? item.priceEU : item.price)

const getTotalIT = (items: CartItem[]) => items.reduce((acc, item) => acc + item.price * item.qty, 0)
const getTotalEU = (items: CartItem[]) => items.reduce((acc, item) => acc + (item.priceEU ? (item.priceEU) : item.price) * item.qty, 0)

const getTotalByCountry = (items: CartItem[], country: string) => country === 'IT' ? getTotalIT(items) : getTotalEU(items)

export default StripePaymentButton;