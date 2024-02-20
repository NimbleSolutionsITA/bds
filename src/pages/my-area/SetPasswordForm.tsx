import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Link from "next/link";
import {CircularProgress, TextField, Typography, Button} from "@mui/material";

const RESET_PASSWORD = gql`
    mutation resetUserPassword(
        $key: String!
        $login: String!
        $password: String!
    ) {
        resetUserPassword(
            input: {
                key: $key
                login: $login
                password: $password
            }
        ) {
            user {
                databaseId
            }
        }
    }
`;

interface Props {
	resetKey: string;
	login: string;
}

export default function SetPasswordForm({ resetKey: key, login }: Props) {
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [clientErrorMessage, setClientErrorMessage] = useState('');
	const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD);
	const wasPasswordReset = Boolean(data?.resetUserPassword?.user?.databaseId);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const isValid = validate();
		if (!isValid) return

		resetPassword({
			variables: {
				key,
				login,
				password,
			},
		}).catch(error => {
			console.error(error);
		});
	}

	function validate() {
		setClientErrorMessage('');

		const isPasswordLongEnough = password.length >= 5;
		if (!isPasswordLongEnough) {
			setClientErrorMessage('Password must be at least 5 characters.');
			return false;
		}

		const doPasswordsMatch = password === passwordConfirm;
		if (!doPasswordsMatch) {
			setClientErrorMessage('Passwords must match.');
			return false;
		}

		return true;
	}

	if (wasPasswordReset) {
		return (
			<>
				<p>Your new password has been set.</p>
				<Link href="/log-in">
					<a>Log in</a>
				</Link>
			</>
		);
	}

	return (
		<form method="post" onSubmit={handleSubmit} style={{padding: '40px 0'}}>
			<Typography textAlign="center" variant="h2" sx={{mt: '20px', fontWeight: 'bold'}}>Imposta password</Typography>
			<fieldset disabled={loading} aria-busy={loading} style={{border: 'none', padding: 0}}>
				<TextField
					id="new-password"
					onChange={event => setPassword(event.target.value)}
					value={password}
					fullWidth
					variant="outlined"
					label={"Password"}
					type="password"
					name="password"
					autoComplete="new-password"
					required
					sx={{m: '20px 0 10px'}}
				/>
				<TextField
					id="password-confirm"
					onChange={event => setPasswordConfirm(event.target.value)}
					value={passwordConfirm}
					fullWidth
					variant="outlined"
					label={"Confirm password"}
					type="password"
					name="password"
					autoComplete="new-password"
					required
					sx={{m: '20px 0 10px'}}
				/>
				{clientErrorMessage ? (
					<p className="error-message">{clientErrorMessage}</p>
				) : null}
				{error ? (
					<p className="error-message">{error.message}</p>
				) : null}
				<Button endIcon={loading ? <CircularProgress size="20px" /> : undefined} sx={{mt: '20px'}} fullWidth type="submit" disabled={loading}>
					{loading ? 'Saving...' : 'Save password'}
				</Button>
			</fieldset>
		</form>
	);
}