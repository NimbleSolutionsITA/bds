import {Box, Button, Container, Typography} from "@mui/material";
import {WhatsApp, Email} from "@mui/icons-material";

const BannerContact = () => {
	return (
		<div style={{borderTop: '1px solid black', borderBottom: '1px solid black', padding: '50px 0'}}>
			<Container maxWidth="md" sx={{textAlign: 'center'}}>
				<Typography variant="h6">
					CONTATTACI
				</Typography>
				<Typography variant="h1" sx={{padding: '10px 0 5px'}}>
					I nostri consulenti sono<br />
					a tua completa disposizione
				</Typography>
				<Typography>
					Contattaci per qualsiasi richiesta
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
					<WhatsAppButton label="Bottega di Sguardi" phone="393496393775" />
					<WhatsAppButton label="Bottega di Sguardi - dentro" phone="393341577915" />
					<EmailButton label="Email" email="info@bottegadisguardi.com" />
				</Box>
			</Container>
		</div>
	)
}

type ContactButtonProps = {
	label: string
	phone?: string
	email?: string
}
const WhatsAppButton = ({label, phone}: ContactButtonProps) => {
	return (
		<Button
			fullWidth={false}
			sx={{
				margin: '0 auto',
				borderRadius: '3px',
				textTransform: 'none',
				padding: '12px 24px',
				fontWeight: 400,
				backgroundColor: '#69E19F',
				'&:hover': {
					backgroundColor: '#46b076'
				},
			}}
			component="a"
			href={`https://api.whatsapp.com/send?phone=${phone}text=Ciao!`}
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
		>
			{label}
		</Button>
	)
}

export default BannerContact