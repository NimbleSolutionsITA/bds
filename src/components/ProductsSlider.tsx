import Slider from "./Slider";
import {Container, Theme, useMediaQuery} from "@mui/material";
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
				<h3>
					<strong>{title}</strong>
				</h3>
			)}
			<Slider slides={getSlides()}>
				{products.map((product) => <ProductCard product={product} key={product.id} />)}
			</Slider>
		</Container>
	);
}

export default ProductsSlider;