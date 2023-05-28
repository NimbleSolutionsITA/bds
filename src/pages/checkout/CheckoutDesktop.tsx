import {Grid} from "@mui/material";
import Logo from "./Logo";
import AddressForm from "./AddressForm";
import Recap from "./Recap";
import Payment from "./Payment";
import {CheckoutComponentProps} from "./CheckoutGrid";

const CheckoutDesktop = ({
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
	const editAddress = (tab: number) => {
		setCheckoutStep(2)
		setTab(tab)
	}
	const payWithStripe = () => setCheckoutStep(4)
	return (
		<Grid container sx={{height: '100vh', position: 'relative'}}>
			<Grid item xs={12} md={7} sx={{display: 'flex', alignItems: 'flex-end', flexDirection: 'column'}}>
				<div
					style={{
						padding: '0 24px',
						width: '550px',
						maxWidth: '100%',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column'
					}}
				>
					<Logo />
					{checkoutStep === 2 ? (
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
					) : (
						<Payment
							order={order}
							isLoading={isLoading}
							editAddress={editAddress}
							setPaid={setPaid}
							checkoutStep={checkoutStep}
							setCheckoutStep={setCheckoutStep}
							stripePromise={stripePromise}
						/>
					)}
				</div>
			</Grid>
			<Grid item xs={12} md={5}
			      sx={{
				      backgroundColor: 'rgba(0,0,0,0.1)',
				      borderRight: '2px solid rgba(0,0,0,0.4)',
				      display: 'flex',
				      alignItems: 'flex-start',
				      flexDirection: 'column'
			      }}
			>
				<div style={{width: '100%', padding: '0 24px', maxWidth: '400px', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
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
						recapAction={checkoutStep === 2 ? setAddress : payWithStripe}
						checkoutStep={checkoutStep}
					/>
				</div>
			</Grid>
		</Grid>
	)
}

export default CheckoutDesktop