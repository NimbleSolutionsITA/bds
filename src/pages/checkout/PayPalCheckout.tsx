import {Dispatch, FC, SetStateAction, useState} from "react";
import {Box} from "@mui/material";
import {useTranslation} from "next-i18next";
import {
	PayPalButtons,
	PayPalCardFieldsForm,
	PayPalCardFieldsProvider, usePayPalCardFields,
} from "@paypal/react-paypal-js";
import {OnApproveData} from "@paypal/paypal-js";


const PayPalCheckout = () => {
	const { t } = useTranslation();
	const [isPaying, setIsPaying] = useState(false);

	async function createOrder() {
		console.log('createOrder')
		return Promise.resolve('test-order-id')
	}
	async function onApprove(data: OnApproveData) {
		console.log(data)
	}
	return (
		<Box sx={{display: 'flex', flexDirection: 'column', mt: '32px'}}>
			<PayPalButtons
				style={{
					shape: "rect",
					color: 'black',
					layout: "vertical",
					label: "pay",
				}}
				createOrder={createOrder}
				onApprove={onApprove}
				onError={console.log}
			/>

			<PayPalCardFieldsProvider
				createOrder={createOrder}
				onApprove={onApprove}
				onError={console.log}
			>
				<PayPalCardFieldsForm />
				<SubmitPayment isPaying={isPaying} setIsPaying={setIsPaying} />
			</PayPalCardFieldsProvider>
		</Box>
	);
};

const SubmitPayment: FC<{
	setIsPaying: Dispatch<SetStateAction<boolean>>;
	isPaying: boolean;
}> = ({ isPaying, setIsPaying }) => {
	const { cardFieldsForm, fields } = usePayPalCardFields();

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
		<button
			className={isPaying ? "btn" : "btn btn-primary"}
			style={{ float: "right" }}
			onClick={handleClick}
		>
			{isPaying ? <div className="spinner tiny" /> : "Pay"}
		</button>
	);
};


export default PayPalCheckout;