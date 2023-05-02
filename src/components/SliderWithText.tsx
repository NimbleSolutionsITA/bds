import {Grid} from "@mui/material";
import Carousel from "./Carousel";
import React from "react";
import {sanitize} from "../utils/utils";

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
				flexDirection: {xs: 'column-reverse', md: 'row'},
			}}
		>
			<Grid item xs={12} md={4}>
				<div
					dangerouslySetInnerHTML={{__html: sanitize(body)}}
					style={{margin: '0% 10% 05% 10%'}}
				/>
			</Grid>
			<Grid item xs={12} md={8} sx={{width: '100%'}}>
				<Carousel
					height="85%"
					images={images ?? []}
				/>
			</Grid>
		</Grid>
  );
}

export default SliderWithText;