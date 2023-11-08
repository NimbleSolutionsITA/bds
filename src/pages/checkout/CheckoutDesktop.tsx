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
import {Step as StepType, Inputs, OrderIntent} from "./CheckoutGrid";
import {Check} from "@mui/icons-material";
import {useTranslation} from "next-i18next";
import {Country} from "../../types/woocommerce";
import {BaseSyntheticEvent, Dispatch, SetStateAction} from "react";

export type CheckoutDesktop = {
	countries: Country[]
	updateOrder: (e?: (BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
	isLoading: boolean
	tab: number
	setTab: Dispatch<SetStateAction<number>>
	checkoutStep: StepType
	setCheckoutStep: Dispatch<SetStateAction<StepType>>
}

const CheckoutDesktop = ({
	countries,
    updateOrder,
	isLoading,
	tab,
	setTab,
	checkoutStep,
	setCheckoutStep,
}: CheckoutDesktop) => {
	const { t } = useTranslation('common')
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
						activeStep={checkoutStep === 'ADDRESS' ? 0 : 1}
						connector={<CheckoutStepConnector />}
						sx={{width: '100%', marginBottom: '20px'}}
					>
						{[t('checkout.address'), t('checkout.payment')].map((label, index) => (
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
											fontWeight: (checkoutStep === 'ADDRESS' && index === 0) || (checkoutStep !== 'ADDRESS' && index === 1) ? 500 : 300
										}}
										onClick={async () => {
											if (checkoutStep !== 'ADDRESS' && index === 0)
												setCheckoutStep('ADDRESS')
											if (checkoutStep === 'ADDRESS' && index === 1)
												await updateOrder()
										}}
									>
										{label}
									</Button>
								</StepLabel>
							</Step>
						))}
					</Stepper>
					{checkoutStep === 'ADDRESS' ? (
						<AddressForm
							countries={countries}
							isLoading={isLoading}
							tab={tab}
							setTab={setTab}
						/>
					) : (
						<Payment
							isLoading={isLoading}
							editAddress={() => setCheckoutStep('ADDRESS')}
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