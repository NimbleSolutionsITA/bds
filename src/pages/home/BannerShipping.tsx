import {Box, Grid} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";
import {HomeProps} from "../../../pages";
import SaveMoney from "../../icons/SaveMoney";
import FastShipping from "../../icons/FastShipping";
import EuShipping from "../../icons/EuShipping";

type BannerShippingProps = {
	shipping: HomeProps['page']['shipping']
}
const BannerShipping = ({shipping}: BannerShippingProps) => {
	const boxStyle = {
		marginTop: '20px',
		marginBottom: '20px',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
	}
	return (
		<Box sx={{backgroundColor: '#F4F4F4', width: '100%'}}>
			<Grid container maxWidth={"md"} sx={{marginLeft: 'auto', marginRight: 'auto'}}>
				<Grid item xs={12} md={4} sx={boxStyle}>
					<SaveMoney fontSize="large" />
					<HtmlBlock html={shipping.bodyLeft} />
				</Grid>
				<Grid item xs={12} md={4} sx={boxStyle}>
					<FastShipping fontSize="large" />
					<HtmlBlock html={shipping.bodyCenter} />
				</Grid>
				<Grid item xs={12} md={4} sx={boxStyle}>
					<EuShipping fontSize="large" />
					<HtmlBlock html={shipping.bodyRight} />
				</Grid>
			</Grid>
		</Box>
	)
}

export default BannerShipping;