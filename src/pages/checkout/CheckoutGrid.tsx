import {useState} from "react";
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
import {setCustomerData, updateShippingCountry} from "../../redux/cartSlice";
import CheckoutMobile from "./CheckoutMobile";
import {PaymentErrorDialog} from "./Payment";

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
		vat: '',
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
	const { cart, customer, customerNote, stripe: { intentId } = { intentId: null } } = useSelector((state: RootState) => state.cart);
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
	const [paymentError, setPaymentError] = useState<string>();

	const onValid: SubmitHandler<Inputs> = (data) => {
		if (data && data.shipping && data.billing) {
			const deliveryCountry = data.has_shipping ? data.shipping.country : data.billing.country;
			const orderDeliveryCountry = cart.customer?.shipping_address.shipping_country
			if (deliveryCountry !== orderDeliveryCountry) {
				dispatch(updateShippingCountry({ country: deliveryCountry }))
			}
			dispatch(setCustomerData({
				billing: data.billing,
				shipping: data.has_shipping ? data.shipping : data.billing
			}))

			setStep((step === 'ADDRESS' && isMobile) ? 'RECAP' : 'PAYMENT_STRIPE')
		}
	}

	const onInvalid: SubmitErrorHandler<Inputs> = (data) => {
		setAddressTab(data.shipping ? 1 : 0);
	}

	const updateOrder = handleSubmit(onValid, onInvalid);

	const checkoutProps = {
		countries: shipping.countries,
		isLoading,
		tab: addressTab,
		setTab: setAddressTab,
		checkoutStep: step,
		setCheckoutStep: setStep,
		updateOrder,
	}

	return (
		<FormProvider {...methods}>
			{isMobile ? (
				<CheckoutMobile {...checkoutProps} />
				) : (
				<CheckoutDesktop {...checkoutProps} />
			)}
			<PaymentErrorDialog error={paymentError} setError={setPaymentError} />
		</FormProvider>
	)
}

export default CheckoutGrid;