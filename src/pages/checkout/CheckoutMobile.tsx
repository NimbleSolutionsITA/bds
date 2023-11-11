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

export type CheckoutMobile = CheckoutDesktopProps

const CheckoutMobile = ({
	countries,
	updateOrder,
	isLoading,
	tab,
	setTab,
	checkoutStep,
    setCheckoutStep,
	payWithStripe
}: CheckoutMobile) => {
	const { t } = useTranslation('common')
	const { cart } = useSelector((state: RootState) => state.cart);
	const mobileStep = checkoutStep === 'ADDRESS' ? 0 : checkoutStep === 'RECAP' ? 1 : 2
	const editAddress = (tab: number) => {
		setCheckoutStep('ADDRESS')
		setTab(tab)
	}

	const checkoutComponent = [
		<AddressForm
			key="address"
			countries={countries}
			isLoading={isLoading}
			tab={tab}
			setTab={setTab}
		/>,
		<Recap
			key="recap"
			isLoading={isLoading}
			checkoutStep={checkoutStep}
			setCheckoutStep={setCheckoutStep}
			updateOrder={updateOrder}
			payWithStripe={payWithStripe}
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
			<Container sx={{position: 'fixed', bottom: 0, width: '100%', height: bottomBarHeight, paddingY: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: '#e5e5e5', zIndex: 101}}>
				{checkoutStep !== 'ADDRESS' && <PriceRecap isLoading={isLoading}/>}
				<Grid container sx={{marginTop: '5px'}} spacing={2}>
					{checkoutStep === 'RECAP' && (
						<Grid item xs={6}>
							<Button fullWidth onClick={() => setCheckoutStep('ADDRESS')}>
								{t('checkout.address')}
							</Button>
						</Grid>
					)}
					{['ADDRESS', 'RECAP'].includes(checkoutStep) && (
						<Grid item xs={checkoutStep === 'ADDRESS' ? 12 : 6}>
							<Button fullWidth onClick={() => checkoutStep === 'ADDRESS' ? updateOrder() : setCheckoutStep('PAYMENT_STRIPE')}>
								{checkoutStep === 'ADDRESS' ? t('checkout.go-to-payment') : t('checkout.payment')}
							</Button>
						</Grid>
					)}
					{checkoutStep === 'PAYMENT_STRIPE' && (
						<Grid item xs={12}>
							<Button fullWidth onClick={() => payWithStripe()}>
								{t('checkout.pay-now')}
							</Button>
						</Grid>
					)}
				</Grid>
			</Container>
		</div>
	)
}

export default CheckoutMobile