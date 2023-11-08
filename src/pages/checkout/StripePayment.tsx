import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {WooOrder} from "../../types/woocommerce";

type StripePaymentProps = {
	isReadyToPay: boolean,
	setIsReadyToPay: Dispatch<SetStateAction<boolean>>
	setPaymentError: Dispatch<SetStateAction<string | undefined>>
	wooOrder?: WooOrder
}

const StripePayment = ({setPaymentError, wooOrder, isReadyToPay, setIsReadyToPay}: StripePaymentProps) => {

	return (
		<PaymentElement
			id="payment-element"
			options={{
				layout: {
					type: 'accordion',
					radios: true,
					spacedAccordionItems: true,
					defaultCollapsed: false,
				},
				defaultValues: {
					billingDetails: {
						name: `${wooOrder?.billing.first_name} ${wooOrder?.billing.last_name}`,
						email: wooOrder?.billing.email,
						phone: wooOrder?.billing.phone,
						address: {
							line1: wooOrder?.billing.address_1,
							city: wooOrder?.billing.city,
							state: wooOrder?.billing.state,
							postal_code: wooOrder?.billing.postcode,
							country: wooOrder?.billing.country,
						},
					}
				},
			}}
		/>
	)
}

export default StripePayment