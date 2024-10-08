import {
	TableContainer,
	Button,
	TableCell,
	Table,
	TableRow,
	TableBody,
	Typography,
	FormControlLabel, RadioGroup, Radio
} from "@mui/material";
import {Dispatch, SetStateAction} from "react";
import Loading from "../../components/Loading";
import PayPal from "../../icons/PayPal2";
import {useTranslation} from "next-i18next";
import {Inputs, Step, Step as StepType} from "./CheckoutGrid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import Stripe from "../../icons/Stripe";
import {Controller, useFormContext} from "react-hook-form";
import Payments from "../../components/Payments";

type PaymentProps = {
	isLoading: boolean
	editAddress: (tab: number) => void
	checkoutStep: StepType
	setCheckoutStep: Dispatch<SetStateAction<StepType>>
}

const getAddressString = (address: any) => {
	return `${address.address_1}, ${address.postcode}, ${address.city} ${address.state}, ${address.country}`
}

const Payment = ({isLoading, editAddress, checkoutStep, setCheckoutStep}: PaymentProps) => {
	const {customer} = useSelector((state: RootState) => state.cart);

	const shippingAddress = getAddressString(customer.shipping.first_name ? customer.shipping : customer.billing);
	const billingAddress = getAddressString(customer.billing);
	const { t } = useTranslation('common')
	const { control } = useFormContext<Inputs>();

	return (
		<div style={{width: '100%', position: 'relative'}}>
			<TableContainer sx={{padding: '10px 20px', border: '1px solid rgba(0,0,0,0.1)'}}>
				<Table>
					<TableBody sx={{
						'& td': { padding: '8px 0' },
						'& tr:last-child td': { border: 0 }
					}}>
						<RecapRow
							label={t('checkout.contact')}
							value={`${customer?.billing.email}`}
							isLoading={isLoading}
							edit={() => {
								editAddress(0)
								setCheckoutStep('ADDRESS')
							}}
						/>
						<RecapRow
							label={t('checkout.ship-to')}
							value={shippingAddress ?? billingAddress}
							isLoading={isLoading}
							edit={() => {
								editAddress(shippingAddress ? 1 : 0)
								setCheckoutStep('ADDRESS')
							}}
						/>
						{shippingAddress && (
							<RecapRow
								label={t('checkout.bill-to')}
								value={billingAddress}
								isLoading={isLoading}
								edit={() => {
									editAddress(0)
									setCheckoutStep('ADDRESS')
								}}
							/>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Typography sx={{fontSize: '18px', fontWeight: 500, marginTop: '40px'}}>{t('checkout.select-payment')}</Typography>
			<Typography sx={{marginBottom: '20px'}}>{t('checkout.secured')}</Typography>
			<Controller
				name="payment_method"
				control={control}
				render={({ field: { onChange, value, onBlur }}) => (
					<RadioGroup
						aria-labelledby="payment-method-group"
						onChange={onChange}
						onBlur={onBlur}
						value={value}
					>
						<FormControlLabel
							value="cards"
							control={<Radio />}
							style={{height: '80px'}}
							label={(
								<div style={{fontSize: '16px', fontWeight: 'bold'}}>
									{t('cards')} <br />
									<Payments mt={0} hidePaypal/>
								</div>
							)}
						/>
						<FormControlLabel
							value="stripe"
							control={<Radio />}
							style={{height: '80px'}}
							label={(
								<div style={{display: 'flex', alignItems: 'center'}}>
									<Stripe sx={{fontSize: '50px'}} />
								</div>
							)}
						/>
						<FormControlLabel
							value="paypal"
							control={<Radio />}
							style={{height: '80px'}}
							label={(
								<div style={{display: 'flex', alignItems: 'center'}}>
									<PayPal sx={{fontSize: '80px'}} />
								</div>
							)}
						/>
					</RadioGroup>
				)}
			/>
		</div>
	)
}

export const PaymentErrorDialog = ({ error, setError}: {error?: string, setError: Dispatch<SetStateAction<string|undefined>>}) => {
	const { t } = useTranslation('common')
	return (
		<Dialog
			open={!!error}
			onClose={() => setError(undefined)}
			aria-labelledby="stripe-payment-error"
		>
			<DialogTitle id="alert-dialog-title">
				{"Payment error"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{error}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => {
					setError(undefined);
				}}>
					{t('close')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}


const EditButton = ({onClick}: {onClick: () => void}) => {
	const { t } = useTranslation('common')
	return (
		<Button
			sx={{textTransform: 'none', textDecoration: 'underline', padding: 0, minWidth: 0, fontWeight: 300}}
			size="small"
			variant="text"
			color="primary"
			onClick={onClick}
		>
			{t('edit')}
		</Button>
	)
}

const RecapRow = ({label, value, edit, isLoading}: {label: string, value: string, isLoading: boolean, edit: () => void}) => (
	<TableRow>
		<TableCell sx={{color: 'rgba(0,0,0,0.4)', width: '80px'}}>{label}</TableCell>
		<TableCell sx={{fontWeight: 300}}>
			{isLoading ? <Loading fontSize="20px" /> : value}
		</TableCell>
		<TableCell sx={{width: '80px'}} align="right"><EditButton onClick={edit} /></TableCell>
	</TableRow>
)

export default Payment;