import React from "react";
import {Box, Button, Dialog, Typography} from "@mui/material";
import {WarningAmberRounded} from "@mui/icons-material";
import {useTranslation} from "next-i18next";

type ErrorDialogProps = {
	open: boolean;
	title?: string;
	message?: string;
	onClose: () => void;
};

/**
 * Dialog d'errore condivisa (pagamento, carrello, ...) con icona di warning e
 * stile coerente col brand: angoli vivi, titolo serif, bottone nero uppercase.
 */
const ErrorDialog = ({open, title, message, onClose}: ErrorDialogProps) => {
	const {t} = useTranslation('common');
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="error-dialog-title"
			aria-describedby="error-dialog-description"
			PaperProps={{sx: {borderRadius: 0, maxWidth: 420, width: '100%', m: 2}}}
		>
			<Box sx={{
				p: {xs: 3, sm: 4},
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}>
				<Box sx={{
					width: 72,
					height: 72,
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'rgba(211, 47, 47, 0.08)',
					mb: 2.5,
				}}>
					<WarningAmberRounded sx={{fontSize: 40, color: 'error.main'}} />
				</Box>
				<Typography
					id="error-dialog-title"
					variant="h4"
					sx={{fontFamily: 'Ogg Roman, serif', mb: 1.5}}
				>
					{title ?? t('checkout.errors.title')}
				</Typography>
				<Typography
					id="error-dialog-description"
					sx={{color: 'rgba(0, 0, 0, 0.7)', mb: 3.5, lineHeight: 1.5, maxWidth: 320}}
				>
					{message}
				</Typography>
				<Button onClick={onClose} fullWidth autoFocus>
					{t('close')}
				</Button>
			</Box>
		</Dialog>
	);
};

export default ErrorDialog;
