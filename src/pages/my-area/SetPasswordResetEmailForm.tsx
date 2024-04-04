import { useMutation, gql } from "@apollo/client";
import {CircularProgress, TextField, Typography, Button} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {closeForgotPasswordDrawer} from "../../redux/layoutSlice";
import Dialog from "@mui/material/Dialog";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "next-i18next";

const SEND_PASSWORD_RESET_EMAIL = gql`
    mutation sendPasswordResetEmail($username: String!) {
        sendPasswordResetEmail(
            input: { username: $username }
        ) {
            user {
                databaseId
            }
        }
    }
`;

export default function SendPasswordResetEmailForm() {
	const [sendPasswordResetEmail, { loading, error, data }] = useMutation(
		SEND_PASSWORD_RESET_EMAIL
	);
	console.log(data)
	const [completedModalOpen, setCompletedModalOpen] = React.useState(false);
	const wasEmailSent = Boolean(data?.sendPasswordResetEmail?.user === null);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const { email } = Object.fromEntries(data);
		sendPasswordResetEmail({
			variables: {
				username: email,
			}
		}).catch(error => {
			console.error(error);
		});
	}
	useEffect(() => {
		if (wasEmailSent) {
			setCompletedModalOpen(true);
		}
	}, [wasEmailSent]);
	return (
		<form method="post" onSubmit={handleSubmit} style={{padding: '40px 0'}}>
			<Typography textAlign="center" variant="h2" sx={{m: '20px 0', fontWeight: 'bold'}}>{t('forgot-password.title')}</Typography>
			<Typography>
				{t('forgot-password.body')}
			</Typography>
			<fieldset disabled={loading} aria-busy={loading} style={{border: 'none', padding: 0}}>
				<TextField
					id="password-reset-email"
					fullWidth
					variant="outlined"
					label={"Email"}
					type="email"
					name="email"
					autoComplete="email"
					required
					sx={{mt: '20px'}}
					helperText={error?.message}
					error={!!error}
				/>
				<Button endIcon={loading ? <CircularProgress size="20px" /> : undefined} sx={{mt: '20px'}} fullWidth type="submit" disabled={loading}>
					{t(`forgot-password.${loading ? 'resetting' : 'reset'}`)}
				</Button>
			</fieldset>
			<Dialog
				open={completedModalOpen}
				onClose={() => setCompletedModalOpen(false)}
				aria-labelledby="forgot-password-success-dialog-title"
			>
				<DialogTitle id="alert-dialog-title">
					{t("forgot-password.completed.title")}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{t("forgot-password.completed.body")}

					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => {
						setCompletedModalOpen(false);
						dispatch(closeForgotPasswordDrawer())
					}}>
						{t('close')}
					</Button>
				</DialogActions>
			</Dialog>
		</form>
	);
}