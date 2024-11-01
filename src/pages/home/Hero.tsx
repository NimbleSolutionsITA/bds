import FullPageSlider from "../../components/FullPageSlider";
import React from "react";
import {Box, Button} from "@mui/material";
import Link from "../../components/Link";
import {HeroProps} from "../../../pages";

const Hero = ({images, video, buttonVariant, buttonTextColor, buttonColor}: HeroProps) => {
	return (
		<Box position="relative">
			{video ? (
				<video
					style={{ width: '100%', height: 'calc(100vh - 130px)', objectFit: "cover"}}
					preload="none"
					autoPlay muted loop
				>
					<source src={video} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			) : (
				<FullPageSlider images={images} />
			)}
			<Box position="absolute" bottom="10%" width="100%" display="flex" justifyContent="center" gap={{xs: '10px', md: "50px"}} padding="20px" zIndex={1}>
				<Button sx={{color: buttonTextColor, backgroundColor: buttonColor, borderColor: buttonColor}} variant={buttonVariant} component={Link} href="/occhiali-da-sole">
					Occhiali da sole
				</Button>
				<Button sx={{color: buttonTextColor, backgroundColor: buttonColor, borderColor: buttonColor}} variant={buttonVariant} component={Link} href="/occhiali-da-sole">
					Occhiali da vista
				</Button>
			</Box>
		</Box>
	)
}

export default Hero;