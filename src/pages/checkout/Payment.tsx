import {
	TableContainer,
	Button,
	TableCell,
	Table,
	TableRow,
	TableBody,
} from "@mui/material";
import {Dispatch, SetStateAction} from "react";
import {useTranslation} from "next-i18next";
import {FormFields} from "./CheckoutGrid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { useFormContext} from "react-hook-form";
import PayPalCheckout from "./PayPalCheckout";

const getAddressString = (address: any) => {
	return `${address.address_1}, ${address.postcode}, ${address.city} ${address.state}, ${address.country}`
}

const Payment = () => {
	const { watch, setValue } = useFormContext<FormFields>();
	const { billing, shipping, has_shipping } = watch()

	const shippingAddress = getAddressString(has_shipping ? shipping : billing);
	const billingAddress = getAddressString(billing);
	const { t } = useTranslation('common')

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
							value={`${billing.email}`}
							edit={() => {
								setValue('addressTab', 0)
								setValue('step', 'ADDRESS')
							}}
						/>
						<RecapRow
							label={t('checkout.ship-to')}
							value={shippingAddress ?? billingAddress}
							edit={() => {
								setValue('addressTab', shippingAddress ? 1 : 0)
								setValue('step', 'ADDRESS')
							}}
						/>
						{shippingAddress && (
							<RecapRow
								label={t('checkout.bill-to')}
								value={billingAddress}
								edit={() => {
									setValue('addressTab', 0)
									setValue('step', 'ADDRESS')
								}}
							/>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<PayPalCheckout />
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

const RecapRow = ({label, value, edit}: {label: string, value: string, edit: () => void}) => (
	<TableRow>
		<TableCell sx={{color: 'rgba(0,0,0,0.4)', width: '80px'}}>{label}</TableCell>
		<TableCell sx={{fontWeight: 300}}>
			{value}
		</TableCell>
		<TableCell sx={{width: '80px'}} align="right"><EditButton onClick={edit} /></TableCell>
	</TableRow>
)

export default Payment;