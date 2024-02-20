import Link from "next/link";
import { useMutation, gql } from "@apollo/client";

import { GET_USER } from "../../utils/useAuth";
import HelperText from "../../components/HelperText";
import {TextField, Typography, Button, CircularProgress} from "@mui/material";

const LOG_IN = gql`
    mutation logIn($login: String!, $password: String!) {
        loginWithCookies(input: {
            login: $login
            password: $password
        }) {
            status
        }
    }
`;

export default function LogInForm() {
	const [logIn, { loading, error }] = useMutation(LOG_IN, {
		refetchQueries: [
			{ query: GET_USER }
		],
	});
	const errorMessage = error?.message || '';
	const isEmailValid =
		!errorMessage.includes('empty_email') &&
		!errorMessage.includes('empty_username') &&
		!errorMessage.includes('invalid_email') &&
		!errorMessage.includes('invalid_username');
	const isPasswordValid =
		!errorMessage.includes('empty_password') &&
		!errorMessage.includes('incorrect_password');

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const { email, password } = Object.fromEntries(data);
		logIn({
			variables: {
				login: email,
				password,
			}
		}).catch(error => {
			console.error(error);
		});
	}

	return (
		<form method="post" onSubmit={handleSubmit} style={{padding: '40px 0'}}>
			<Typography textAlign="center" variant="h2" sx={{mt: '20px', fontWeight: 'bold'}}>Accedi</Typography>
			<fieldset disabled={loading} aria-busy={loading} style={{border: 'none', padding: 0}}>
				<TextField
					fullWidth
					variant="outlined"
					label={"Email"}
					type="email"
					name="email"
					autoComplete="username"
					required
					sx={{mt: '20px'}}
				/>
				<TextField
					fullWidth
					variant="outlined"
					label={"Password"}
					type="password"
					name="password"
					autoComplete="current-password"
					required
					sx={{m: '20px 0 10px'}}
				/>
				<Link href="/my-area/forgot-password">
					Forgot password?
				</Link>
				{!isEmailValid ? (
					<Typography>Invalid email. Please try again.</Typography>
				) : null}
				{!isPasswordValid ? (
					<Typography>Invalid password. Please try again.</Typography>
				) : null}
				<Button endIcon={loading ? <CircularProgress size="20px" /> : undefined} sx={{mt: '20px'}} fullWidth type="submit" disabled={loading}>
					{loading ? 'Logging in...' : 'Log in'}
				</Button>
			</fieldset>
			<p className="account-sign-up-message">
				Don&#39;t have an account yet?{' '}
				<Link href="/my-area/sign-up">
					Sign up
				</Link>
			</p>
		</form>
	);
}