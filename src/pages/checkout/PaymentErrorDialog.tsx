import {Dispatch, SetStateAction} from "react";
import {useTranslation} from "next-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {Button} from "@mui/material";


const PaymentErrorDialog = ({ error, setError}: {error?: string, setError: Dispatch<SetStateAction<string|undefined>>}) => {
	const { t } = useTranslation('common')
	return error && (
		<Dialog
			open={true}
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

export default PaymentErrorDialog