import Image from "next/image";
import {Box, Typography} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import {AcfImage} from "../../types/woocommerce";
import {Swiper, SwiperSlide} from "swiper/react";
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

type TopBannerProps = {
	gallery: AcfImage[]
	title: string
	content: string
}

const TopBanner = ({gallery, title, content}: TopBannerProps) => {
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
					margin: '0 auto 40px'
				}}
				html={content}
			/>
			<div style={{border: '1px solid #000', padding: '20px'}}>
				<Swiper
					centeredSlides={true}
					autoplay={{
						delay: 2500,
						disableOnInteraction: false,
					}}
					slidesPerView={1}
					modules={[EffectFade, Autoplay]}
					effect="fade"
					autoHeight
					loop
				>
					{gallery.map((image, index) => (
						<SwiperSlide key={image.id}>
							<Image
								width={Number(image.width)}
								height={Number(image.height)}
								style={{
									width: '100%',
									height: 'auto',
								}}
								src={image.url}
								alt={image.alt}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</Box>
	)
}

export default TopBanner