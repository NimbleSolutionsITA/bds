
import {Box, Button, Container, Typography} from "@mui/material";
import {WhatsApp, Email} from "@mui/icons-material";
import {HomeProps} from "../../../pages";

type BannerContactProps = {
	bannerContact: {
		title: string
		subtitle: string
		subtitle2: string
		whatsapp1: string
		whatsapp2: string
		email: string
	}
}

const BannerContact = ({bannerContact: { title, subtitle, subtitle2, email, whatsapp2, whatsapp1}}: BannerContactProps) => {
	return (
		<div style={{borderTop: '1px solid black', borderBottom: '1px solid black', padding: '50px 0'}}>
			<Container maxWidth="md" sx={{textAlign: 'center'}}>
				<Typography variant="h6" sx={{textTransform: 'uppercase'}}>
					{title}
				</Typography>
				<Typography variant="h1" sx={{padding: '10px 0 5px', maxWidth: '400px', margin: '0 auto'}}>
					{subtitle}
				</Typography>
				<Typography>
					{subtitle2}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						padding: '30px 0 0',
						gap: {
							xs: '20px',
							sm: '30px',
							md: '40px'
						},
						flexDirection: {
							xs: 'column',
							md: 'row'
						}
					}}
				>
					<WhatsAppButton label="Bottega di Sguardi" url={whatsapp1} />
					<WhatsAppButton label="Bottega di Sguardi - dentro" url={whatsapp2} />
					<EmailButton label="Email" email={email} />
				</Box>
			</Container>
		</div>
	)
}

type ContactButtonProps = {
	label: string
	url?: string
	email?: string
}
const WhatsAppButton = ({label, url}: ContactButtonProps) => {
	return (
		<Button
			fullWidth={false}
			sx={{
				margin: '0 auto',
				borderRadius: '3px',
				textTransform: 'none',
				padding: '12px 24px',
				fontWeight: 400,
				backgroundColor: '#25d366',
				'&:hover': {
					backgroundColor: '#2bba60'
				},
			}}
			component="a"
			href={url}
			target="_blank"
			startIcon={<WhatsApp />}
		>
			{label}
		</Button>
	)
}
const EmailButton = ({label, email}: ContactButtonProps) => {
	return (
		<Button
			sx={{
				margin: '0 auto',
				borderRadius: '3px',
				textTransform: 'none',
				padding: '12px 24px',
				fontWeight: 400,
				backgroundColor: '#A4A4A4',
				'&:hover': {
					backgroundColor: '#9b9595'
				},
			}}
			component="a"
			href={`mailto:${email}`}
			startIcon={<Email />}
			target="_blank"
		>
			{label}
		</Button>
	)
}

export default BannerContact