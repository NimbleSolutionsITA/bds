import {Box, Grid} from "@mui/material";
import React from "react";
import HtmlBlock from "./HtmlBlock";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";

type SliderWithTextProps = {
	body: string
	images: string[]
}
const SliderWithText = ({body, images}: SliderWithTextProps) => {
	return (
		<Grid
			container
			sx={{
				alignContent: 'flex-end',
				alignItems: 'flex-end',
				flexDirection: {xs: 'column-reverse', lg: 'row'},
			}}
		>
			<Grid item xs={12} lg={4}>
				<HtmlBlock html={body} sx={{
					margin: {
						xs: '5% 10%',
						lg: '0% 10% 5% 10%'
					}
				}} />
			</Grid>
			<Grid item xs={12} lg={8} sx={{width: '100%'}}>
				<Carousel
					animation="slide"
					navButtonsAlwaysInvisible={true}
					indicatorContainerProps={{
						style: {
							position: 'absolute',
							bottom: '10px',
							zIndex: 1,
						}
					}}
					indicatorIconButtonProps={{
						style: {
							color: 'transparent',
							border: '2px solid white',
							margin: '0 5px',
							width: '15px',
							height: '15px',
						}
					}}
					activeIndicatorIconButtonProps={{
						style: {
							color: 'rgba(255, 255, 255, 0.5)',
						}
					}}
				>
					{images.map((image) => (

						<Box key={image} sx={{
							width: '100%',
							height: {
								md: 'calc(100vh - 160px)',
								xs: 'calc(100vh - 80px)',
							},
							position: 'relative'
						}}>
							<Image
								key={image}
								src={image}
								alt="Bottega di Sguardi home slider image"
								fill
								style={{objectFit: 'cover', objectPosition: 'center center'}}
							/>
						</Box>
					))}
				</Carousel>
			</Grid>
		</Grid>
  );
}

export default SliderWithText;