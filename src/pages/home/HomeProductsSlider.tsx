import {Box, Container, Typography} from "@mui/material";
import React from "react";
import {BaseProduct} from "../../types/woocommerce";
import ProductCard from "../../components/ProductCard";
import Swiper from "../../components/Swiper";
import {HomeProps, ProdSelection} from "../../../pages";

const HomeProductsSlider = ({optical, sunglasses, title, isActive}: ProdSelection) => isActive ? (
	<Container maxWidth="xl" sx={{margin: '40px auto', textAlign: 'center'}}>
		{title && (
			<Typography variant="h1" component="div" sx={{margin: '20px 0 30px'}}>
				{title}
			</Typography>
		)}
		<Box p={{xs: 0, md: '0 7%'}}>
			<Swiper noPagination>
				{sunglasses.map((product) =>
					product && <ProductCard product={product} key={product.id} />
				)}
			</Swiper>
		</Box>
		<Box p={{xs: 0, md: '0 7%'}}>
			<Swiper noPagination>
				{optical.map((product) =>
					product && <ProductCard product={product} key={product.id} />
				)}
			</Swiper>
		</Box>
	</Container>
) : null

export default HomeProductsSlider;