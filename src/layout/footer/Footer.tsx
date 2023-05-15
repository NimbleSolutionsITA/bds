import {Button, Container, Grid, IconButton, Typography} from "@mui/material";
import logo from "../../images/bottega-di-sguardi-logo.png";
import googleReviews from "../../images/google-reviews.png";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";
import Image from "next/image";
import React, {MouseEvent} from "react";
import {useRouter} from "next/router";
import AmericanExpress from "../../icons/AmericanExpress";
import ApplePay from "../../icons/ApplePay";
import GooglePay from "../../icons/GooglePay";
import Maestro from "../../icons/Maestro";
import Mastercard from "../../icons/Mastercard";
import PayPal from "../../icons/PayPal";
import Visa from "../../icons/Visa";
import {GooglePlaces} from "../../../pages/api/google-places";
import Star from "../../icons/Star";
import GoogleG from "../../icons/GoogleG";
import FavoriteIcon from '@mui/icons-material/Favorite';


type FooterProps = {
	googlePlaces: GooglePlaces
}

const Footer = ({googlePlaces}: FooterProps) => {
	return (
		<Container component="footer" sx={{padding: '24px 20px', position: 'relative', zIndex: (theme) => theme.zIndex.appBar - 2, backgroundColor: '#fff'}}>
			<Grid container>
				<Grid item xs={12} md={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<LogoButton />
				</Grid>
				<Grid item xs={12} sm={6} md={3} sx={{padding: '0 14px', textAlign: {xs: 'center', md: 'left'}}}>
					<GoogleAddress whatsApp="349 6393775" name="BOTTEGA DI SGUARDI" address={googlePlaces.main} />
				</Grid>
				<Grid item xs={12} sm={6} md={3} sx={{padding: '0 14px', textAlign: {xs: 'center', md: 'left'}}}>
					<GoogleAddress whatsApp="334 1577915" name="BOTTEGA DI SGUARDI - DENTRO" address={googlePlaces.secondary} />
				</Grid>
			    <Grid item xs={12} md={3} sx={{padding: '0 14px', textAlign: 'center'}}>
				    <GoogleReviews address={googlePlaces.main} />
				    <Payments />
				</Grid>
				<Grid item xs={12} sx={{borderTop: '1px solid #ccc', marginTop: '20px'}}>
					<BottomLinks />
				</Grid>
			</Grid>
		</Container>
    );
}

const BottomLinks = () => {
	const linkStyle = {fontSize: '12px', fontWeight: 400, textTransform: 'none', padding: 0}
	return (
		<>
			<div style={{textAlign: 'center', marginTop: '10px'}}>
				<Button variant="text" sx={linkStyle}>Privacy Policy</Button>
				{' - '}
				<Button variant="text" sx={linkStyle}>Cookie Policy</Button>
				{' - '}
				<Button variant="text" sx={linkStyle}>Termini e Condizioni</Button>
				{' - '}
				<Button variant="text" sx={linkStyle}>Costi di Spedizione</Button>
			</div>
			<Typography sx={{fontSize: '12px', fontWeight: 300, marginTop: '4px', textAlign: 'center'}}>
				Bottega di Sguardi © 2023
			</Typography>
			<Typography sx={{fontSize: '11px', fontWeight: 300, marginTop: '4px', textAlign: 'center', opacity: .75}}>
				Made with <FavoriteIcon sx={{fontSize: '15px', marginBottom: '-4px'}} color="error" /> by <a href="https://www.nimble-solutions.com" target="_blank" rel="noopener">Nimble Solutions</a>
			</Typography>
		</>
	)
}

const Payments = () => {
	const paymentIconStyle = {fontSize: '40px', marginTop: '6px', marginRight: '6px', height: '25px'}
	return (
		<div style={{display: 'flex', marginTop: '14px', justifyContent: 'center', flexWrap: 'wrap', width: '100%'}}>
			<AmericanExpress sx={paymentIconStyle} />
			<ApplePay sx={paymentIconStyle} />
			<GooglePay sx={paymentIconStyle} />
			<Maestro sx={paymentIconStyle} />
			<Mastercard sx={paymentIconStyle} />
			<PayPal sx={paymentIconStyle} />
			<Visa sx={paymentIconStyle} />
		</div>
	)
}

const GoogleReviews = ({address}: {address: GooglePlaces['main']}) => {
	function openSmallWindow(url: string, event: MouseEvent) {
		event.preventDefault();
		const windowFeatures = 'width=600,height=800,top=50%,left=50%';

		window.open(url, '_blank', windowFeatures);
	}
	return (
		<div>
			<Image src={googleReviews} alt="Google Reviews" style={{width: '100%', height: 'auto', maxWidth: '200px', margin: '20px auto'}} />
			<br />
			<span style={{fontSize: '20px', fontWeight: 700, paddingRight: '5px'}}>{address.rating}.0</span>
			{Array.from(Array(address.rating as number).keys()).map((i) =>
				<Star key={i} sx={{padding: '0 4px 0 0', lineHeight: '22px', marginBottom: '-4px'}} />
			)}
			<br />
			<span style={{fontSize: '12px', fontWeight: 300, paddingLeft: '5px'}}>
			based on {address.user_ratings_total} reviews
		</span>
			<br />
			<Button
				endIcon={<GoogleG sx={{backgroundColor: 'white', padding: '1px', borderRadius: '10px'}} />}
				variant="contained"
				color="primary"
				sx={{
					marginTop: '10px',
					fontSize: '12px',
					backgroundColor: '#427fed',
					borderRadius: '27px',
					padding: '8px 20px 10px',
					textTransform: 'none',
				}}
				component="a"
				rel="noopener"
				target="_blank"
				onClick={(e) => openSmallWindow(`https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}`, e)}
			>
				review us on
			</Button>
			<br />
			<Button
				variant="text"
				component="a"
				rel="noopener"
				target="_blank"
				onClick={(e) => openSmallWindow(`https://search.google.com/local/reviews?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}`, e)}
				sx={{color: '#2c7cff', textTransform: 'none', fontSize: '12px'}}
			>
				Guarda tutte le recensioni
			</Button>
		</div>
	)
}

const GoogleAddress = ({address, name, whatsApp}: {whatsApp: string, name: string, address: GooglePlaces['main'] | GooglePlaces['secondary']}) => {
	const [street, streetNumber, cityCap, country ] = address.formatted_address.split(',')
	const pStyle = {fontSize: '12px', fontWeight: 300, marginTop: '14px'}
	return (
		<>
			<Typography sx={{...pStyle, fontWeight: 'bold'}}>{name}</Typography>
			<Typography sx={pStyle}>
				{street} {streetNumber}<br />
				{cityCap} - {country}<br />
				<a href={`tel:${address.formatted_phone_number.replaceAll(' ', '')}`}>{address.formatted_phone_number}</a><br />
				<a href={`https://api.whatsapp.com/send?phone=39${whatsApp.replaceAll(' ', '')}&amp;text=Ciao!`} target="_blank" rel="noopener">{whatsApp}</a><br />
				<a href="mailto:info@bottegadisguardi.com">info@bottegadisguardi.com</a>
			</Typography>
			<Typography sx={pStyle}>
				{address.current_opening_hours.weekday_text.map((day) => (
					<span key={day}>
						{day}<br />
					</span>
				))}
			</Typography>
		</>
	)
}

const LogoButton = (props: IconButtonProps) => {
	const router = useRouter()
	return (
		<IconButton onClick={() => router.push('/')} {...props}>
			<Image
				src={logo}
				alt="Logo Bottega di Sguardi"
				style={{ width: '150px', height: 'auto' }}
			/>
		</IconButton>
	)
}

export default Footer;