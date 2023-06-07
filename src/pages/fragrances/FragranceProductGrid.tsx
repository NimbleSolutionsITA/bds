import {BaseProduct} from "../../types/woocommerce";
import {Container, Grid} from "@mui/material";
import ProductCard from "../../components/ProductCard";

type FragranceProductGridProps = {
	products: BaseProduct[]
}
const FragranceProductGrid = ({products}:FragranceProductGridProps) => {
	return (
		<Container sx={{paddingTop: '20px', paddingBottom: '20px'}}>
			<Grid container spacing={3}>
				{products.map((product) => (
					<Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
						<ProductCard product={product} imageRatio={130} attributesAlwaysVisible />
					</Grid>
				))}
			</Grid>
		</Container>
	)
}

export default FragranceProductGrid;