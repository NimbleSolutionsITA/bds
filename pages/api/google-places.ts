import type { NextApiRequest, NextApiResponse } from 'next';

export type Review = {
	profile_photo_url: string;
	rating: number;
	text: string;
	author_name: string;
};

type address_components = {
	long_name: string;
	short_name: string;
	types: string[];
}

type ApiResponse = {
	result: {
		address_components: address_components[] // street_number, subpremise, route, locality, country, postal_code
		formatted_address: string
		formatted_phone_number: string
		icon: string
		international_phone_number: string
		name: string
		rating: number
		reviews: Review[]
		current_opening_hours: {
			weekday_text: string[]
		}
		url: string
		user_ratings_total: number
		place_id: string
	}
}

export type GooglePlaces = {
	main: ApiResponse['result'];
	secondary: ApiResponse['result'];
};

const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
const placeId2 = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID_2;
const apiKey = process.env.GOOGLE_API_KEY;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<GooglePlaces>
) {
	const data = await getGooglePlaces(req.query.lang as string);
	res.status(200).json(data);
}

export const getGooglePlaces = async (lang: string) => {
	const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}&language=${lang}`;
	const details = await fetch(url, { cache: "force-cache", next: { revalidate: 24 * 60 * 60 } });
	const { result } = await details.json();
	const url2 = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId2}&key=${apiKey}&language=${lang}`;
	const details2 = await fetch(url2, { cache: "force-cache", next: { revalidate: 24 * 60 * 60 } });
	console.log('getGooglePlaces called at ', new Date())
	const { result: result2 } = await details2.json();
	return {
		main: mapResult(result),
		secondary: mapResult(result2)
	}
}

const mapResult = (result: ApiResponse['result']) => ({
	address_components: result.address_components,
	formatted_address: result.formatted_address,
	formatted_phone_number: result.formatted_phone_number,
	icon: result.icon,
	international_phone_number: result.international_phone_number,
	name: result.name,
	rating: result.rating,
	reviews: result.reviews,
	current_opening_hours: {
		weekday_text: result.current_opening_hours.weekday_text
	},
	url: result.url,
	user_ratings_total: result.user_ratings_total,
	place_id: result.place_id
})