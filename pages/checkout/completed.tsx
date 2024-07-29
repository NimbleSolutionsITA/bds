import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {getSSRTranslations} from "../../src/utils/wordpress_api";
import Head from "next/head";
import GoogleAnalytics from "../../src/components/GoogleAnalytics";
import { Box, Button, Container, IconButton, Typography} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import logo from "../../src/images/bottega-di-sguardi-logo.png";
import {CheckCircleOutlineSharp} from "@mui/icons-material";
import {useTranslation} from "next-i18next";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../src/redux/store";
import {destroyCart} from "../../src/redux/cartSlice";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_MEASUREMENT_ID;
const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

export default function CheckoutResult() {
	const { t } = useTranslation('common')
	const {locale} = useRouter()
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		dispatch(destroyCart())
	}, [dispatch]);
	return (
		<div style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
			<Head>
				{/* Set HTML language attribute */}
				<meta httpEquiv="content-language" content={locale} />
				<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
				<title>Bottega di Sguardi - Pagamento completato</title>
			</Head>
			<GoogleAnalytics />

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
				<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
					<CheckCircleOutlineSharp sx={{fontSize: '3rem', marginTop: (theme) => theme.spacing(2)}}/>
					<Typography variant="h4" component="h1" sx={{marginTop: (theme) => theme.spacing(2), textAlign: 'center'}}>
						{t('checkout.payment-success')}
					</Typography>
					<Typography variant="h6" component="h2" sx={{marginTop: (theme) => theme.spacing(2), textAlign: 'center'}}>
						{t('checkout.payment-success-body')}
					</Typography>
					<Button variant="contained" sx={{marginTop: (theme) => theme.spacing(4)}} component={Link} href="/">
						{t('checkout.back-home')}
					</Button>
				</Box>
			</Container>
		</div>
	)
}
export async function getStaticProps({ locale }: { locale: 'it' | 'en', params: {id: string}}) {
	const [
		ssrTranslations
	] = await Promise.all([
		getSSRTranslations(locale),
	]);
	return {
		props: {
			...ssrTranslations
		},
		revalidate: 10
	}
}

