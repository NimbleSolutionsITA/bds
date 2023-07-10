import {Container, Typography, Box, Backdrop, CircularProgress, IconButton, Button} from "@mui/material";
import {CheckCircleOutlineSharp, ErrorOutlineSharp} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import logo from "../../images/bottega-di-sguardi-logo.png";
import React from "react";
import {useTranslation} from "next-i18next";


type SuccessProps = {
	isSuccess: boolean
	isLoading?: boolean
}

const PaymentResult = ({isLoading, isSuccess}: SuccessProps) => {
	const { t } = useTranslation('common')
	return (
		<div style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
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