import Link from "next/link";
import useAuth from "../../utils/useAuth";
import {TextField, Typography, Button, CircularProgress} from "@mui/material";
import {useDispatch} from "react-redux";
import {closeLogInDrawer, openForgotPasswordDrawer, openSignUpDrawer} from "../../redux/layoutSlice";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

export default function LogInForm() {
	const { t } = useTranslation();
	const { logIn, logInError: error, logInLoading: loading } = useAuth();
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
			username: email,
			password,
		}).catch(error => {
			console.error(error);
		});
	}
	const dispatch = useDispatch();
	const router = useRouter()
	const isCheckout = router.pathname.includes('checkout')

	return (
		<form method="post" onSubmit={handleSubmit} style={{padding: '40px 0'}}>
			<Typography textAlign="center" variant="h2" sx={{mt: '20px', fontWeight: 'bold'}}>{t('log-in.title')}</Typography>
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
				{!isCheckout && (
					<Link href="#" onClick={() => {
						dispatch(closeLogInDrawer())
						dispatch(openForgotPasswordDrawer())
					}}>
						{t('log-in.forgot-password')}
					</Link>
				)}
				{!isEmailValid ? (
					<Typography>{t('log-in.error.email')}</Typography>
				) : null}
				{!isPasswordValid ? (
					<Typography>{t('log-in.error.password')}</Typography>
				) : null}
				<Button endIcon={loading ? <CircularProgress size="20px" /> : undefined} sx={{mt: '20px'}} fullWidth type="submit" disabled={loading}>
					{t(`log-in.${loading ? 'logging-in' : 'title'}`)}
				</Button>
			</fieldset>
			{isCheckout ? (
				<p>
					{t('log-in.guest.title')}{' '}
					<Button disabled={loading} variant="text" onClick={() => {
						dispatch(closeLogInDrawer())
					}}>
						{t('log-in.guest.button')}
					</Button>
				</p>
			) : (
				<p>
					{t('log-in.register')}{' '}
					<Button variant="text" disabled={loading} onClick={() => {
						dispatch(closeLogInDrawer())
						dispatch(openSignUpDrawer())
					}}>
						{t('register.sign-up')}
					</Button>
				</p>
			)}
		</form>
	);
}