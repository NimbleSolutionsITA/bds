import {GooglePlaces} from "../../../pages/api/google-places";
import {Typography} from "@mui/material";
import React from "react";

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

export default GoogleAddress;