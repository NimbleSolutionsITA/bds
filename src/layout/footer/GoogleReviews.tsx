import {GooglePlaces} from "../../../pages/api/google-places";
import React, {MouseEvent} from "react";
import Image from "next/image";
import googleReviews from "../../images/google-reviews.png";
import Star from "../../icons/Star";
import {Button} from "@mui/material";
import GoogleG from "../../icons/GoogleG";

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

export default GoogleReviews