import {Box, Container, Typography} from "@mui/material";
import React from "react";
import ProductCard from "./ProductCard";
import {BaseProduct} from "../types/woocommerce";
import Swiper from "./Swiper";

type ProductsSliderProps = {
	products: BaseProduct[]
	title?: string
}
const ProductsSlider = ({products, title}: ProductsSliderProps) => {
	return (
		<Container maxWidth="xl" sx={{margin: '40px auto', textAlign: 'center'}}>
			{title && (
				<Typography variant="h1" component="div" sx={{margin: '20px 0 30px'}}>
					{title}
				</Typography>
			)}
			<Box p={{xs: 0, md: '0 7%'}}>
				<Swiper>
					{products.map((product) =>
						product && <ProductCard product={product} key={product.id} />
					)}
				</Swiper>
			</Box>
		</Container>
	);
}

export default ProductsSlider;