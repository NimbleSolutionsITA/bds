import {Box} from "@mui/material";
import Image from "next/image";
import Carousel from "react-material-ui-carousel";
import React from "react";

const FullPageSlider = ({images, disableFullPage}: {images: string[], disableFullPage?: boolean}) => {
	return (
		<Carousel
			sx={{height: '100%', width: '100%'}}
			animation="slide"
			navButtonsAlwaysInvisible={true}
			indicatorContainerProps={{
				style: {
					position: 'absolute',
					bottom: 0,
					zIndex: 1,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-end',
					height: '30px',
				}
			}}
			indicatorIconButtonProps={{
				style: {
					backgroundColor: 'rgba(0,0,0,0.2)',
					margin: '0',
					width: '50px',
					height: '7px',
					borderRadius: '0',
				}
			}}
			activeIndicatorIconButtonProps={{
				style: {
					backgroundColor: '#000',
					margin: '0',
					width: '50px',
					height: '7px',
					borderRadius: '0',
				}
			}}
			IndicatorIcon={<div />}
		>
			{images.map((image) => (
				<Box key={image} sx={{
					width: '100%',
					height: disableFullPage ? '100%' : {
						md: 'calc(100vh - 160px)',
						xs: 'calc(100vh - 101px)',
					},
					position: 'relative'
				}}>
					<Image
						key={image}
						src={image}
						alt="Bottega di Sguardi home slider image"
						fill
						style={{objectFit: 'cover', objectPosition: 'center center'}}
						sizes="100vw"
					/>
				</Box>
			))}
		</Carousel>
	)
}

export default FullPageSlider
