import {
	Box,
	Button,
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
import {Step as StepType} from "./CheckoutGrid";
import {Check} from "@mui/icons-material";
import {useTranslation} from "next-i18next";
import {Country} from "../../types/woocommerce";
import {BaseSyntheticEvent, Dispatch, SetStateAction} from "react";
import InvoiceForm from "../../components/InvoiceForm";

export type CheckoutDesktopProps = {
	countries: Country[]
	updateOrder: (onValidStep: StepType) => (e?: (BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
	isLoading: boolean
	tab: number
	setTab: Dispatch<SetStateAction<number>>
	checkoutStep: StepType
	setCheckoutStep: Dispatch<SetStateAction<StepType>>
}

const getStep = (checkoutStep: StepType) => {
	switch (checkoutStep) {
		case 'ADDRESS':
			return 0
		case 'INVOICE':
			return 1
		default:
			return 2
	}
}

const getCheckoutStep = (index: number): StepType => {
	switch (index) {
		case 0:
			return 'ADDRESS'
		case 1:
			return 'INVOICE'
		default:
			return 'PAYMENT_STRIPE'
	}
}

const CheckoutDesktop = ({
	countries,
    updateOrder,
	isLoading,
	tab,
	setTab,
	checkoutStep,
	setCheckoutStep,
}: CheckoutDesktopProps) => {
	const { t } = useTranslation('common')
	const handleStepClick = (index: number) => async () => {
		const step = getStep(checkoutStep)
		const destinationStep = getCheckoutStep(index)
		if (index === step)
			return
		if (step === 0) {
			await updateOrder(destinationStep)()
			return
		}
		if (step === 1 && index !== 0) {
			await updateOrder(destinationStep)()
			return
		}
		setCheckoutStep(destinationStep)
	}
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
						activeStep={getStep(checkoutStep)}
						connector={<CheckoutStepConnector />}
						sx={{width: '100%', marginBottom: '20px'}}
					>
						{[t('checkout.address'), t('checkout.invoice'), t('checkout.payment')].map((label, index) => (
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
											fontWeight: getStep(checkoutStep) === index ? 500 : 300
										}}
										onClick={handleStepClick(index)}
									>
										{label}
									</Button>
								</StepLabel>
							</Step>
						))}
					</Stepper>
					{checkoutStep === 'ADDRESS' && (
						<AddressForm
							countries={countries}
							isLoading={isLoading}
							tab={tab}
							setTab={setTab}
						/>
					)}
					{checkoutStep === 'INVOICE' && (
						<InvoiceForm />
					)}
					{['PAYMENT_STRIPE', 'PAYMENT_PAYPAL'].includes(checkoutStep) && (
						<Payment
							isLoading={isLoading}
							editAddress={setTab}
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
						isLoading={isLoading}
						checkoutStep={checkoutStep}
						setCheckoutStep={setCheckoutStep}
						updateOrder={updateOrder}
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