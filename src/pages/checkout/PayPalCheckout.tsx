import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import {useTranslation} from "next-i18next";
import { PayPalCardFieldsForm, PayPalMessages } from "@paypal/react-paypal-js";
import {Controller, useFormContext} from "react-hook-form";
import {FormFields, PAYMENT_METHODS} from "./CheckoutGrid";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import ApplePay from "../../icons/payments/ApplePay";
import GooglePay from "../../icons/payments/GooglePay";
import PayPal from "../../icons/payments/PayPal";
import CreditCard from "../../icons/payments/CreditCard";
import usePayPalCheckout from "../../components/PayPalCheckoutProvider";


const DISABLE_BUTTONS = process.env.NEXT_PUBLIC_DISABLE_APPLE_GOOGLE_PAY_PAYMENTS === "true";

const PayPalCheckout = () => {
	const { applePayConfig, googlePayConfig } = useSelector((state: RootState) => state.cart);
	const { t } = useTranslation();
	const {  control, watch } = useFormContext<FormFields>();
	const {isPaying} = usePayPalCheckout()
	const availablePaymentMethods = PAYMENT_METHODS.filter(m => {
		if (m === 'applepay' && (!applePayConfig?.isEligible || !window.ApplePaySession || DISABLE_BUTTONS)) return false;
		return !(m === 'googlepay' && (!googlePayConfig?.isEligible || DISABLE_BUTTONS))
	})
	const { paymentMethod } = watch()
	return (
		<Box sx={{display: 'flex', flexDirection: 'column', mt: '16px'}}>
			<FormControl disabled={isPaying}>
				<FormLabel sx={{fontWeight: 500, fontSie: '14px', color: "rgba(0, 0, 0, 0.87)", marginBottom: '8px'}}>
					{t('checkout.payment-method')}: {t(`checkout.payment-methods.${paymentMethod}`)}
				</FormLabel>
				<Controller
					rules={{ required: true }}
					control={control}
					name="paymentMethod"
					render={({ field }) => (
						<RadioGroup {...field} row>
							{availablePaymentMethods.map((method) => (
								<FormControlLabel
									key={method}
									value={method}
									control={<Radio />}
									label={radioButtons(method === paymentMethod, method)}
								/>
							))}
						</RadioGroup>
					)}
				/>
			</FormControl>
			<PayPalMessages />
			<Box sx={{margin: "20px -6px 20px -6px", display: paymentMethod === "card" ? "block" : "none" }}>
				<PayPalCardFieldsForm />
			</Box>
		</Box>
	);
};

const radioButtonProps = {
	sx: {
		height: 'auto',
		width: '70px'
	}
}

const radioButtons = (selected: boolean, method: string) => ({
	applepay: <ApplePay {...radioButtonProps} selected={selected} />,
	googlepay: <GooglePay {...radioButtonProps} selected={selected} />,
	card: <CreditCard {...radioButtonProps} selected={selected} />,
	paypal: <PayPal {...radioButtonProps} selected={selected} />
}[method])

export default PayPalCheckout;