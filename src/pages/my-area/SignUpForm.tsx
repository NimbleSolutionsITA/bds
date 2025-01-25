import { useMutation, gql } from "@apollo/client";
import Link from "next/link";
import {TextField, Typography, Button, CircularProgress, Switch, FormControlLabel} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import {closeSignUpDrawer, openLogInDrawer} from "../../redux/layoutSlice";
import {useDispatch} from "react-redux";
import {Trans} from "react-i18next";
import React, {useEffect} from "react";
import {useTranslation} from "next-i18next";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import useAuth from "../../utils/useAuth";

const REGISTER_USER = gql`
    mutation registerUser(
        $email: String!
        $firstName: String!
        $lastName: String!
    ) {
        registerUser(
            input: {
                username: $email
                email: $email
                firstName: $firstName
                lastName: $lastName
            }
        ) {
            user {
                databaseId
            }
        }
    }
`;

export default function SignUpForm() {
	const {subscribeNewsletter} = useAuth();
	const [register, { data, loading, error }] = useMutation(REGISTER_USER);
	const wasSignUpSuccessful = Boolean(data?.registerUser?.user?.databaseId);
	const [completedModalOpen, setCompletedModalOpen] = React.useState(false);
	const { t } = useTranslation();
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const values = Object.fromEntries(data);
		if(values.newsletter === 'on' && values.email) {
			subscribeNewsletter(values.email as string)
		}
		register({
			variables: values,
		}).catch(error => {
			console.error(error);
		});
	}
	const dispatch = useDispatch();
	useEffect(() => {
		if (wasSignUpSuccessful) {
			setCompletedModalOpen(true);
		}
	}, [wasSignUpSuccessful]);

	return (
        <>
	        <form method="post" onSubmit={handleSubmit} style={{padding: '40px 0'}}>
				<Typography textAlign="center" variant="h2" sx={{mt: '20px', fontWeight: 'bold'}}>{t('register.title')}</Typography>
				<fieldset disabled={loading} aria-busy={loading} style={{border: 'none', padding: 0}}>
					<TextField
						fullWidth
						variant="outlined"
						label={t("form.name")}
						type="text"
						name="firstName"
						autoComplete="given-name"
						required
						sx={{mt: '20px'}}
					/>
					<TextField
						fullWidth
						variant="outlined"
						label={t("form.lastname")}
						type="text"
						name="lastName"
						autoComplete="family-name"
						required
						sx={{mt: '20px'}}
					/>
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
					<FormControlLabel
						sx={{ m: '20px 0 20px auto', width: '100%' }}
						control={<Switch name="newsletter" />}
						label={t("newsletter.title")}
						labelPlacement="start"
					/>
					<Typography sx={{fontStyle: 'italic', fontSize: '13px', lineHeight: '1.3', marginTop: '10px'}}>
						<Trans i18nKey="newsletter.consentText" components={[<Link key={0} href="/privacy-policy" />]} />
					</Typography>
					<Button
						type="submit"
						fullWidth
						disabled={loading} sx={{m: '20px 0'}}
						endIcon={loading ? <CircularProgress size="20px" /> : undefined}
					>
						{t(`register.${loading ? 'signing-up' : 'sign-up'}`)}
					</Button>
				</fieldset>
				{!!error && (
					(error.message.includes('wp-login.php') ? (
						<Typography color="red">
							{t('register.existing')} <Link href="/my-area">Log in</Link>
						</Typography>
					) : (
						<HtmlBlock html={error.message} sx={{color: 'red'}} />
					))
				)}
				<p>
					{t('register.existing2')} <Button variant="text" onClick={() => {
					dispatch(closeSignUpDrawer())
					dispatch(openLogInDrawer())
				}}>{t('log-in.title')}</Button>
				</p>
			</form>
	        <Dialog
		        open={completedModalOpen}
		        onClose={() => setCompletedModalOpen(false)}
		        aria-labelledby="register-success-dialog-title"
	        >
		        <DialogTitle id="alert-dialog-title">
			        {t("register.completed.title")}
		        </DialogTitle>
		        <DialogContent>
			        <DialogContentText id="alert-dialog-description">
				        {t("register.completed.body")}

			        </DialogContentText>
		        </DialogContent>
		        <DialogActions>
			        <Button onClick={() => {
				        setCompletedModalOpen(false);
				        dispatch(closeSignUpDrawer())
			        }}>
				        {t('close')}
			        </Button>
		        </DialogActions>
	        </Dialog>
        </>
	);
}