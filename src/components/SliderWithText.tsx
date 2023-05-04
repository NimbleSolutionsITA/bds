import {Grid} from "@mui/material";
import Carousel from "./Carousel";
import React from "react";
import HtmlBlock from "./HtmlBlock";

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
					height="85%"
					images={images ?? []}
				/>
			</Grid>
		</Grid>
  );
}

export default SliderWithText;