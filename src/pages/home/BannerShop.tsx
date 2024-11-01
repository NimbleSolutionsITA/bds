import {Box, Button, Container, Grid2 as Grid, Typography} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";
import Link from "../../components/Link";
import {HomeProps} from "../../../pages";

const BannerShop = ({isActive, title, body, ctaText, image}: HomeProps['page']['shop']) => isActive ? (
	<Box sx={{backgroundColor: "#f0e9e5"}}>
		<Container maxWidth="lg" >
			<Grid container spacing={5} sx={{
				flexDirection: {
					xs: 'column-reverse',
					md: 'row'
				},
				paddingY: '64px',
			}}>
				<Grid size={{xs: 12, md: 7}}>
					<Typography variant="h1" component="h2">{title}</Typography>
					<HtmlBlock html={body} />
					<Button sx={{marginTop: 3}} component={Link} variant="outlined" href="/negozio-ottica-firenze">
						{ctaText}
					</Button>
				</Grid>
				<Grid size={{xs: 12, md: 5}}>
					<Box
						sx={{
							width: '100%',
							height: '100%',
							backgroundImage: `url(${image.url})`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'contain',
							backgroundPosition: 'center right',
						}}
					/>
				</Grid>
			</Grid>
		</Container>
	</Box>
) : null

export default BannerShop;