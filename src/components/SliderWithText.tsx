import {Grid} from "@mui/material";
import React from "react";
import HtmlBlock from "./HtmlBlock";
import Carousel from "react-material-ui-carousel";

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
				<HtmlBlock html={body} sx={{margin: '0% 10% 05% 10%'}} />
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
						<div key={image} style={{
							width: '100%',
							height: 'calc(100vh - 150px)',
							backgroundImage: `url(${image})`,
							backgroundSize: 'cover',
						}} />
					))}
				</Carousel>
			</Grid>
		</Grid>
  );
}

export default SliderWithText;