import {Box, Button, Container, Grid2 as Grid, Typography} from "@mui/material";
import Link from "../../components/Link";
import React from "react";
import {OurProduction} from "../../../pages";
import {DESIGNERS_SUB_PATH} from "../../utils/endpoints";

const OurProductionBanner = ({title, categories}: OurProduction) => {
	return (
		<Container maxWidth="lg" sx={{marginY: "32px"}}>
			<Typography variant="h1" component="h2">{title}</Typography>
			<Grid container spacing={5}>
				{categories.map(({category, image}) => (
					<Grid size={{xs: 12, md: 4}} key={category.slug}>
						<Box sx={{marginY: "32px", width: '100%', paddingBottom: "100%", backgroundImage: `url(${image.url})`, backgroundSize: "cover", backgroundPosition: "center center"}}/>
						<Button fullWidth variant="outlined" component={Link} href={`/${DESIGNERS_SUB_PATH}/${category.slug}`}>
							{category.name}
						</Button>
					</Grid>
				))}
			</Grid>
		</Container>
	)
}

export default OurProductionBanner