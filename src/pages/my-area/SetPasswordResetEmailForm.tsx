import { useMutation, gql } from "@apollo/client";
import {CircularProgress, TextField, Typography, Button} from "@mui/material";

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
	const wasEmailSent = Boolean(data?.sendPasswordResetEmail?.user?.databaseId);

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

	if (wasEmailSent) {
		return (
			<p> Please check your email. A password reset link has been sent to you.</p>
		);
	}

	return (
		<form method="post" onSubmit={handleSubmit} style={{padding: '40px 0'}}>
			<Typography textAlign="center" variant="h2" sx={{m: '20px 0', fontWeight: 'bold'}}>Accedi</Typography>
			<Typography>
				Enter the email associated with your account and you&#39;ll be sent a link
				to reset your password.
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
					{loading ? 'Sending...' : 'Send password reset email'}
				</Button>
			</fieldset>
		</form>
	);
}