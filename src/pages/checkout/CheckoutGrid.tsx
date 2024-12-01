import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {BillingData, InvoiceData, ShippingData} from "../../types/woocommerce";
import {SubmitErrorHandler, SubmitHandler} from "react-hook-form/dist/types/form";
import CheckoutDesktop from "./CheckoutDesktop";
import {useMediaQuery, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {updateCartCustomer} from "../../redux/cartSlice";
import CheckoutMobile from "./CheckoutMobile";
import useAuth from "../../utils/useAuth";
import {BillingAddress, Customer, ShippingAddress} from "../../types/cart-type";
import {PayPalCheckoutProvider} from "../../components/PayPalCheckoutProvider";
import {ShippingData as WooShippingData} from "../../redux/layoutSlice";
import {getCustomerMetaData, getInvoice} from "../../utils/utils";
import PaymentErrorDialog from "./PaymentErrorDialog";

export type CheckoutGridProps = {
	shipping: WooShippingData
}

export type Inputs = {
	has_shipping: boolean,
	billing: BillingData,
	shipping?: ShippingData
	invoice: InvoiceData
	customerNote: string
};

export type PaymentMethod = "applepay" | "googlepay" | "card" | "paypal"

export type CheckoutState = {
	step: Step,
	addressTab: number
	paymentError?: string
	paymentMethod: PaymentMethod
}

export const PAYMENT_METHODS = ['card', 'applepay', 'googlepay', 'paypal'] as PaymentMethod[]

export type FormFields = CheckoutState & Inputs

export type Step = 'ADDRESS'|'INVOICE'|'PAYMENT'

const CheckoutGrid = ({ shipping }: CheckoutGridProps) => {
	const { cart, customerNote } = useSelector((state: RootState) => state.cart);
	const { customer: loggedCustomer, updateCustomer ,loggedIn } = useAuth();
	const dispatch = useDispatch<AppDispatch>()
	const defaultValues = {
		has_shipping: getCustomerMetaData('has_shipping', false, loggedCustomer),
		billing: Object.keys(cart?.customer.billing_address ?? {}).reduce((acc, key) => {
			const newKey = key.substring(8) as keyof BillingData
			return {...acc, [newKey]: cart?.customer.billing_address[key as keyof BillingAddress]};
		}, {}),
		shipping: Object.keys(cart?.customer.shipping_address ?? {}).reduce((acc, key) => {
			const newKey = key.substring(9) as keyof ShippingData
			return {...acc, [newKey]: cart?.customer.shipping_address[key as keyof ShippingAddress]};
		}, {}),
		invoice: getInvoice(loggedCustomer),
		customerNote,
		addressTab: 0,
		paymentMethod: 'card',
		step: "ADDRESS"
 	} as FormFields
	const defaultStep = getDefaultStep(defaultValues)
	const methods = useForm<FormFields>({
		defaultValues: Object.assign(defaultValues, { step: defaultStep }),
		reValidateMode: 'onSubmit',
	});
	const { handleSubmit , setValue } = methods
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [paymentError, setPaymentError] = useState<string>();

	const onValid = (onValidStep: Step): SubmitHandler<Inputs> => (data)  => {
		if (data && data.shipping && data.billing) {
			dispatch(updateCartCustomer({
				...data.billing,
				ship_to_different_address: data.has_shipping,
				s_first_name: data.has_shipping ? data.shipping.first_name : "",
				s_last_name: data.has_shipping ? data.shipping.last_name : "",
				s_address_1: data.has_shipping ? data.shipping.address_1 : "",
				s_city: data.has_shipping ? data.shipping.city : "",
				s_state: data.has_shipping ? data.shipping.state : "",
				s_postcode: data.has_shipping ? data.shipping.postcode : "",
				s_country: data.has_shipping ? data.shipping.country : "",
				s_company: data.has_shipping ? data.shipping.company : "",
			}))
			if (loggedIn) {
				updateCustomer({
					billing: data.billing,
					shipping: data.has_shipping ? data.shipping : data.billing,
					meta_data: [
						{ key: 'has_shipping', value: data.has_shipping },
						{ key: 'vat', value: data.invoice.vat },
						{ key: 'tax', value: data.invoice.tax },
						{ key: 'sdi', value: data.invoice.sdi },
						{ key: 'billing_choice', value: data.invoice.billingChoice },
						{ key: 'invoice_type', value: data.invoice.invoiceType}
					]
				})
			}
			setValue('step', onValidStep);
		}
	}

	const onInvalid: SubmitErrorHandler<Inputs> = (data) => {
		if (data.shipping || data.billing)
			setValue('addressTab', data.shipping ? 1 : 0);
		if (data.invoice)
			setValue('step', 'INVOICE');
	}

	const updateOrder = (onValidStep: Step) => handleSubmit(onValid(onValidStep), onInvalid);

	useEffect(() => {
		if (defaultStep !== 'ADDRESS') {
			handleSubmit(onValid(defaultStep))()
		}
	}, []);

	return (
		<FormProvider {...methods}>
			<PayPalCheckoutProvider shipping={shipping}>
				{isMobile ? (
					<CheckoutMobile updateOrder={updateOrder} />
				) : (
					<CheckoutDesktop updateOrder={updateOrder} />
				)}
				<PaymentErrorDialog error={paymentError} setError={setPaymentError} />
			</PayPalCheckoutProvider>
		</FormProvider>
	)
}

const getDefaultStep = (defaultValues: FormFields): Step => {
	const shippingOk = defaultValues.has_shipping ? defaultValues.shipping?.first_name && defaultValues.shipping?.last_name && defaultValues.shipping?.address_1 && defaultValues.shipping?.city && defaultValues.shipping?.postcode && defaultValues.shipping?.country : true
	const billingOk = defaultValues.billing.first_name && defaultValues.billing.last_name && defaultValues.billing.address_1 && defaultValues.billing.city && defaultValues.billing.postcode && defaultValues.billing.country
	const invoiceOk = defaultValues.invoice.billingChoice && defaultValues.invoice.invoiceType
	if (shippingOk && billingOk && invoiceOk)
		return "PAYMENT"
	if (shippingOk && billingOk)
		return "INVOICE"
	return "ADDRESS"
}

export default CheckoutGrid;