import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import {useTranslation} from "next-i18next";
import {
	PayPalCardFieldsForm, PayPalMessages,
} from "@paypal/react-paypal-js";
import {Controller, useFormContext} from "react-hook-form";
import {FormFields, PAYMENT_METHODS} from "./CheckoutGrid";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import ApplePay from "../../icons/payments/ApplePay";
import GooglePay from "../../icons/payments/GooglePay";
import PayPal from "../../icons/payments/PayPal";
import CreditCard from "../../icons/payments/CreditCard";

const PayPalCheckout = () => {
	const { applePayConfig, googlePayConfig } = useSelector((state: RootState) => state.cart);
	const { t } = useTranslation();
	const {  control, watch } = useFormContext<FormFields>();
	const availablePaymentMethods = PAYMENT_METHODS.filter(m => {
		if (m === 'applepay' && (!applePayConfig?.isEligible || !window.ApplePaySession)) return false;
		return !(m === 'googlepay' && !googlePayConfig?.isEligible);
	})
	const { paymentMethod } = watch()
	return (
		<Box sx={{display: 'flex', flexDirection: 'column', mt: '32px'}}>
			<FormControl>
				<FormLabel>{t('select-payment')}</FormLabel>
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
			{paymentMethod === "card" && (
				<Box sx={{margin: "20px -6px 20px -6px"}}>
					<PayPalCardFieldsForm />
				</Box>
			)}
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