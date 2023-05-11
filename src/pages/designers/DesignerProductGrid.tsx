import {BaseProduct} from "../../types/woocommerce";
import {Container, Grid} from "@mui/material";
import ProductCard from "../../components/ProductCard";

type DesignerProductGridProps = {
	products: BaseProduct[]
}
const DesignerProductGrid = ({products}:DesignerProductGridProps) => {
	return (
		<Container sx={{padding: '20px 0'}}>
			<Grid container spacing={3}>
				{products.map((product) => (
					<Grid item xs={12} sm={6} md={4} key={product.id}>
						<ProductCard product={product} />
					</Grid>
				))}
			</Grid>
		</Container>
	)
}

export default DesignerProductGrid;