import {
	Box, Button, Divider,
} from "@mui/material";
import {useFormContext} from "react-hook-form";
import {Step as StepType, Step} from "./CheckoutGrid";
import Payments from "../../components/Payments";
import PriceRecap from "./PriceRecap";
import {useTranslation} from "next-i18next";
import {BaseSyntheticEvent} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import CartRecap from "./CartRecap";
import CartCoupon from "./CartCoupon";
import CartShippingRate from "./CartShippingRate";
import CartNote from "./CartNote";
import PaymentButtons from "./PaymentButtons";

type RecapProps = {
	updateOrder: (step: Step) => (e?: (BaseSyntheticEvent | undefined)) => Promise<void>
}

const buttonLabel = {
	ADDRESS: 'checkout.go-to-invoice',
	INVOICE: 'checkout.go-to-payment',
	PAYMENT: 'checkout.pay-now'
}
const Recap = ({updateOrder}: RecapProps) => {
	const { watch } = useFormContext();
	const { t } = useTranslation('common');
	const { loading } = useSelector((state: RootState) => state.cart);
	const checkoutStep = watch('step') as StepType

	const handleContinue = async () => {
		switch (checkoutStep) {
			case 'ADDRESS':
				await updateOrder('INVOICE')()
				break
			case 'INVOICE':
				await updateOrder('PAYMENT')()
				break;
			case 'PAYMENT':
				break;
		}
	}

	return (
		<Box sx={{padding: {xs: '0 0 20px', md: '30px 0 20px'}, width: '100%', display: 'flex', flexDirection: 'column'}}>
			<CartRecap />
			<Divider sx={{margin: '5px 0'}} />
			<CartCoupon />
			<Divider sx={{margin: '5px 0'}} />
			<CartShippingRate />
			<Divider sx={{margin: '5px 0'}} />
			<CartNote />
			<Divider sx={{margin: '5px 0'}} />
			<PriceRecap isLoading={loading} />
			<Divider sx={{margin: '10px 0 20px'}} />
			<Box width="100%" display={checkoutStep === "PAYMENT" ? "block" : "none"}>
				<PaymentButtons />
			</Box>
			<Box width="100%" display={checkoutStep === "PAYMENT" ? "none" : "block"}>
				<Button
					fullWidth
					variant="contained"
					color="primary"
					onClick={handleContinue}
				>
					{t(buttonLabel[checkoutStep])}
				</Button>
			</Box>
			<Payments />
		</Box>
	)
}

export default Recap