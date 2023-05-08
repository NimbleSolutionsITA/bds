import {HomeProps} from "../../../pages";
import {Box, Button, Grid} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";

type BannerBottom2Props = {
	bannerBottom2: HomeProps['page']['bannerBottom2']
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
				sx={{padding: '10% 10% 5% 10%', textAlign: 'left'}}
				html={leftColumn.body}
			/>
			<Button sx={{marginBottom: 2}}>
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