import {PayPalButtons, usePayPalCardFields} from "@paypal/react-paypal-js";
import {useFormContext} from "react-hook-form";
import {Box, Button, CircularProgress} from "@mui/material";
import {useTranslation} from "next-i18next";
import usePayPalCheckout from "../../components/PayPalCheckoutProvider";
import AppleGooglePayButtons from "../../components/AppleGooglePayButtons";

const PaymentButtons = () => {
	const {onApprove, createOrder, shipping, onError} = usePayPalCheckout();
	const { watch } = useFormContext()
	const { customerNote, invoice, paymentMethod } = watch()
	return (
		<>
			<Box sx={{display: paymentMethod === "paypal" ? "block" : "none" }}>
				<PayPalButtons
					createOrder={createOrder}
					onApprove={onApprove}
					onCancel={onError}
					onError={onError}
					style={{
						color: "black",
						shape: "rect",
					}}
					message={{
						amount: invoice.total,
						align: "center",
						color: "black",
						position: 'top'
					}}
				/>
			</Box>
			<AppleGooglePayButtons
				shipping={shipping}
				customerNote={customerNote}
				invoice={invoice}
				hideApplePay={paymentMethod !== 'applepay'}
				hideGooglePay={paymentMethod !== 'googlepay'}
			/>
			<Box sx={{display: paymentMethod === "card" ? "block" : "none" }}>
				<SubmitPayment />
			</Box>
		</>
	)
}

const SubmitPayment = () => {
	const { cardFieldsForm, fields } = usePayPalCardFields();
	const { isPaying, setIsPaying, onError} = usePayPalCheckout();
	const { t } = useTranslation()

	const handleClick = async () => {
		if (!cardFieldsForm) {
			const childErrorMessage =
				"Unable to find any child components in the <PayPalCardFieldsProvider />";

			throw new Error(childErrorMessage);
		}
		const formState = await cardFieldsForm.getState();

		if (!formState.isFormValid) {
			return alert("The payment form is invalid");
		}
		setIsPaying(true);

		cardFieldsForm.submit().catch(onError);
	};

	return (
		<Button
			fullWidth
			disabled={isPaying}
			onClick={handleClick}
			startIcon={isPaying && <CircularProgress thickness={5} size={18} />}
		>
			{t('checkout.pay-with-card')}
		</Button>
	);
};

export default PaymentButtons