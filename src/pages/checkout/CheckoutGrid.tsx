import {useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {BillingData, Country, InvoiceData, LoggedCustomer, ShippingClass, ShippingData} from "../../types/woocommerce";
import {SubmitErrorHandler, SubmitHandler} from "react-hook-form/dist/types/form";
import CheckoutDesktop from "./CheckoutDesktop";
import {useMediaQuery, useTheme} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {setCustomerData, updateShippingCountry} from "../../redux/cartSlice";
import CheckoutMobile from "./CheckoutMobile";
import {PaymentErrorDialog} from "./Payment";
import useAuth from "../../utils/useAuth";

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
	invoice: InvoiceData
	payment_method: 'paypal'|'stripe'
};

export type Step = 'ADDRESS'|'INVOICE'|'RECAP'|'PAYMENT'

const CheckoutGrid = ({ shipping }: CheckoutGridProps) => {
	const { cart, customer } = useSelector((state: RootState) => state.cart);
	const { customer: loggedCustomer, updateCustomer ,loggedIn } = useAuth();
	const dispatch = useDispatch<AppDispatch>()
	const [step, setStep] = useState<Step>('ADDRESS');
	const [addressTab, setAddressTab] = useState<number>(0);
	const methods = useForm<Inputs>({
		defaultValues: {
			has_shipping: getCustomerMetaData('has_shipping', false, loggedCustomer),
			billing: customer.billing,
			shipping: customer.shipping,
			invoice: {
				vat: getCustomerMetaData('vat', customer.invoice.vat, loggedCustomer),
				tax: getCustomerMetaData('tax', customer.invoice.tax, loggedCustomer),
				sdi: getCustomerMetaData('sdi',  customer.invoice.sdi, loggedCustomer),
				billingChoice: getCustomerMetaData('billing_choice', customer.invoice.billingChoice, loggedCustomer),
				invoiceType: getCustomerMetaData('invoice_type', customer.invoice.invoiceType, loggedCustomer)
			},
			payment_method: 'stripe'
		},
		reValidateMode: 'onSubmit'
	});
	const { handleSubmit } = methods
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [paymentError, setPaymentError] = useState<string>();

	const onValid = (onValidStep: Step): SubmitHandler<Inputs> => (data)  => {
		if (data && data.shipping && data.billing) {
			const deliveryCountry = data.has_shipping ? data.shipping.country : data.billing.country;
			const orderDeliveryCountry = cart.customer?.shipping_address.shipping_country
			if (deliveryCountry !== orderDeliveryCountry) {
				dispatch(updateShippingCountry({ country: deliveryCountry }))
			}
			dispatch(setCustomerData({
				billing: data.billing,
				shipping: data.has_shipping ? data.shipping : data.billing,
				invoice: data.invoice
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
			setStep(onValidStep);
		}
	}

	const onInvalid: SubmitErrorHandler<Inputs> = (data) => {
		if (data.shipping || data.billing)
			setAddressTab(data.shipping ? 1 : 0);
		if (data.invoice)
			setStep('INVOICE');
	}

	const updateOrder = (onValidStep: Step) => handleSubmit(onValid(onValidStep), onInvalid);

	const checkoutProps = {
		countries: shipping.countries,
		isLoading: false,
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

const getCustomerMetaData = (key: string, fallback: any, customer?: LoggedCustomer) => {
	return customer?.meta_data.find(({key: k}) => k === key)?.value ?? fallback
}

export default CheckoutGrid;