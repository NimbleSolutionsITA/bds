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
	const data = googlePlaces // await getGooglePlaces(req.query.lang as string);
	res.status(200).json(data);
}

export const getGooglePlaces = async (lang: string) => {
	const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}&language=${lang}`;
	const details = await fetch(url, { cache: "force-cache", next: { revalidate: 24 * 60 * 60 } });
	const { result } = await details.json();
	const url2 = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId2}&key=${apiKey}&language=${lang}`;
	const details2 = await fetch(url2, { cache: "force-cache", next: { revalidate: 24 * 60 * 60 } });
	const { result: result2 } = await details2.json();
	console.error(`google places api called at ${new Date().toLocaleString()}`)
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

export const googlePlaces = {
	"main": {
		"address_components": [
			{
				"long_name": "r",
				"short_name": "r",
				"types": [
					"subpremise"
				]
			},
			{
				"long_name": "19f",
				"short_name": "19f",
				"types": [
					"street_number"
				]
			},
			{
				"long_name": "Via Guglielmo Marconi",
				"short_name": "Via Guglielmo Marconi",
				"types": [
					"route"
				]
			},
			{
				"long_name": "Firenze",
				"short_name": "Firenze",
				"types": [
					"locality",
					"political"
				]
			},
			{
				"long_name": "Firenze",
				"short_name": "Firenze",
				"types": [
					"administrative_area_level_3",
					"political"
				]
			},
			{
				"long_name": "Città Metropolitana di Firenze",
				"short_name": "FI",
				"types": [
					"administrative_area_level_2",
					"political"
				]
			},
			{
				"long_name": "Toscana",
				"short_name": "Toscana",
				"types": [
					"administrative_area_level_1",
					"political"
				]
			},
			{
				"long_name": "Italia",
				"short_name": "IT",
				"types": [
					"country",
					"political"
				]
			},
			{
				"long_name": "50131",
				"short_name": "50131",
				"types": [
					"postal_code"
				]
			}
		],
		"formatted_address": "Via Guglielmo Marconi, 19f/r, 50131 Firenze FI, Italia",
		"formatted_phone_number": "055 532 1049",
		"icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png",
		"international_phone_number": "+39 055 532 1049",
		"name": "Bottega di Sguardi Firenze",
		"rating": 5,
		"reviews": [
			{
				"author_name": "Tommaso Boschi",
				"author_url": "https://www.google.com/maps/contrib/116007935044430588080/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a/ACg8ocJUtilr0mZoYD41JrZrFJflw7Z2rBeyjf2Azew3sLdK=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "6 mesi fa",
				"text": "Che dire..la ricerca del gusto e l’attenzione al dettaglio di Simone e Giulia sono assolutamente indiscussi! Sempre fuori dagli schemi e originali nelle proposte, oltre che professionali, onesti e gentili. Sono oramai al mio quinto paio di occhiali acquistati da Bottega di Sguardi e non ho alcun dubbio su dove acquisterò il sesto. Non è facile trovare persone così appassionate della propria professione. A presto ragazzi",
				"time": 1685048304,
				"translated": false
			},
			{
				"author_name": "Francesca ********",
				"author_url": "https://www.google.com/maps/contrib/115191638662122546577/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjUJUv-jJZ3J_zfcRYuSZkOts3G3NSo9v4wMJNQrrw8dVRM=s128-c0x00000000-cc-rp-mo-ba5",
				"rating": 5,
				"relative_time_description": "un anno fa",
				"text": "Esperienza meravigliosa!\nCi sono stata con una mia Amica perché voleva acquistare un paio di occhiali nuovi e appena siamo entrate nel negozio ci ha accolto Giulia che ci ha fatto vivere la scelta degli occhiali unici in maniera del tutto straordinaria ! Il negozio è bellissimo hanno un giardino che è la fine del mondo ! Sono un brand conosciuto in tutto il mondo ed lo stile è assolutamente elegante e di gran moda !\nGrazie mille a Giulia per l esperienza verrò anch’io a farmi un paio di occhiali molto presto!\nLo consiglio  ! a chi ha voglia di cambiare sguardo passate da Giulia !!",
				"time": 1662221790,
				"translated": false
			},
			{
				"author_name": "Lucia Persigilli",
				"author_url": "https://www.google.com/maps/contrib/115347101038870183392/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a/ACg8ocJ222t2xRI6uHcHGi2wD0UcCGjIb-C6fcPxTXVzFvoT=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "un mese fa",
				"text": "Che boutique incredibile! Dove non solo uscirai avendo acquistato almeno un paio di occhiali ma, dove vivrai una vera e propria experience!\nInsieme a Simone, Giulia e Chiara, padroni di grande calma, maestria, passione e competenza, riuscirai a scovare la montatura perfetta per il tuo viso e il tuo sguardo!\nTutto ciò accompagnato da infiniti sorrisi e gentilezza, mai più senza di voi ragazzi!\nGrazie mille ancora!",
				"time": 1699139429,
				"translated": false
			},
			{
				"author_name": "morena nardoni",
				"author_url": "https://www.google.com/maps/contrib/107066343894412941307/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjVTWbShGi7D-myBjQt965t0QePtHZtuSjAjR2Hx1xr8Cw=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "nell'ultima settimana",
				"text": "Consiglio vivamente a chi cerca persone esperte e competenti che ti sappiano accompagnare nella scelta dell'occhiale perfetto fra tante bellissime e particolari proposte!\nPer la prima volta sono contenta di \"dover\" portare gli occhiali!!!\nGrazie di cuore!",
				"time": 1701552659,
				"translated": false
			},
			{
				"author_name": "Barbara Picchi",
				"author_url": "https://www.google.com/maps/contrib/109644090614234099310/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a/ACg8ocJJaI26tVq_ftjiar4wasRBHJqObvaoPOQuSm9cbztC=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "2 settimane fa",
				"text": "Gratificarsi da Bottega di Sguardi seguendo i consigli di Giulia e Simone da una svolta alla giornata e il 🌎 lo vedi a colori 🆙♥️",
				"time": 1700242612,
				"translated": false
			}
		],
		"current_opening_hours": {
			"weekday_text": [
				"lunedì: 16:00–20:00",
				"martedì: 09:30–13:30, 16:00–20:00",
				"mercoledì: 09:30–13:30, 16:00–20:00",
				"giovedì: 09:30–13:30, 16:00–20:00",
				"venerdì: 09:30–13:30, 16:00–20:00",
				"sabato: 09:30–13:30, 16:00–20:00",
				"domenica: Chiuso"
			]
		},
		"url": "https://maps.google.com/?cid=2010653055074119830",
		"user_ratings_total": 96,
		"place_id": "ChIJLQkUB0JUKhMRljA_-kxG5xs"
	},
	"secondary": {
		"address_components": [
			{
				"long_name": "54r",
				"short_name": "54r",
				"types": [
					"street_number"
				]
			},
			{
				"long_name": "Via del Parione",
				"short_name": "Via del Parione",
				"types": [
					"route"
				]
			},
			{
				"long_name": "Firenze",
				"short_name": "Firenze",
				"types": [
					"locality",
					"political"
				]
			},
			{
				"long_name": "Firenze",
				"short_name": "Firenze",
				"types": [
					"administrative_area_level_3",
					"political"
				]
			},
			{
				"long_name": "Città Metropolitana di Firenze",
				"short_name": "FI",
				"types": [
					"administrative_area_level_2",
					"political"
				]
			},
			{
				"long_name": "Toscana",
				"short_name": "Toscana",
				"types": [
					"administrative_area_level_1",
					"political"
				]
			},
			{
				"long_name": "Italia",
				"short_name": "IT",
				"types": [
					"country",
					"political"
				]
			},
			{
				"long_name": "50123",
				"short_name": "50123",
				"types": [
					"postal_code"
				]
			}
		],
		"formatted_address": "Via del Parione, 54r, 50123 Firenze FI, Italia",
		"formatted_phone_number": "055 493 9134",
		"icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png",
		"international_phone_number": "+39 055 493 9134",
		"name": "Bottega Di Sguardi - Dentro",
		"rating": 4.9,
		"reviews": [
			{
				"author_name": "Corinna",
				"author_url": "https://www.google.com/maps/contrib/116126632033619771028/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a/ACg8ocIiK5uqMLvYv8n81XDe3X09aAIySzxAQNDO05nzsAMV=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "2 settimane fa",
				"text": "Buongiorno cari ottici, gli occhiali sono ben arrivati insieme a la bella scatola verde e questo regalo-profumo “Acqua e Zucchero”,- un insieme molto italiano, divertente, piacevole e di altissima qualità. Vedo molto bene 👓 e trovo che il colore dei vetri  è diventato perfetto 👌grazie del cuore per vostro lavoro con il quale avete prestato tanta attenzione ad ogni dettaglio e al quadro generale. Qui nel Nord e sopratutto a Lussemburgo (grigio, piovoso, buio, molto freddo e umido) con questi occhiali mi sento oggi un po’ come un pop star italiano e gioiosa che ha preso un aereo sbagliato … ma presto, fortunatamente, sarò di nuovo in Italia dove anche io sono una altra persona. Grazie ancora per tutto. Ci vediamo a Firenze! Corinna",
				"time": 1700767164,
				"translated": false
			},
			{
				"author_name": "Martina Cova",
				"author_url": "https://www.google.com/maps/contrib/106557328366082951249/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjWKpBAvV681YyXMQsaCpA9d5m_K2JemwLi5n_1JDE4a6A=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "4 mesi fa",
				"text": "Bottega di sguardi non è un semplice negozio di occhiali. È una vera e propria esperienza.\nSimone e il suo staff sanno interpretarti come persona, leggere le tue emozioni per consigliarti non un semplice accessorio ma un qualcosa che cambia realmente la percezione che hai di te allo specchio.\nNon avevo mai acquistato un paio di occhiali nella convinzione che mi stessero male…sono uscita con ben due paia e con l’umore alle stelle!\nUn luogo pieno di energia e di positività.\nGrazie!",
				"time": 1689781770,
				"translated": false
			},
			{
				"author_name": "Michela Tonelli",
				"author_url": "https://www.google.com/maps/contrib/109193892552413618229/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a/ACg8ocImEg-klGK99bwibt5Ir6bYKf-xJezRW3BQ1f_chLSw=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "6 mesi fa",
				"text": "Premessa importante: non conoscevo il negozio, l’ho scoperto scoperto cercando chi a Firenze vendesse Profumum Roma. Quindi la mia esperienza è stata proprio una felice sorpresa e la recensione è assolutamente sincera.\nGentilezza e professionalità. In questo ordine preciso; sulla prima non transigo proprio. L’esperienza dell’acquisto è stata davvero piacevole, mi sono sentita subito a mio agio; Simone (il proprietario) e il suo staff mi hanno offerto una selezione di montature disposte in una valigetta e con calma ho potuto provarle senza sentirmi pressata nell’acquisto. Ero entrata per comprare un occhiale, alle fine ne ho presi tre. La qualità dell’estetica e dei materiali degli occhiali è altissima. Il negozio è curato in ogni dettaglio e sicuramente un aspetto che ha attirato molto la mia attenzione è il fatto che vendano anche profumi di nicchia (mia piccola passione). Felicissima dei miei acquisti, posso sicuramente dire che hanno trovato una nuova cliente",
				"time": 1683998269,
				"translated": false
			},
			{
				"author_name": "Mugnaini Matteo",
				"author_url": "https://www.google.com/maps/contrib/108337676176144293086/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a/ACg8ocKFo0FQ9fZheoNLvvZ4-SU3JtWXYVxOLuMdL91LhYNl=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "9 mesi fa",
				"text": "Il team di bottega di sguardi è fantastico,  hanno una selezione di occhiali da capogiro!! Anche l’esperienza della prova degli occhiali è una cosa che non avevo mai visto. Che dire, sono i numeri 1. Complimenti a Simone e al suo team, in particolare al mitico Gauthier!",
				"time": 1677408755,
				"translated": false
			},
			{
				"author_name": "Leslie Patino",
				"author_url": "https://www.google.com/maps/contrib/117868597556412154344/reviews",
				"language": "it",
				"original_language": "it",
				"profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjWxAiTaCmcdeQ1hqIuNyZHsZpPlMx76r_fpkv6uAVeaz2w=s128-c0x00000000-cc-rp-mo",
				"rating": 5,
				"relative_time_description": "8 mesi fa",
				"text": "Sono entrata nel negozio senza sapere cosa aspettarmi. Si scopre che sono la migliore esperienza di negozio per trovare un paio di occhiali da sole che adorerai.\nNon avrei potuto fare a meno del loro aiuto, sanno davvero di cosa parlano e ti faranno sentire sicuro della tua scelta.\nÈ stata un'esperienza bella e divertente.",
				"time": 1680614942,
				"translated": false
			}
		],
		"current_opening_hours": {
			"weekday_text": [
				"lunedì: 14:30–19:30",
				"martedì: 10:30–19:30",
				"mercoledì: 10:30–19:30",
				"giovedì: 10:30–19:30",
				"venerdì: 10:30–19:30",
				"sabato: 10:30–19:30",
				"domenica: 14:30–20:00"
			]
		},
		"url": "https://maps.google.com/?cid=8566543080284360235",
		"user_ratings_total": 65,
		"place_id": "ChIJBXm7qLdXKhMRKw5uRYt54nY"
	}
}