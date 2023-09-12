import {Button, CircularProgress, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import MailchimpSubscribe, {EmailFormFields} from "react-mailchimp-subscribe"
import {regExpEmail} from "../utils/utils";
import Link from "./Link";
import HtmlBlock from "./HtmlBlock";

const NewsletterForm = () => {
	const [email, setEmail] = useState<string>('')
	const { t } = useTranslation('common');
	const [emailError, setEmailError] = useState<string | null>(null)
	const submit = (subscribe: (data: EmailFormFields) => void) => {
		if (!email) {
			setEmailError('email is required')
			return
		}
		if (regExpEmail.test(email)) {
			setEmailError(null)
			subscribe({ EMAIL: email })
		}
		else setEmailError('Invalid email address')
	}
	return (
		<MailchimpSubscribe
			url={process.env.NEXT_PUBLIC_MAILCHIMP || ''}
			render={({ subscribe, status, message }) => status !== 'success' ? (
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
					<Typography sx={{fontStyle: 'italic', fontSize: '13px', lineHeight: '1.3', marginTop: '10px'}}>
						<Trans i18nKey="newsletter.consentText" components={[<Link key={0} href="/privacy-policy" />]} />
					</Typography>
					<Button
						disabled={status === 'sending'}
						startIcon={status === 'sending' ? <CircularProgress /> : undefined  }
						onClick={() => submit(subscribe)}
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
			)}
		/>
	)
}

export default NewsletterForm