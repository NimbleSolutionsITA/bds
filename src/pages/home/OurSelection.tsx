import Slider from "../../components/Slider";
import ProductCard from "../../components/ProductCard";
import {Container} from "@mui/material";
import React from "react";
import {HomeProps} from "../../../pages";

type OurSelectionProps = {
	ourSelection: HomeProps['page']['ourSelection']
}
const OurSelection = ({ourSelection}: OurSelectionProps) => {
	return (
		<Container maxWidth="md" sx={{padding: '40px 0', textAlign: 'center'}}>
			<h3>
				<strong>{ourSelection.title}</strong>
			</h3>
			<Slider>
				{ourSelection.products.map((product) => <ProductCard product={product} key={product.id} />)}
			</Slider>
		</Container>
	);
}

export default OurSelection;