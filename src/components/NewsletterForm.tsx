import {Button, CircularProgress, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import {regExpEmail} from "../utils/utils";
import Link from "./Link";
import HtmlBlock from "./HtmlBlock";
import Checkbox from "./Checkbox";

const NewsletterForm = () => {
	const [email, setEmail] = useState<string>('')
	const { t } = useTranslation('common');
	const [emailError, setEmailError] = useState<string | null>(null)
	const [consentChecked, setConsentChecked] = useState<boolean>(true);
	const [status, setStatus] = useState<'ready' | 'sending' | 'success' | 'error'>('ready')
	const [message, setMessage] = useState<string | null>(null)
	const submit = async () => {
		setStatus('sending')
		if (!email) {
			setEmailError('email is required')
			return
		}
		if (!regExpEmail.test(email)) {
			setEmailError('Invalid email address')	
		}
		setEmailError(null)
			const response = await fetch(`/api/customer/newsletter?email=${email}`);
			if (response.status !== 200) {
				setMessage
			}
			const { subscribed, error } = await response.json()
			if (subscribed) {
				setStatus('success')
				setMessage('subscribed')
			}
			else if (error) {
				setMessage(error)
				setStatus('ready')
			}
	}
	return status !== 'success' ? (
		<form>
			<TextField
				required
				fullWidth
				label="Email"
				variant="outlined"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				helperText={emailError ?? (message && <HtmlBlock html={message.toString()} />)}
				error={!!emailError}
			/>
			<Checkbox
				checkboxProps={{
					checked: consentChecked,
					onChange: (e) => setConsentChecked(e.target.checked)
				}}
				formControlLabelProps={{
					label: (
						<Typography sx={{fontStyle: 'italic', fontSize: '13px', lineHeight: '1.3', marginTop: '10px'}}>
							<Trans i18nKey="newsletter.consentText" components={[<Link key={0} href="/privacy-policy" />]} />
						</Typography>
					)
				}}
			/>
			<Button
				disabled={status === 'sending' || !consentChecked}
				startIcon={status === 'sending' ? <CircularProgress /> : undefined  }
				onClick={submit}
				variant="contained"
				color="primary"
				fullWidth
				sx={{marginTop: '20px'}}
			>
				{t('subscribe')}
			</Button>
		</form>
	) : (
		<Typography variant="h5" sx={{margin: '25px 0'}}>
			{message}
		</Typography>
	)
}

export default NewsletterForm