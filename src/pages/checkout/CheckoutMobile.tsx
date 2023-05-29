import Logo from "./Logo";
import AddressForm from "./AddressForm";
import Recap from "./Recap";
import {useState} from "react";
import {CheckoutComponentProps} from "./CheckoutGrid";
import Payment from "./Payment";
import {AnimatePresence, motion} from "framer-motion";
import {Button, Container, Grid} from "@mui/material";
import * as React from "react";
import PriceRecap from "./PriceRecap";

const CheckoutMobile = ({
	control,
	errors,
	countries,
	shippingCountry,
	billingCountry,
	hasShipping,
	setAddress,
	isLoading,
	setCoupon,
	shippingMethods,
	shippingMethod,
	prices,
	cartTotal,
    items,
	setError,
	tab,
	setTab,
	checkoutStep,
    setCheckoutStep,
    order,
	setPaid,
	stripePromise
}: CheckoutComponentProps) => {
	const [mobileCheckoutStep, setMobileCheckoutStep] = useState(1)
	const editAddress = (tab: number) => {
		setCheckoutStep(2)
		setMobileCheckoutStep(1)
		setTab(tab)
	}

	const handleChangeStep = async ( value: any) => {
		if (mobileCheckoutStep === 1) {
			await setAddress()
			if (errors.shipping || errors.billing)
				return
		}
		switch (value) {
			case 1:
				setCheckoutStep(2)
				setMobileCheckoutStep(1)
				break;
			case 2:
				setCheckoutStep(2)
				setMobileCheckoutStep(2)
				break;
			case 3:
				setCheckoutStep(3)
				setMobileCheckoutStep(3)
				break;
			case 4:
				setCheckoutStep(4)
				break;

		}
	}
	const StepContent = [
		<AddressForm
			key="address"
			control={control}
			errors={errors}
			countries={countries}
			shippingCountry={shippingCountry}
			billingCountry={billingCountry}
			hasShipping={hasShipping}
			isLoading={isLoading}
			setError={setError}
			tab={tab}
			setTab={setTab}
		/>,
		<Recap
			key="recap"
			control={control}
			setCoupon={setCoupon}
			shippingMethods={shippingMethods}
			shippingMethod={shippingMethod}
			prices={prices}
			subtotal={cartTotal}
			items={items}
			isLoading={isLoading}
			errors={errors}
			recapAction={() => setCheckoutStep(3)}
			checkoutStep={checkoutStep}
		/>,
		<Payment
			key="payment"
			order={order}
			isLoading={isLoading}
			editAddress={editAddress}
			setPaid={setPaid}
			checkoutStep={checkoutStep}
			setCheckoutStep={setCheckoutStep}
			stripePromise={stripePromise}
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


	return (
		<>
			<Container sx={{width: '100%', height: 'calc(100vh - 200px)', overflow: 'hidden scroll', paddingY: '20px'}}>
				<AnimatePresence custom={mobileCheckoutStep}>
					<motion.div
						key={mobileCheckoutStep}
						custom={mobileCheckoutStep}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							y: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 }
						}}
					>
						{StepContent[mobileCheckoutStep - 1]}
					</motion.div>
				</AnimatePresence>
			</Container>
			<Container sx={{width: '100%', height: '200px', paddingY: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.1)'}}>
				<PriceRecap
					subtotal={cartTotal}
					shipping={prices.shipping}
					discount={prices.discount}
					total={prices.total}
					totalTax={prices.totalTax}
					isLoading={isLoading}
				/>
				<Grid container sx={{marginTop: '5px'}} spacing={2}>
					{mobileCheckoutStep === 2 && (
						<Grid item xs={6}>
							<Button fullWidth onClick={() => handleChangeStep(mobileCheckoutStep - 1)}>
								INDIRIZZO
							</Button>
						</Grid>
					)}
					{mobileCheckoutStep < 3 && (
						<Grid item xs={mobileCheckoutStep === 1 ? 12 : 6}>
							<Button fullWidth onClick={() => handleChangeStep(mobileCheckoutStep + 1)}>
								{mobileCheckoutStep === 1 ? 'SPEDIZIONE' : 'PAGAMENTO'}
							</Button>
						</Grid>
					)}
					{mobileCheckoutStep === 3 && (
						<Grid item xs={12}>
							<Button fullWidth onClick={() => handleChangeStep(4)}>
								PAGA ORA
							</Button>
						</Grid>
					)}
				</Grid>
			</Container>
		</>
	)
}

export default CheckoutMobile