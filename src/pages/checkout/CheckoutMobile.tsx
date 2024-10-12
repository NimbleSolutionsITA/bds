import AddressForm from "./AddressForm";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button, CircularProgress,
	Divider, IconButton,
	MobileStepper,
	Typography
} from "@mui/material";
import * as React from "react";
import  {CheckoutDesktopProps} from "./CheckoutDesktop";
import InvoiceForm from "../../components/InvoiceForm";
import { KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material';
import {FormFields} from "./CheckoutGrid";
import {useFormContext} from "react-hook-form";
import {useTranslation} from "next-i18next";
import CartCoupon from "./CartCoupon";
import CartShippingRate from "./CartShippingRate";
import CartNote from "./CartNote";
import CartRecap from "./CartRecap";
import {ReactNode, useState} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PayPalCheckout from "./PayPalCheckout";
import CartAddressRecap from "./CartAddressRecap";
import PriceRecap from "./PriceRecap";
import logo from "../../images/bottega-di-sguardi-logo.png";
import Image from "next/image";
import PaymentButtons from "./PaymentButtons";
import usePayPalCheckout from "../../components/PayPalCheckoutProvider";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

const STEP_MAP = ['ADDRESS', 'INVOICE', 'PAYMENT'] as const

export type CheckoutMobile = CheckoutDesktopProps
const CheckoutMobile = ({ updateOrder }: CheckoutMobile) => {
	const { watch, setValue } = useFormContext<FormFields>()
	const { t } = useTranslation('common');
	const {isPaying} = usePayPalCheckout()
	const { loading } = useSelector((state: RootState) => state.cart);
	const {step: checkoutStep, paymentMethod, billing: { email }} = watch()
	const activeStep = STEP_MAP.indexOf(checkoutStep)
	const [expandPrice, setExpandPrice] = useState(false)

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 8px 160px'}}>
			<Box sx={{textAlign: 'center', marginBottom: '8px'}}>
				<Image
					src={logo}
					alt="Logo Bottega di Sguardi"
					style={{ width: '60px', height: 'auto' }}
				/>
			</Box>
			<Box sx={{width: '100%', display: checkoutStep === 'ADDRESS' ? "block": "none"}}>
				<AddressForm />
			</Box>
			<Box sx={{width: '100%', display: checkoutStep === 'INVOICE' ? "block": "none"}}>
				<InvoiceForm />
				<Divider sx={{margin: '5px 0'}} />
				<CartCoupon />
				<Divider sx={{margin: '5px 0'}} />
				<CartShippingRate />
				<Divider sx={{margin: '5px 0'}} />
				<CartNote />
			</Box>
			<Box sx={{width: '100%', display: checkoutStep === 'PAYMENT' ? "block": "none"}}>
				<AccordionRecap title={email}>
					<CartAddressRecap />
				</AccordionRecap>
				<AccordionRecap title={t('checkout.item-recap')}>
					<CartRecap />
				</AccordionRecap>
				<Divider />
				<PayPalCheckout />
				<Box sx={{marginTop: paymentMethod === 'card' ? 0 : '32px', width: '100%'}}>
					<PaymentButtons />
				</Box>
			</Box>
			<Box
				sx={{
					backgroundColor: "#eeeeee",
					position: "fixed",
					width: '100%',
					bottom: '50px',
					padding: '8px',
					left: 0,
					zIndex: 1
				}}
			>
				<IconButton
					size="small"
					onClick={() => setExpandPrice(!expandPrice)}
					sx={{
						position: 'absolute',
						top: 0,
						left: '50%',
						transform: "translate(-50%, -50%)",
						backgroundColor: "#ffffff",
						border: "2px solid #eeeeee",
						"&:hover": {
							backgroundColor: "#ffffff",
						}
					}}
				>
					<ExpandMoreIcon
						sx={{
							transform: expandPrice ? "rotate(0deg)" : "rotate(180deg)",
							transition: 'transform 0.3s ease'
						}}
					/>
				</IconButton>
				<PriceRecap isLoading={false} isCompact={!expandPrice} />
			</Box>
			<MobileStepper
				variant="progress"
				steps={3}
				position="bottom"
				activeStep={activeStep}
				sx={{
					backgroundColor: "#eeeeee"
				}}
				LinearProgressProps={{
					sx: {
						position: "fixed",
						width: "100%",
						top: 0,
						left: 0
					}
				}}
				nextButton={
					<Button
						sx={{padding: '8px 24px 8px 32px'}}
						size="small"
						onClick={updateOrder(STEP_MAP[activeStep + 1])}
						disabled={checkoutStep === "PAYMENT" || isPaying || loading}
						endIcon={(loading|| isPaying) && <CircularProgress size={12} />}
					>
						{t(`checkout.${(STEP_MAP[activeStep + 1] ?? "PAYMENT").toLowerCase()}`)}
						<KeyboardArrowRight />
					</Button>
				}
				backButton={
					<Button
						sx={{padding: '8px 32px 8px 24px'}}
						size="small"
						onClick={() => setValue('step', STEP_MAP[activeStep - 1])}
						disabled={activeStep === 0 || isPaying || loading}
						endIcon={(loading|| isPaying) && <CircularProgress size={12} />}
					>
						<KeyboardArrowLeft />
						{t(`checkout.${(STEP_MAP[activeStep - 1] ?? "ADDRESS").toLowerCase()}`)}
					</Button>
				}
			/>
		</Box>
	)
}

const AccordionRecap = ({children, title}: {children: ReactNode, title: string}) => (
	<Accordion
		elevation={0}
		sx={{
			"&.Mui-expanded": {
				margin: 0
			}
		}}
	>
		<AccordionSummary
			sx={{
				padding: 0,
				"& .MuiAccordionSummary-content.Mui-expanded": {
					margin: '12px 0'
				},
				"&.Mui-expanded": {
					minHeight: '48px'
				}
			}}
			expandIcon={<ExpandMoreIcon />}
			aria-controls="panel1-content"
			id="panel1-header"
		>
			<Typography sx={{fontWeight: 500}}>{title}</Typography>
		</AccordionSummary>
		<AccordionDetails sx={{padding: "8px 0"}}>
			{children}
		</AccordionDetails>
	</Accordion>
)

export default CheckoutMobile