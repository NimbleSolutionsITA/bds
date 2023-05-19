import Slider from "./Slider";
import {Container, Theme, Typography, useMediaQuery} from "@mui/material";
import React from "react";
import ProductCard from "./ProductCard";
import {BaseProduct} from "../types/woocommerce";

type ProductsSliderProps = {
	products: BaseProduct[]
	title?: string
}
const ProductsSlider = ({products, title}: ProductsSliderProps) => {
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
	const getSlides = () => {
		if (isMobile) return 1;
		if (isTablet) return 2;
		return 3;
	}
	return (
		<Container maxWidth="md" sx={{margin: '40px auto', textAlign: 'center'}}>
			{title && (
				<Typography variant="h3" component="div" sx={{margin: '20px 0 30px'}}>
					{title}
				</Typography>
			)}
			<Slider slides={getSlides()}>
				{products.map((product) => <ProductCard product={product} key={product.id} />)}
			</Slider>
		</Container>
	);
}

export default ProductsSlider;