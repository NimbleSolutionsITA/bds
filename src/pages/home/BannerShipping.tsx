import {Box, Grid} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";
import {HomeProps} from "../../../pages";

type BannerShippingProps = {
	shipping: HomeProps['page']['shipping']
}
const BannerShipping = ({shipping}: BannerShippingProps) => {
	return (
		<Box sx={{backgroundColor: '#F4F4F4', width: '100%', justifyContent: 'center'}} display="flex">
			<Grid container maxWidth={"md"}>
				<Grid item xs={12} md={4}>
					<HtmlBlock html={shipping.bodyLeft} />
				</Grid>
				<Grid item xs={12} md={4}>
					<HtmlBlock html={shipping.bodyCenter} />
				</Grid>
				<Grid item xs={12} md={4}>
					<HtmlBlock html={shipping.bodyRight} />
				</Grid>
			</Grid>
		</Box>
	)
}

export default BannerShipping;