import {Backdrop, CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {shippingMethodApplies} from "../../utils/utils";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {NEXT_API_ENDPOINT} from "../../utils/endpoints";
import {Country, ShippingClass, WooOrder} from "../../types/woocommerce";
import {SubmitErrorHandler, SubmitHandler} from "react-hook-form/dist/types/form";
import {CartItem, destroyCart,} from "../../redux/cartSlice";
import CheckoutDesktop from "./CheckoutDesktop";
import {Stripe} from "@stripe/stripe-js";
import PaymentResult from "./PaymentResult";

export type CheckoutGridProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
	stripePromise:  Promise<Stripe | null>
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
	stripePromise
}: CheckoutGridProps) => {
	const [checkoutStep, setCheckoutStep] = useState(1);
	const [tab, setTab] = useState(0);
	const { items } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch()
	const subtotalCart = items.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
	const defaultShippingMethod = shipping.classes.find(sc => sc.locations.includes('IT'))
		?.methods.find(method => shippingMethodApplies(method, subtotalCart, 0));
	const { control, formState: { errors }, watch, handleSubmit, setValue, setError } = useForm<Inputs>({
		defaultValues: {
			has_shipping: false,
			coupon_code: '',
			shipping_method: defaultShippingMethod?.id.toString(),
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

	const {data: orderData, isLoading, mutate} = useMutation(
		async ({orderId, ...validatedData}: any) => {
			const response = await fetch(NEXT_API_ENDPOINT + '/orders' + (orderId ? '/' + orderId : ''), {
				method: orderId ? 'PUT' : 'POST',
				body: JSON.stringify(validatedData),
				headers: [["Content-Type", 'application/json']],
			})
				.then(response => response.json());
			if (response.data?.status) {
				throw new Error(response.message ?? 'Server error');
			}
			return response;
		}
	);
	const order: WooOrder = orderData?.order;

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
	const cartTotal = prices.total - prices.shipping + prices.discount;
	const cartItemsTotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

	const country = hasShipping ? shippingCountry : billingCountry;

	const shippingClass = shipping.classes.find(sc =>
		sc.locations.includes(country)
	)
	const shippingMethods = shippingClass?.methods?.filter((method
	) => shippingMethodApplies(method, cartTotal || cartItemsTotal, prices.discount))
	const hasFreeShipping = shippingMethods?.some(method => method.methodId === 'free_shipping');
	const shippingMethod = shippingClass?.methods.find(sm => sm.id === Number(shippingMethodId)) ?? shippingClass?.methods[0];
	const onValid: SubmitHandler<Inputs> = (data) => {
		if (shippingMethod && order?.id) {
			mutate({
				orderId: order.id,
				billing: data.billing,
				shipping: data.has_shipping ? data.shipping : {...defaultAddressValues, country: ''},
			});
			setCheckoutStep(3)
		}
	}

	const onInvalid: SubmitErrorHandler<Inputs> = (data) => {
		if(hasShipping &&  data.shipping && !data.billing) {
			setTab(1);
		}
	}

	const setAddress = handleSubmit(onValid, onInvalid)

	const setCoupon = () => {
		if (order?.id && watch('coupon_code')) {
			mutate({
				orderId: order.id,
				coupon_lines: [{
					code: watch('coupon_code')
				}]
			})
		}
	}

	const setPaid = (transaction_id: string|number) => {
		if (order?.id && checkoutStep === 5) {
			mutate({
				orderId: order.id,
				set_paid: true,
				transaction_id
			})
			setCheckoutStep(6)
			dispatch(destroyCart())
		}
	}


	useEffect(() => {
		return () => {
			const deleteOrder = () => {
				return fetch(NEXT_API_ENDPOINT + '/orders/' + order.id, { method: 'DELETE' })
					.then(response => response.json())
			}
			// Delete order when component unmounts
			if (order?.id && order?.billing?.email) {
				deleteOrder().then(r => r);
			}
		}
	}, [order?.id, order?.billing?.email]);

	useEffect(() => {
		const initOrder = async () => {
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
		// Initialize order once items are loaded
		if (items.length > 0 && checkoutStep === 1) {
			initOrder().then(() => setCheckoutStep(2));
		}
	}, [items, checkoutStep, mutate, shippingMethod?.methodId, shippingMethod?.cost]);

	useEffect(() => {
		// Update order when cart items quantity changes
		if (checkoutStep === 2 && lineItems) {
			let newItems: {id?: number, quantity: number, variation_id?: number, product_id?: number}[] = [];
			lineItems.forEach(lineItem => {
				const prevItem = order?.line_items.find(i => i.id === lineItem.id)
				if (prevItem && lineItem.qty !== prevItem.quantity) {
					newItems.push({
						id: lineItem.id,
						quantity: 0
					})
					newItems.push({
						quantity: lineItem.qty,
						product_id: lineItem.product_id,
						variation_id: lineItem.variation_id
					})
				}
			})
			if (newItems.length > 0 && order?.id) {
				mutate({
					orderId: order.id,
					line_items: newItems
				})
			}
		}
	}, [lineItems, checkoutStep, order?.id, order?.line_items, mutate]);

	useEffect(() => {
		if(
			checkoutStep === 2 &&
			order &&
			order.shipping_lines &&
			order.shipping_lines[0].method_id !== shippingMethodId
		) {
			console.log('shipping method changed')
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
		if(!shippingMethodId || !finalSippingMethods?.find(sm => sm.id === Number(shippingMethodId))) {
			setValue('shipping_method', finalSippingMethods?.[0]?.id.toString() ?? null)
		}
	}, [country, finalSippingMethods, setValue, shippingMethodId]);

	switch (checkoutStep) {
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
				<CheckoutDesktop
					control={control}
					errors={errors}
					countries={shipping.countries}
					shippingCountry={shippingCountry}
					billingCountry={billingCountry}
					hasShipping={hasShipping}
					setAddress={setAddress}
					isLoading={isLoading}
					setCoupon={setCoupon}
					shippingMethods={finalSippingMethods}
					shippingMethod={shippingMethod}
					prices={prices}
					cartTotal={cartTotal}
					items={lineItems ?? items}
					setError={setError}
					tab={tab}
					setTab={setTab}
					checkoutStep={checkoutStep}
					setCheckoutStep={setCheckoutStep}
					order={order}
					setPaid={setPaid}
					stripePromise={stripePromise}
				/>
			);
	}
}

export default CheckoutGrid;