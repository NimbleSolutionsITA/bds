import {PayPalButtons, usePayPalCardFields} from "@paypal/react-paypal-js";
import AppleGooglePayButtons from "./AppleGooglePayButtons";
import usePayPalCheckout from "./PayPalCheckoutProvider";
import {useFormContext} from "react-hook-form";
import {Button, CircularProgress} from "@mui/material";
import {useTranslation} from "next-i18next";

const PaymentButtons = () => {
	const {onApprove, createOrder, shipping, setError} = usePayPalCheckout();
	const { watch } = useFormContext()
	const { customerNote, invoice, paymentMethod } = watch()
	return (
		<>
			{paymentMethod === 'paypal' && (
				<PayPalButtons
					createOrder={createOrder}
					onApprove={onApprove}
					onError={(error) => setError(error.message as any)}
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
			)}
			<AppleGooglePayButtons
				shipping={shipping}
				customerNote={customerNote}
				invoice={invoice}
				hideApplePay={paymentMethod !== 'applepay'}
				hideGooglePay={paymentMethod !== 'googlepay'}
			/>
			{paymentMethod === 'card' && (
				<SubmitPayment />
			)}
		</>
	)
}

const SubmitPayment = () => {
	const { cardFieldsForm, fields } = usePayPalCardFields();
	const { isPaying, setIsPaying} = usePayPalCheckout();
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

		cardFieldsForm.submit().catch(() => {
			setIsPaying(false);
		});
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