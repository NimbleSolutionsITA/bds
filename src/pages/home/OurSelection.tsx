import Slider from "../../components/Slider";
import AcfProductCard from "../../components/AcfProductCard";
import {Container, Theme, useMediaQuery} from "@mui/material";
import React from "react";
import {HomeProps} from "../../../pages";

type OurSelectionProps = {
	ourSelection: HomeProps['page']['ourSelection']
}
const OurSelection = ({ourSelection}: OurSelectionProps) => {
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
	const getSlides = () => {
		if (isMobile) return 1;
		if (isTablet) return 2;
		return 3;
	}
	return (
		<Container maxWidth="md" sx={{padding: '40px 0', textAlign: 'center'}}>
			<h3>
				<strong>{ourSelection.title}</strong>
			</h3>
			<Slider slides={getSlides()}>
				{ourSelection.products?.map((product) => <AcfProductCard product={product} key={product.id} />)}
			</Slider>
		</Container>
	);
}

export default OurSelection;