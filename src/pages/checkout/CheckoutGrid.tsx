import {Backdrop, CircularProgress, useMediaQuery, useTheme} from "@mui/material";
import {BaseSyntheticEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {shippingMethodApplies} from "../../utils/utils";
import {Control, ErrorOption, FieldErrors, FieldPath, useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {NEXT_API_ENDPOINT} from "../../utils/endpoints";
import {Country, ShippingClass, ShippingMethod, WooOrder} from "../../types/woocommerce";
import {SubmitErrorHandler, SubmitHandler} from "react-hook-form/dist/types/form";
import {CartItem} from "../../redux/cartSlice";
import CheckoutDesktop from "./CheckoutDesktop";
import PaymentResult from "./PaymentResult";
import CheckoutMobile from "./CheckoutMobile";
import StripeWrapper from "./StripeWrapper";
import {OrderResponseBody} from "@paypal/paypal-js";

export type CheckoutGridProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
	items: CartItem[]
}

export type CheckoutCartItem = CartItem & {id: number};

export type Inputs = {
	has_shipping: boolean,
	coupon_code: string,
	shipping_method: string | null,
	billing: {
		email: string,
		phone: string,
		first_name: string,
		last_name: string,
		company?: string,
		address_1: string,
		address_2: string,
		city: string,
		state: string,
		postcode: string,
		country: string
	},
	shipping?: {
		first_name: string,
		last_name: string,
		company?: string,
		address_1: string,
		address_2: string,
		city: string,
		state: string,
		postcode: string,
		country: string
	}
};

export type CheckoutComponentProps = {
	control: Control<Inputs>
	errors: FieldErrors<Inputs>
	countries: Country[]
	shippingCountry: string
	billingCountry: string
	hasShipping: boolean
	setAddress: (e?: (BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
	isLoading: boolean
	setCoupon: () => void
	shippingMethods?: ShippingMethod[]
	shippingMethod?: ShippingMethod
	prices: {
		total: number
		totalTax: number
		shipping: number
		shippingTax: number
		discount: number
		discountTax: number
		cartTax: number
	}
	cartTotal: number
	items: (CheckoutCartItem | CartItem)[]
	setError: (name: (FieldPath<Inputs> | `root.${string}` | "root"), error: ErrorOption, options?: {shouldFocus: boolean}) => void
	tab: number
	setTab: Dispatch<SetStateAction<number>>
	checkoutStep: number
	setCheckoutStep: Dispatch<SetStateAction<number>>
	mobileCheckoutStep: number
	setMobileCheckoutStep: Dispatch<SetStateAction<number>>
	order?: WooOrder
	setPaid: (payPal: OrderResponseBody) => void
}

const defaultAddressValues = {
	first_name: '',
	last_name: '',
	address_1: '',
	address_2: '',
	company: '',
	city: '',
	state: '',
	postcode: ''
}

const CheckoutGrid = ({
    shipping,
	items
}: CheckoutGridProps) => {
	const [checkoutStep, setCheckoutStep] = useState(0);
	const [mobileCheckoutStep, setMobileCheckoutStep] = useState(1)
	const [addressTab, setAddressTab] = useState(0);
	const [order, setOrder] = useState<WooOrder>();
	const cartItemsTotal = items.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
	const defaultShippingMethod = shipping.classes.find(sc => sc.locations.includes('IT'))
		?.methods.find(method => shippingMethodApplies(method, cartItemsTotal, 0));

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const CheckoutComponent = isMobile ? CheckoutMobile : CheckoutDesktop

	const { control, formState: { errors }, watch, handleSubmit, setValue, setError } = useForm<Inputs>({
		defaultValues: {
			has_shipping: false,
			coupon_code: '',
			shipping_method: defaultShippingMethod?.methodId.toString(),
			billing: {
				email: '',
				phone: '',
				country: 'IT',
				...defaultAddressValues
			},
			shipping: {
				country: 'IT',
				...defaultAddressValues
			}
		},
		reValidateMode: 'onSubmit'
	});
	const shippingCountry = watch('shipping.country');
	const billingCountry = watch('billing.country');
	const hasShipping = watch('has_shipping');
	const shippingMethodId = watch('shipping_method');
	const {isLoading, mutate} = useMutation(
		async ({orderId, ...validatedData}: any) => {
			const response = await fetch(NEXT_API_ENDPOINT + '/orders' + (orderId ? '/' + orderId : ''), {
				method: orderId ? 'PUT' : 'POST',
				body: JSON.stringify(validatedData),
				headers: [["Content-Type", 'application/json']],
			})
				.then(response => response.json());

			if (!response.order) {
				console.error('mutation error')
				throw new Error(response.error ?? 'Server error');
			}
			setOrder(response.order)
			return response.order;
		}
	);

	const lineItems = items.map(item => ({
		...item,
		id: order?.line_items.find(li => li.product_id === item.product_id && li.variation_id === item.variation_id)?.id
	} as CheckoutCartItem))

	const prices = {
		total: parseFloat(order?.total ?? '0'),
		totalTax: parseFloat(order?.total_tax ?? '0'),
		shipping: parseFloat(order?.shipping_total ?? '0'),
		shippingTax: parseFloat(order?.shipping_tax ?? '0'),
		cartTax: parseFloat(order?.cart_tax ?? '0'),
		discount: parseFloat(order?.discount_total ?? '0'),
		discountTax: parseFloat(order?.discount_tax ?? '0')
	}
	const cartTotal = prices.total - prices.shipping + prices.discount + prices.discountTax;

	const country = hasShipping ? shippingCountry : billingCountry;

	const shippingClass = shipping.classes.find(sc =>
		sc.locations.includes(country)
	)
	const shippingMethods = shippingClass?.methods?.filter((method
	) => shippingMethodApplies(method, cartTotal || cartItemsTotal, prices.discount))
	const hasFreeShipping = shippingMethods?.some(method => method.methodId === 'free_shipping');
	const shippingMethod = shippingClass?.methods.find(sm => sm.methodId === shippingMethodId) ?? shippingClass?.methods[0];
	const onValid: SubmitHandler<Inputs> = (data) => {
		if (shippingMethod && order?.id) {
			console.log('address updated')
			mutate({
				orderId: order.id,
				billing: data.billing,
				shipping: data.has_shipping ? data.shipping : {...defaultAddressValues, country: ''},
			});
			if (!isMobile)
				setCheckoutStep(3)
			setMobileCheckoutStep(2)
		}
	}
14
	const onInvalid: SubmitErrorHandler<Inputs> = (data) => {
		if(hasShipping &&  data.shipping && !data.billing) {
			setAddressTab(1);
		}
	}

	const setAddress = handleSubmit(onValid, onInvalid)

	const mutateOrder = () => {
		const couponCode = watch('coupon_code')
		const orderId = order?.id
		const clearOrder = {
			orderId,
			line_items: lineItems.map(li => ({id: li.id, quantity: 0})),
			coupon_lines: []
		}
		const restoreOrder = {
			orderId,
			line_items: lineItems.map(li => ({
				product_id: li.product_id,
				variation_id: li.variation_id === li.product_id ?
					undefined : li.variation_id,
				quantity: li.qty,
			})),
			coupon_lines: [{ code: couponCode }]
		}

		if (couponCode) {
			return mutate(clearOrder, {
				onSuccess: () => mutate(restoreOrder, {
					onError: () => {
						setError('coupon_code', {message: 'Coupon non valido'})
						mutate({...restoreOrder, coupon_lines: []})
					}
				})
			})
		}
		else {
			let newItems: {id?: number, quantity: number, variation_id?: number, product_id?: number}[] = [];
			lineItems.forEach(lineItem => {
				const prevItem = order?.line_items.find(i => i.id === lineItem.id)
				if (prevItem && lineItem.qty !== prevItem.quantity) {
					newItems.push({
						id: lineItem.id,
						quantity: 0,
					})
					newItems.push({
						quantity: lineItem.qty,
						product_id: lineItem.product_id,
						variation_id: lineItem.variation_id
					})
				}
			})
			if (newItems.length > 0 && order?.id) {
				return mutate({orderId, line_items: newItems})
			}
		}
	}

	const setPaid = (payPal: OrderResponseBody) => {
		if (order?.id) {
			console.log('set paypal paid')
			mutate({
				orderId: order.id,
				set_paid: true,
				meta_data: [
					{key: '_ppcp_paypal_order_id', value: payPal.id},
					{key: '_ppcp_paypal_intent', value: payPal.intent},
				]
			})
			setCheckoutStep(6)
		}
	}

	useEffect(() => {
		const initOrder = async () => {
			console.log('init order')
			await mutate({
				line_items: items.map(item => ({
					product_id: item.product_id,
					variation_id: item.variation_id === item.product_id ?
						undefined : item.variation_id,
					quantity: item.qty,
				})),
				shipping_lines: [{
					method_id: shippingMethod?.methodId,
					total: shippingMethod?.cost
				}]
			})
		}
		const deleteOrder = (id: number) => {
			console.log('oder deleted')
			return fetch(NEXT_API_ENDPOINT + '/orders/' + id, { method: 'DELETE' })
				.then(response => response.json())
		}

		if (checkoutStep === 0) {
			initOrder()
			setCheckoutStep(2)
		}

		return () => {
			// Delete order when component unmounts
			if (order?.id && !order?.billing?.email) {
				deleteOrder(order.id).then(r => r);
			}
		}
	}, []);


	useEffect(() => {
		// Update order when cart items quantity changes
		if (checkoutStep === 2 && lineItems) {
			mutateOrder()
		}
	}, [cartItemsTotal]);

	useEffect(() => {
		if(
			checkoutStep === 2 &&
			order &&
			order.shipping_lines &&
			order.shipping_lines[0].method_id !== shippingMethodId?.toString()
		) {
			console.log('shipping lines updated', order.shipping_lines[0].method_id, shippingMethodId?.toString(), order.shipping_lines[0])
			mutate({
				orderId: order?.id,
				shipping_lines: [{
					id: order.shipping_lines[0].id,
					method_id: shippingMethodId,
					total: shippingMethods?.find(sm => sm.id === Number(shippingMethodId))?.cost
				}]
			})
		}
	}, [checkoutStep, mutate, order, shippingMethodId, shippingMethods])

	const finalSippingMethods = shippingMethods?.filter(sm => !hasFreeShipping || sm.methodId !== 'flat_rate')

	useEffect(() => {
		if(checkoutStep === 2 && (
			!shippingMethodId || !finalSippingMethods?.find(sm => sm.methodId === shippingMethodId)
		)) {
			setValue('shipping_method', finalSippingMethods?.[0]?.methodId.toString() ?? null)
		}
	}, [checkoutStep, country, finalSippingMethods, setValue, shippingMethodId]);

	switch (checkoutStep) {
		case 0:
		case 1:
			return (
				<Backdrop
					sx={{ backgroundColor: 'rgba(255,255,255,0.75)', zIndex: (theme) => theme.zIndex.appBar - 2 }}
					open={true}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			);
		case 6:
			return <PaymentResult isLoading={false} isSuccess={true} />
		case 7:
			return <PaymentResult isLoading={false} isSuccess={false} />
		default:
			return (
				<StripeWrapper order={order}>
					<CheckoutComponent
						control={control}
						errors={errors}
						countries={shipping.countries}
						shippingCountry={shippingCountry}
						billingCountry={billingCountry}
						hasShipping={hasShipping}
						setAddress={setAddress}
						isLoading={isLoading}
						setCoupon={mutateOrder}
						shippingMethods={finalSippingMethods}
						shippingMethod={shippingMethod}
						prices={prices}
						cartTotal={cartTotal}
						items={lineItems ?? items}
						setError={setError}
						tab={addressTab}
						setTab={setAddressTab}
						checkoutStep={checkoutStep}
						setCheckoutStep={setCheckoutStep}
						mobileCheckoutStep={mobileCheckoutStep}
						setMobileCheckoutStep={setMobileCheckoutStep}
						order={order}
						setPaid={setPaid}
					/>
				</StripeWrapper>
			)
	}
}

export default CheckoutGrid;