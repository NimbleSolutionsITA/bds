import {Grid} from "@mui/material";
import React from "react";
import HtmlBlock from "./HtmlBlock";
import FullPageSlider from "./FullPageSlider";

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
				<FullPageSlider images={images} />
			</Grid>
		</Grid>
  );
}

export default SliderWithText;