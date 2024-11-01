import {Box, Button, Container, Grid2 as Grid, Typography} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";
import Link from "../../components/Link";
import {BannerGallery} from "../../../pages";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";

const BannerFragrances = ({isActive, title, body, ctaText, gallery}: BannerGallery) => isActive ? (
	<Box sx={{backgroundColor: "#f0e9e5"}}>
		<Container maxWidth="lg" >
			<Grid container spacing={5} sx={{
				flexDirection: {
					xs: 'column-reverse',
					md: 'row'
				},
				paddingY: '64px',
			}}>
				<Grid size={{xs: 12, md: 5}}>
					<Typography variant="h1" component="h2">{title}</Typography>
					<HtmlBlock html={body} />
					<Button sx={{marginTop: 3}} component={Link} variant="outlined" href="/negozio-ottica-firenze">
						{ctaText}
					</Button>
				</Grid>
				<Grid size={{xs: 12, md: 7}}>
					<Carousel animation="slide" autoPlay={true} navButtonsAlwaysInvisible indicators={false} sx={{height: '100%'}}>
						{gallery.map((url) => (
							<Image key={url} src={url} alt="carousel" width={700} height={300} layout="responsive" />
						))}
					</Carousel>
				</Grid>
			</Grid>
		</Container>
	</Box>
) : null

export default BannerFragrances;