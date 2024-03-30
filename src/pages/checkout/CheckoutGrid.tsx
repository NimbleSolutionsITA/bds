import {useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {BillingData, Country, InvoiceData, ShippingClass, ShippingData} from "../../types/woocommerce";
import {SubmitErrorHandler, SubmitHandler} from "react-hook-form/dist/types/form";
import CheckoutDesktop from "./CheckoutDesktop";
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
	invoice: InvoiceData
};

export type Step = 'ADDRESS'|'INVOICE'|'PAYMENT_STRIPE'|'PAYMENT_PAYPAL'

const CheckoutGrid = ({ shipping }: CheckoutGridProps) => {
	const { cart, customer } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>()
	const [step, setStep] = useState<Step>('ADDRESS');
	const [addressTab, setAddressTab] = useState<number>(0);
	const methods = useForm<Inputs>({
		defaultValues: {
			has_shipping: false,
			billing: customer.billing,
			shipping: customer.shipping,
			invoice: customer.invoice,
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

export default CheckoutGrid;