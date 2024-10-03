import {
	Box,
	Button,
	Grid2 as Grid,
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
import {FormFields, Step as StepType} from "./CheckoutGrid";
import {Check} from "@mui/icons-material";
import {useTranslation} from "next-i18next";
import {BaseSyntheticEvent} from "react";
import InvoiceForm from "../../components/InvoiceForm";
import { useFormContext } from "react-hook-form";

export type CheckoutDesktopProps = {
	updateOrder: (onValidStep: StepType) => (e?: (BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
}

const STEP_MAP = ['ADDRESS', 'INVOICE', 'PAYMENT'] as const

const CheckoutDesktop = ({
    updateOrder,
}: CheckoutDesktopProps) => {
	const { t } = useTranslation('common')
	const { watch, setValue } = useFormContext<FormFields>()
	const checkoutStep = watch('step')
	const indexStep = STEP_MAP.indexOf(checkoutStep)
	const handleStepClick = (index: number) => async () => {
		const destinationStep = index > 2 ? 'PAYMENT' : STEP_MAP[index]
		if (destinationStep === checkoutStep)
			return
		if (checkoutStep === 'ADDRESS') {
			await updateOrder(destinationStep)()
			return
		}
		if (checkoutStep === 'INVOICE' && index !== 0) {
			await updateOrder(destinationStep)()
			return
		}
		setValue('step', destinationStep)
	}
	return (
		<Grid container sx={{height: '100vh', position: 'relative'}}>
			<Grid size={{xs: 12, md: 7}} sx={{display: 'flex', alignItems: 'flex-end', flexDirection: 'column'}}>
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
						activeStep={indexStep}
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
											fontWeight: indexStep === index ? 500 : 300
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
						<AddressForm />
					)}
					{checkoutStep === 'INVOICE' && (
						<InvoiceForm />
					)}
					{checkoutStep === 'PAYMENT' && (
						<Payment />
					)}
				</div>
			</Grid>
			<Grid
				size={{xs: 12, md: 5}}
			      sx={{
				      backgroundColor: 'rgba(0,0,0,0.1)',
				      borderRight: '2px solid rgba(0,0,0,0.4)',
				      display: 'flex',
				      alignItems: 'flex-start',
				      flexDirection: 'column'
			      }}
			>
				<div style={{width: '100%', padding: '0 24px', maxWidth: '400px', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
					<Recap updateOrder={updateOrder} />
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