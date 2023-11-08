import {useState} from "react";
import {shippingMethodApplies} from "../../utils/utils";
import {FormProvider, useForm} from "react-hook-form";
import {BillingData, Country, ShippingClass, ShippingData, ShippingMethod, WooOrder} from "../../types/woocommerce";
import {SubmitErrorHandler, SubmitHandler} from "react-hook-form/dist/types/form";
import CheckoutDesktop from "./CheckoutDesktop";
import {
	CreateOrderActions,
	CreateOrderData,
	OnApproveActions,
	OnApproveData,
} from "@paypal/paypal-js";
import {useMediaQuery, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {Item} from "../../types/cart-type";
import {setCustomerData, updateShippingCountry} from "../../redux/cartSlice";

export type CheckoutGridProps = {
	shipping: {
		classes: ShippingClass[],
		countries: Country[]
	}
}

export type Inputs = {
	has_shipping: boolean,
	billing: BillingData,
	shipping?: ShippingData
};

export type Step = 'ADDRESS'|'RECAP'|'PAYMENT_STRIPE'|'PAYMENT_PAYPAL'|'COMPLETED'

export type OrderIntent = {
	paymentMethod?: 'stripe'|'paypal'
	billing: BillingData
	shipping?: ShippingData
	line_items: {
		product_id: number,
		variation_id?: number,
		quantity: number
	}[]
	shipping_lines: {
		method_id: string,
		total: string
	}[],
	coupon_lines: {
		code: string
	}[],
}

export type PaymentControllers = {
	payWithStripe: () => Promise<void>
	payWithPayPal: (data: CreateOrderData, actions: CreateOrderActions) => Promise<string>
	onPayPalApprove:  (data: OnApproveData, actions: OnApproveActions) => Promise<void>
	onPayPalError: (err: any) => void
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

const initalData = {
	billing: {
		email: '',
		phone: '',
		country: 'IT',
		...defaultAddressValues
	},
	shipping: {
		country: 'IT',
		...defaultAddressValues
	},
	coupon_lines: []
}


const CheckoutGrid = ({ shipping }: CheckoutGridProps) => {
	const { cart, customer } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>()
	const [step, setStep] = useState<Step>('ADDRESS');
	const [addressTab, setAddressTab] = useState<number>(0);
	const methods = useForm<Inputs>({
		defaultValues: {
			has_shipping: false,
			billing: { ...initalData.billing, country: cart.customer?.billing_address.billing_country ?? initalData.billing.country },
			shipping: { ...initalData.shipping, country: cart.customer?.shipping_address.shipping_country ?? initalData.shipping.country}
		},
		reValidateMode: 'onSubmit'
	});
	const { handleSubmit } = methods
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const onValid: SubmitHandler<Inputs> = (data) => {
		const deliveryCountry = (data.has_shipping && data.shipping) ? data.shipping.country : data.billing.country;
		const orderDeliveryCountry = customer?.shipping ? customer.shipping.country : customer?.billing.country ?? 'IT';
		if (deliveryCountry !== orderDeliveryCountry) {
			dispatch(updateShippingCountry({ country: deliveryCountry }))
		}
		dispatch(setCustomerData({
			billing: data.billing,
			shipping: data.has_shipping ? data.shipping : data.billing
		}))

		setStep((step === 'ADDRESS' && isMobile) ? 'RECAP' : 'PAYMENT_STRIPE')
	}

	const onInvalid: SubmitErrorHandler<Inputs> = (data) => {
		setAddressTab(data.shipping ? 1 : 0);
	}

	const updateOrder = handleSubmit(onValid, onInvalid);

	return (
		<FormProvider {...methods}>
			{isMobile ? (
				<div>PD</div>
				) : (
				<CheckoutDesktop
					countries={shipping.countries}
					isLoading={isLoading}
					tab={addressTab}
					setTab={setAddressTab}
					checkoutStep={step}
					setCheckoutStep={setStep}
					updateOrder={updateOrder}
				/>
			)}
		</FormProvider>
	)
}

const generateLineItems = (items: Item[] = []): OrderIntent['line_items'] => {
	return items.map(item => ({
		product_id: item.meta.product_type === 'variation' ? item.meta.variation.parent_id : item.id,
		quantity: item.quantity.value,
		...(item.meta.product_type === 'variation' && {variation_id: item.id})
	}))
}

const generateShippingMethods = (classes: ShippingClass[], country: string,  totalOrderAmount: number, totalDiscounts: number): ShippingMethod[] => {
	const shippingClass = classes.find(sc =>
		sc.locations.includes(country)
	)
	return shippingClass?.methods.filter(methods => shippingMethodApplies(methods, totalOrderAmount, totalDiscounts)) ?? []
}

const mapLinesFromMethods = (methods: ShippingMethod[]): OrderIntent['shipping_lines'] => {
	return methods.map(method => ({
		method_id: method.methodId,
		total: method.cost
	}))
}

export default CheckoutGrid;