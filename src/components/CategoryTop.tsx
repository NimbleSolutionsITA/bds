import {Box, Grid2 as Grid, Typography} from "@mui/material";
import {sanitize} from "../utils/utils";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import ReadMoreText from "./ReadMoreText";

type DesignerTopProps = {
	name: string
	brand?: string
	gallery: string[]
	description: string
}
const CategoryTop = ({name, brand, description}: DesignerTopProps) => {
	const title = brand
		? brand + " - " + name
		: name;
	return (
		<Grid container sx={{flexDirection: {xs: 'column-reverse', md: 'row'}}}>
			<Grid size={{xs: 12, md: 12}} sx={{alignItems: 'center', display: 'flex'}}>
				<div style={{margin: '0 10%', textAlign: 'center', width: '100%'}}>
					<Typography
						variant="h1"
						className="title"
						sx={{width: '100%'}}
						dangerouslySetInnerHTML={{__html: sanitize(title)}}
					/>
					<ReadMoreText text={description}/>
				</div>
			</Grid>
			{/*<Grid size={{xs: 12, md: 7}}>
				<Carousel
					animation="slide"
					indicators={false}
				>
					{gallery?.map((image, index) => (
						<Box
							key={index}
							sx={{
								height: {
									xs: 'calc(100vh - 101px)',
									md: 'calc(100vh - 160px)'
								},
								width: '100%'
							}}
						>
							<Image
								src={image}
								alt={name}
								fill
								style={{objectFit: 'cover', objectPosition: 'center center'}}
							/>
						</Box>
					))}
				</Carousel>
			</Grid>*/}
		</Grid>
	)
}

export default CategoryTop