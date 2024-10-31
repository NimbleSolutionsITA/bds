import {HomeProps} from "../../../pages";
import {Box, Button, Grid} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";
import Link from "../../components/Link";
import {AcfAdvancedLink, AcfImage} from "../../types/woocommerce";

type BannerBottom2Props = {
	bannerBottom2: {
		leftColumn: {
			body: string
			cta: AcfAdvancedLink
		}
		image: AcfImage
	}
}

const BannerBottom2 = ({bannerBottom2: {leftColumn, image}}: BannerBottom2Props) => (
	<Grid container sx={{
		minHeight: '60vh',
		flexDirection: {
			xs: 'column-reverse',
			md: 'row'
		},
	}}>
		<Grid
			item
			xs={12}
			md={4}
			sx={{textAlign: 'center'}}
		>
			<HtmlBlock
				sx={{padding: '10% 10% 10px 10%', textAlign: 'left'}}
				html={leftColumn.body}
			/>
			<Button sx={{marginBottom: 3}} component="a" href={leftColumn.cta.url}>
				{leftColumn.cta.title}
			</Button>
		</Grid>
		<Grid item xs={12} md={8}>
			<Box
				sx={{
					width: '100%',
					minHeight: '60vh',
					backgroundImage: `url(${image.url})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'bottom center',
				}}
			/>
		</Grid>
	</Grid>
)

export default BannerBottom2;