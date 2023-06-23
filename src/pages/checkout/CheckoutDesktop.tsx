import {
	Box,
	Button,
	Divider,
	Grid,
	Step,
	StepConnector,
	stepConnectorClasses,
	StepIconProps,
	StepLabel, Stepper
} from "@mui/material";
import Logo from "./Logo";
import AddressForm from "./AddressForm";
import Recap from "./Recap";
import Payment from "./Payment";
import {CheckoutComponentProps} from "./CheckoutGrid";
import {Check} from "@mui/icons-material";


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
					<Logo sx={{margin: '10px'}} />
					<Stepper
						alternativeLabel
						activeStep={checkoutStep === 2 ? 0 : 1}
						connector={<CheckoutStepConnector />}
						sx={{width: '100%', marginBottom: '20px'}}
					>
						{['Indirizzo', 'Pagamento'].map((label, index) => (
							<Step key={label}>
								<StepLabel
									StepIconComponent={CheckoutStepIcon}
									sx={{
										'& .MuiStepLabel-label': {
											marginTop: 0
										},
									}}
								>
									<Button
										variant="text"
										sx={{
											fontSize: '16px',
											textTransform: 'none',
											fontWeight: (checkoutStep === 2 && index === 0) || (checkoutStep !== 2 && index === 1) ? 500 : 300
										}}
										onClick={async () => {
											if (checkoutStep !== 2 && index === 0)
												setCheckoutStep(2)
											if (checkoutStep === 2 && index === 1)
												await setAddress()
										}}
									>
										{label}
									</Button>
								</StepLabel>
							</Step>
						))}
					</Stepper>
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
const CheckoutStepConnector = () => (
	<StepConnector
		sx={{
			[`&.${stepConnectorClasses.alternativeLabel}`]: {
				top: 10,
				left: 'calc(-50% + 16px)',
				right: 'calc(50% + 16px)',
			},
			[`&.${stepConnectorClasses.active}`]: {
				[`& .${stepConnectorClasses.line}`]: {
					borderColor: '#000',
				},
			},
			[`&.${stepConnectorClasses.completed}`]: {
				[`& .${stepConnectorClasses.line}`]: {
					borderColor: '#000',
				},
			},
			[`& .${stepConnectorClasses.line}`]: {
				borderColor: '#eaeaf0',
				borderTopWidth: 3,
				borderRadius: 1,
			}
		}}
	/>
);
function CheckoutStepIcon(props: StepIconProps) {
	const { active, completed, className } = props;

	return (
		<Box
			sx={{
				color: '#eaeaf0',
				display: 'flex',
				height: 22,
				alignItems: 'center',
				...(active && {
					color: '#000',
				}),
				'& .CheckoutStepIcon-completedIcon': {
					color: '#000',
					zIndex: 1,
					fontSize: 18,
				},
				'& .CheckoutStepIcon-square': {
					width: 8,
					height: 8,
					backgroundColor: 'currentColor',
				},
			}}
			className={className}>
			{completed ? (
				<Check className="CheckoutStepIcon-completedIcon" />
			) : (
				<div className="CheckoutStepIcon-square" />
			)}
		</Box>
	);
}

export default CheckoutDesktop