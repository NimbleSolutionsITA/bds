import {Product} from "../../types/woocommerce";
import {Container, Grid, Typography} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ZoomableImage from "../../components/ZoomableImage";
import {sanitize} from "../../utils/utils";
import Link from "../../components/Link";
import HtmlBlock from "../../components/HtmlBlock";

type ProductViewProps = {
	product: Product
}

const ProductView = ({product}: ProductViewProps) => {
	console.log(product)

	const galleryImages = [
		...(product.gallery.length > 0 ? product.gallery : [product.image] ),
		...product.variations.map(v => v.image)
	].filter(v => v)
	return (
		<Container>
			<Grid container spacing={5}>
				<Grid item xs={12} md={7}>
					<Carousel
						animation="slide"
						autoPlay={false}
						indicators={false}
					>
						{galleryImages.map((image) => (
							<ZoomableImage key={image} img={image} ratio={4/3} />
						))}
					</Carousel>
				</Grid>
				<Grid item xs={12} md={5}>
					<Typography
						variant="h1"
						dangerouslySetInnerHTML={{__html: sanitize(product.name)}}
						sx={{
							fontFamily: 'Ogg Roman',
							fontSize: '50px',
							padding: '30px 0',
							borderTop: '1px solid',
							borderBottom: '1px solid',
							marginBottom: '10px'
						}}
					/>
					<Typography
						variant="h2"
						sx={{
							fontFamily: 'Apercu',
							fontSize: '25px',
							fontWeight: 500,
							textDecoration: 'none',
						}}
						dangerouslySetInnerHTML={{__html: sanitize(product.category.name)}}
						component={Link}
						href={`/designers/${product.category.slug}`}
					/>
					<HtmlBlock
						sx={{margin: '20px 0'}}
						html={product.short_description}
					/>
				</Grid>
			</Grid>
		</Container>
	)
}

export default ProductView;