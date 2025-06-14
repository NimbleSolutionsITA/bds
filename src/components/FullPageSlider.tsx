import { Box } from "@mui/material";
import Image from "next/image";
import Carousel from "react-material-ui-carousel";
import React, { useState, useEffect } from "react";

type FullPageSliderProps = {
	images: string[];
	disableFullPage?: boolean;
	onLoadComplete?: () => void;
};

const FullPageSlider = ({ images, disableFullPage, onLoadComplete }: FullPageSliderProps) => {
	const [loadedCount, setLoadedCount] = useState(0);

	useEffect(() => {
		if (images.length === 0) {
			onLoadComplete?.();
		}
		if (loadedCount === images.length) {
			onLoadComplete?.();
		}
	}, [loadedCount, images.length, onLoadComplete]);

	return (
		<Carousel
			sx={{ height: '100%', width: '100%' }}
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
				<Box
					key={image}
					sx={{
						width: '100%',
						height: disableFullPage ? '100%' : {
							md: 'calc(100vh - 160px)',
							xs: 'calc(100vh - 101px)',
						},
						position: 'relative'
					}}
				>
					<Image
						src={image}
						alt="Bottega di Sguardi home slider image"
						fill
						style={{ objectFit: 'cover', objectPosition: 'center center' }}
						sizes="100vw"
						onLoad={() => setLoadedCount(c => c + 1)}
					/>
				</Box>
			))}
		</Carousel>
	);
};

export default FullPageSlider;
