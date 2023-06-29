import Image from "next/image";
import {Box, Typography} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";

type TopBannerProps = {
	image: {
		url: string
		width: number
		height: number
		alt: string
	}
	title: string
	content: string
}

const TopBanner = ({image, title, content}: TopBannerProps) => {
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
			<HtmlBlock
				sx={{
					maxWidth: '500px',
					margin: '0 auto 140px'
				}}
				html={content}
			/>
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
						fill
					/>
				</div>
			</div>
		</Box>
	)
}

export default TopBanner