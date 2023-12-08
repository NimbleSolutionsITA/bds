import {Container, Typography, Box, Backdrop, CircularProgress, IconButton, Button} from "@mui/material";
import {CheckCircleOutlineSharp, ErrorOutlineSharp} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import logo from "../../images/bottega-di-sguardi-logo.png";
import React from "react";
import {useTranslation} from "next-i18next";
import Head from "next/head";
import parse from "html-react-parser";
import {useRouter} from "next/router";
import GoogleAnalytics from "../../components/GoogleAnalytics";
import Script from "next/script";


type SuccessProps = {
	isSuccess: boolean
	isLoading?: boolean
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID;

const PaymentResult = ({isLoading, isSuccess}: SuccessProps) => {
	const { t } = useTranslation('common')
	const {locale} = useRouter()
	return (
		<div style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
			<Head>
				{/* Set HTML language attribute */}
				<meta httpEquiv="content-language" content={locale} />
				<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
				<title>Bottega di Sguardi - Pagamento completato</title>
			</Head>
			{GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}

			<IconButton
				component={Link}
				href="/"
				sx={{
					position: 'absolute',
					top: '30px',
					left: 'calc(50% - 83px)',
					'&:hover': {
						backgroundColor: 'inherit'
					}
				}}
			>
				<Image
					src={logo}
					alt="Logo Bottega di Sguardi"
					style={{ width: '150px', height: 'auto' }}
				/>
			</IconButton>
			<Container sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				{isLoading ? (
					<Backdrop
						sx={{ backgroundColor: 'rgba(255,255,255,0.75)', zIndex: (theme) => theme.zIndex.appBar - 2 }}
						open={true}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				) : (
					<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
						{isSuccess ?
							<CheckCircleOutlineSharp sx={{fontSize: '3rem', marginTop: (theme) => theme.spacing(2)}}/> :
							<ErrorOutlineSharp sx={{fontSize: '3rem', marginTop: (theme) => theme.spacing(2)}}/>
						}
						<Typography variant="h4" component="h1" sx={{marginTop: (theme) => theme.spacing(2), textAlign: 'center'}}>
							{isSuccess ?
								t('checkout.payment-success') : t('checkout.payment-failure')
							}
						</Typography>
						<Typography variant="h6" component="h2" sx={{marginTop: (theme) => theme.spacing(2), textAlign: 'center'}}>
							{isSuccess ?
								t('checkout.payment-success-body') :
								t('checkout.payment-failure-body')
							}
						</Typography>
						<Button variant="contained" sx={{marginTop: (theme) => theme.spacing(4)}} component={Link} href="/">
							{t('checkout.back-home')}
						</Button>
					</Box>
				)}
			</Container>
		</div>
	)
}

export default PaymentResult