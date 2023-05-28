import Logo from "./Logo";
import AddressForm from "./AddressForm";
import Recap from "./Recap";
import {useState} from "react";
import {CheckoutComponentProps} from "./CheckoutGrid";
import Payment from "./Payment";
import { motion } from "framer-motion";
import {Button, Container} from "@mui/material";

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
	const isAddressStep = mobileCheckoutStep === 1 && checkoutStep === 2
	const isRecapStep = mobileCheckoutStep === 2 && checkoutStep === 2
	const isPaymentStep = checkoutStep > 2
	const editAddress = (tab: number) => {
		setCheckoutStep(2)
		setTab(tab)
	}
	const exitDirection = 100;
	return (
		<Container>
			<div style={{width: '100%', position: 'relative'}}>
				<motion.div
					key="address"
					style={{ position: 'absolute', width: '100%', marginTop: '20px' }}
					initial={{ x: exitDirection, opacity: 0 }}
					animate={{
						x: isAddressStep ? 0 : exitDirection,
						opacity: isAddressStep ? 1 : 0
					}}
					transition={{ duration: 0.5 }}
					exit={{ x: -exitDirection, opacity: 0 }}
				>
					<Logo sx={{margin: '20px auto'}} />
					<AddressForm
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
					/>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<Button size="small" variant="text" onClick={() => {
							setAddress()
							setMobileCheckoutStep(2)
						}}>Next</Button>
					</div>
				</motion.div>
				<motion.div
					key="recap"
					style={{ position: 'absolute', width: '100%', marginTop: '20px' }}
					initial={{ x: exitDirection, opacity: 0 }}
					animate={{
						x: isRecapStep ? 0 : exitDirection,
						opacity: isRecapStep ? 1 : 0
					}}
					transition={{ duration: 0.5 }}
					exit={{ x: -exitDirection, opacity: 0 }}
				>
					<Recap
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
					/>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<Button size="small" variant="text" onClick={() => setMobileCheckoutStep(1)}>Prev</Button>
					</div>
				</motion.div>
				<motion.div
					key="payment"
					style={{ position: 'absolute', width: '100%', marginTop: '20px' }}
					initial={{ x: exitDirection, opacity: 0 }}
					animate={{
						x: isPaymentStep ? 0 : exitDirection,
						opacity: isPaymentStep ? 1 : 0
					}}
					transition={{ duration: 0.5 }}
					exit={{ x: -exitDirection, opacity: 0 }}
				>
					<Payment
						order={order}
						isLoading={isLoading}
						editAddress={editAddress}
						setPaid={setPaid}
						checkoutStep={checkoutStep}
						setCheckoutStep={setCheckoutStep}
						stripePromise={stripePromise}
					/>
				</motion.div>
			</div>
		</Container>
	)
}

export default CheckoutMobile