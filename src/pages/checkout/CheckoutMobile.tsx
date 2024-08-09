import AddressForm from "./AddressForm";
import Recap from "./Recap";
import Payment from "./Payment";
import {AnimatePresence, motion} from "framer-motion";
import {Button, Container, Grid} from "@mui/material";
import * as React from "react";
import PriceRecap from "./PriceRecap";
import {useTranslation} from "next-i18next";
import Logo from "./Logo";
import  {CheckoutDesktopProps} from "./CheckoutDesktop";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {useRouter} from "next/router";
import InvoiceForm from "../../components/InvoiceForm";
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import {Inputs, Step as StepType, Step} from "./CheckoutGrid";
import {BaseSyntheticEvent} from "react";
import {useFormContext} from "react-hook-form";

const STEP_MAP = ['ADDRESS', 'INVOICE', 'RECAP', 'PAYMENT'] as const

export type CheckoutMobile = CheckoutDesktopProps
const CheckoutMobile = ({
	countries,
	updateOrder,
	isLoading,
	tab,
	setTab,
	checkoutStep,
    setCheckoutStep,
}: CheckoutMobile) => {
	const { cart } = useSelector((state: RootState) => state.cart);
	const mobileStep = STEP_MAP.indexOf(checkoutStep)
	const [focus, setFocus] = React.useState(false)
	const editAddress = (tab: number) => {
		setCheckoutStep('ADDRESS')
		setTab(tab)
	}
	const { watch } = useFormContext<Inputs>();
	const paymentMethod = watch('payment_method')
	const checkoutComponent = [
		<AddressForm
			key="address"
			countries={countries}
			isLoading={isLoading}
			tab={tab}
			setTab={setTab}
			setFocus={setFocus}
		/>,
		<InvoiceForm key="invoice" />,
		<Recap
			key="recap"
			isLoading={isLoading}
			checkoutStep={checkoutStep}
			setCheckoutStep={setCheckoutStep}
			updateOrder={updateOrder}
		/>,
		<Payment
			key="payment"
			isLoading={isLoading}
			editAddress={editAddress}
			checkoutStep={checkoutStep}
			setCheckoutStep={setCheckoutStep}
		/>
	]
	const variants = {
		enter: (direction: number): { y: number; opacity: number } => {
			return {
				y: direction > 0 ? 100 : -100,
				opacity: 0
			};
		},
		center: {
			y: 0,
			opacity: 1
		},
		exit: (direction: number): { y: number; opacity: number } => {
			return {
				y: direction < 0 ? 100 : -100,
				opacity: 0
			};
		}
	};

	const bottomBarHeight = Number(cart.totals?.discount_total ?? 0) > 0 ? '225px' : '200px'
	const stepButtonProps = { checkoutStep, setCheckoutStep, updateOrder, paymentMethod }
	return (
		<div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<Container sx={{width: '100%', flex: 1, overflow: 'hidden scroll', padding: '0 20px 250px 20px'}}>
				<div style={{width: '100%', textAlign: 'center'}}>
					<Logo sx={{margin: '10px'}} />
				</div>
				<AnimatePresence custom={mobileStep}>
					<motion.div
						key={mobileStep}
						custom={mobileStep}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							y: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 }
						}}
					>
						{checkoutComponent[mobileStep]}
					</motion.div>
				</AnimatePresence>
			</Container>
			{!focus && (
				<Container sx={{position: 'fixed', bottom: 0, width: '100%', height: bottomBarHeight, paddingY: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: '#e5e5e5', zIndex: 101}}>
					<PriceRecap isLoading={isLoading}/>
					<Grid container sx={{marginTop: '5px'}} spacing={2}>
						{mobileStep > 0 && (
							<StepButton isPrev {...stepButtonProps} />
						)}
						<StepButton {...stepButtonProps} />
					</Grid>
				</Container>
			)}
		</div>
	)
}

type StepButtonProps = {
	isPrev?: boolean,
	checkoutStep: Step,
	setCheckoutStep: (step: Step) => void
	updateOrder: (onValidStep: StepType) => (e?: (BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
	paymentMethod?: 'stripe'|'paypal'|'cards'
}
const StepButton = ({isPrev, checkoutStep, setCheckoutStep, updateOrder, paymentMethod}: StepButtonProps) => {
	const { t } = useTranslation('common')
	const mobileStep = STEP_MAP.indexOf(checkoutStep)
	const labelMap = ['address', 'invoice', 'shipping', 'payment', 'pay-now']
	const targetStep = isPrev ? mobileStep - 1 : mobileStep + 1
	const target = STEP_MAP[targetStep]
	const router = useRouter()
	const handleClick = async () => {
		if (targetStep === 4) {
			router.push('/checkout/' + paymentMethod)
			return
		}
		if (targetStep < 2) {
			await updateOrder(target)()
			return
		}
		setCheckoutStep(target)
	}

	const iconProps = isPrev ?
		{ startIcon: <ArrowBackIos /> } :
		{ endIcon: <ArrowForwardIos /> }
	return (
		<Grid item xs={mobileStep === 0 ? 12 : 6}>
			<Button fullWidth onClick={handleClick} {...iconProps}>
				{t(`checkout.${labelMap[targetStep]}`)}
			</Button>
		</Grid>
	)
}

export default CheckoutMobile