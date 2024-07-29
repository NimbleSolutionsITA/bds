import {Box, Button, Container, Typography} from "@mui/material";
import React, {useState} from "react";
import ProductCard from "./ProductCard";
import {BaseCategory, BaseProduct} from "../types/woocommerce";
import Swiper from "./Swiper";
import {EYEWEAR_CATEGORY, OPTICAL_CATEGORY, SUNGLASSES_CATEGORY} from "../utils/utils";

type ProductsSliderProps = {
	products: BaseProduct[]
	title?: string
	isActive?: boolean
}
const ProductsCategorySlider = ({products, title, isActive}: ProductsSliderProps) => {
	const categories = products
		.map((product) => product.categories)
		.flat()
		.filter((category, index, self) =>
			![
				...Object.values(EYEWEAR_CATEGORY),
				...Object.values(SUNGLASSES_CATEGORY),
				...Object.values(OPTICAL_CATEGORY)
			].includes(category.id) &&
			self.findIndex((t) => t.id === category.id) === index
		);
	const [filter, setFilter] = useState<number | null>(categories[0]?.id ?? null);

	return isActive ? (
		<Container maxWidth="xl" sx={{margin: '40px auto', textAlign: 'center'}}>
			{title && (
				<Typography variant="h1" component="div" sx={{margin: '20px 0 30px'}}>
					{title}
				</Typography>
			)}
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					marginBottom: '20px',
				}}
			>
				{categories.map((category) => (
					<Box key={category.id} sx={{margin: '0 10px'}}>
						<CategoryButton
							category={category}
							isSelected={category.id === filter}
							setFilter={setFilter}
						/>
					</Box>
				))}
			</Box>
			<Box p={{xs: 0, md: '0 7%'}}>
				<Swiper>
					{products.filter(p => !filter || p.categories.map(c => c.id).includes(filter)).map((product) =>
						product && <ProductCard product={product} key={product.id} />
					)}
				</Swiper>
			</Box>
		</Container>
	) : null;
}

interface CategoryButtonProps {
	category: BaseCategory
	isSelected: boolean
	setFilter: (category: number|null) => void
}
const CategoryButton = ({category, isSelected, setFilter}: CategoryButtonProps) => {
	return (
		<Button
			sx={{padding: '6px 8px', fontSize: '12px'}}
			variant={isSelected ? 'contained' : 'text'}
			color="primary"
			onClick={() => setFilter(isSelected ? null : category.id)}
		>
			{category.name}
		</Button>
	)
}

export default ProductsCategorySlider;