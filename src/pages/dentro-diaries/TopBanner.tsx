import Image from "next/image";
import {Box, Typography} from "@mui/material";

type TopBannerProps = {
	image: {
		url: string
		width: number
		height: number
		alt: string
	}
	title: string
}

const TopBanner = ({image, title}: TopBannerProps) => {
	return (
		<Box sx={{
			textAlign: 'center',
			padding: {
				xs: '20px 10%',
				md: '60px 10%',
				xl: '100px 10%',
			}

		}}>
			<Typography
				variant="h1"
				sx={{
					fontSize: {
						xs: '40px',
						sm: '60px',
						md: '80px',
						lg: '100px',
						xl: '120px',
					},
				}}
			>
				{title}
			</Typography>
			<Typography
				sx={{
					maxWidth: '500px',
					margin: '0 auto 140px'
				}}
			>
				Bottega di Sguardi è uno store brand fiorentino fondato sull'eyewear che ha sede in via Marconi, iconico punto vendita dell'attività, e nel cuore del centro storico, con una boutique su due piani, in Via del Parione, che è un piccolo tempio di raffinatezza dal lusso discreto. Bottega di Sguardi offre la più ricercata selezione di designer e tendenze legate al mondo dell'occhiale e propone al visitatore un'esperienza di acquisto customizzata e multisensoriale.
			</Typography>

			<div style={{border: '1px solid #000', padding: '20px'}}>
				<div
					style={{
						position: 'relative',
						paddingBottom: `${(image.height / image.width) * 100}%`
					}}
				>
					<Image
						style={{
							height: '100%',
							width: '100%',
							position: 'absolute',
							objectFit: 'cover',
						}}
						src={image.url}
						alt={image.alt}
						layout="fill"
					/>
				</div>
			</div>
		</Box>
	)
}

export default TopBanner