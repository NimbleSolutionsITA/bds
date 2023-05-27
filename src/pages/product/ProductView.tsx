import {AttributeType, ImageDetailed, Product, ProductCategory, Variation} from "../../types/woocommerce";
import {Button, Container, Grid, Tooltip, Typography} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ZoomableImage from "../../components/ZoomableImage";
import {findVariationFromAttributes, getDefaultProduct, sanitize} from "../../utils/utils";
import Link from "../../components/Link";
import HtmlBlock from "../../components/HtmlBlock";
import React, {useState} from "react";
import {addCartItem} from "../../redux/cartSlice";
import {useDispatch} from "react-redux";
import {AttributeCheckboxes} from "../../components/AttributeCheckboxes";
import InStock from "../../icons/InStock";
import SocialShare from "./SocialShare";
import InStockNotifier from "./InStockNotifier";
import Image from "next/image";
import {ArrowForwardIosSharp, ArrowBackIosSharp} from "@mui/icons-material";
import placeholder from "../../images/placeholder.jpg";

type ProductViewProps = {
	product: Product
	category?: ProductCategory
}

const ProductView = ({product, category}: ProductViewProps) => {
	const init = getDefaultProduct(product);
	const defaultProduct = init.defaultProduct as Variation;
	const {defaultAttributes} = init;
	const [currentAttributes, setCurrentAttributes] = useState(defaultAttributes);
	const [currentProduct, setCurrentProduct] = useState(defaultProduct);
	const galleryImages = [
		...(product.gallery.length > 0 ? product.gallery : [product.image] ),
		...product.variations.map(v => ({...v.image, variation: v.id}))
	].filter(v => v)
	const [galleryIndex, setGalleryIndex] = useState(galleryImages.findIndex(v => v.variation === defaultProduct.id));
	const dispatch = useDispatch();

	const handleClickAttribute = async (attribute: AttributeType, slug: string) => {
		const newAttributes = {...currentAttributes, [attribute]: slug};
		await setCurrentAttributes(newAttributes)
		const newProduct = findVariationFromAttributes(product, newAttributes) as Variation ?? defaultProduct
		setCurrentProduct(newProduct)
		const index = galleryImages.findIndex(v => v.variation === newProduct.id)
		if(index !== -1) {
			setGalleryIndex(index)
		}
	}

	const handleAddToCart = () => {
		if (currentProduct.stock_status === 'instock') {
			dispatch(addCartItem({
				product_id: product.id,
				variation_id: product.type === 'variable' ? currentProduct.id : undefined,
				name: product.name,
				image: currentProduct.image.url ?? product.image.url,
				price: Number(currentProduct.price),
				qty: 1,
				stock_quantity: Number(currentProduct.stock_quantity),
				attributes: currentProduct.attributes ?? [],
				category: category?.name ?? '',
				slug: product.slug,
			}));
		}
	}

	return (
		<Container key={product.id}>
			<Grid container spacing={5}>
				<Grid item xs={12} md={7}>
					<Carousel
						animation="slide"
						autoPlay={false}
						index={galleryIndex}
						sx={{
							minHeight: '100%',
							display: 'flex',
							alignItems: 'center',
						}}
						NextIcon={<ArrowForwardIosSharp sx={{fontSize: '40px'}} />}
						PrevIcon={<ArrowBackIosSharp sx={{fontSize: '40px'}} />}
						navButtonsProps={{
							style: {
								background: 'none',
								color: '#000',
							}
						}}
						indicatorContainerProps={{
							style: {
								position: 'absolute',
								bottom: 0,
								zIndex: 1,
								height: '30px',
								background: '#fff',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'flex-end'
							}
						}}
						indicatorIconButtonProps={{
							style: {
								backgroundColor: 'rgba(0,0,0,0.1)',
								margin: '0',
								width: '50px',
								height: '7px',
								borderRadius: '0',
							}
						}}
						activeIndicatorIconButtonProps={{
							style: {
								backgroundColor: '#000',
								margin: '0',
								width: '50px',
								height: '7px',
								borderRadius: '0',
							}
						}}
						IndicatorIcon={galleryImages.map((image) => (
							<Tooltip
								key={image.url}
								arrow
								placement="top"
								title={<TooltipImage image={image} />}
							>
								<div style={{width: '100%', height: '100%'}} />
							</Tooltip>
						))}
					>
						{galleryImages.map((image) => (
							<ZoomableImage key={image.url} img={image.url} ratio={image.width/image.height} />
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
					{category && (
						<Typography
							variant="h2"
							sx={{
								fontFamily: 'Apercu',
								fontSize: '25px',
								fontWeight: 500,
								textDecoration: 'none',
							}}
							dangerouslySetInnerHTML={{__html: sanitize(category.name)}}
							component={Link}
							href={`/designers/${category.slug}`}
						/>
					)}
					{Number(currentProduct.price) > 0 && (
						<Typography variant="h3" sx={{fontFamily: 'Apercu', fontSize: '25px', fontWeight: 300, marginTop: '10px'}} component="div">
							{Number(currentProduct.price)} €
						</Typography>
					)}
					<HtmlBlock
						sx={{margin: '20px 0', paddingBottom: '20px', borderBottom: '1px solid'}}
						html={product.short_description}
					/>
					<AttributeCheckboxes
						product={product}
						currentAttributes={currentAttributes}
						handleClickAttribute={handleClickAttribute}
						extended
					/>
					{currentProduct.stock_status !== 'instock' ? (
						<InStockNotifier
							productId={product.id}
							variationId={currentProduct.id}
						/>
					) : (
						<Typography sx={{fontSize: '18px', display: 'flex', fontStyle: 'italic', margin: '10px 0'}}>
							<InStock sx={{fontSize: '30px', marginRight: '10px'}}/> disponibile
						</Typography>
					)}
					{currentProduct.stock_status === 'instock'  && (
						<Button
							onClick={handleAddToCart}
							fullWidth
							sx={{
								marginTop: '20px',
							}}
						>
							Aggiungi alla shopping bag
						</Button>
					)}
					<SocialShare
						facebookUrl={'/'}
						facebookMessengerAppId={'/'}
						facebookMessengerUrl={'/'}
						whatsappUrl={'/'}
						telegramUrl={'/'}
						twitterUrl={'/'}
						emailUrl={'/'}
					/>
					<Typography sx={{marginTop: '20px'}}>
						<b>Costi di spedizione</b> gratuiti per ordini superiori a 150€.
						<br/>
						<b>Spedizione in Italia</b> entro 24/48 ore con corriere DHL o GLS.
						<br />
						<b>Spedizione in Europa</b> entro 2/3 giorni con corrire DHL o GLS.
					</Typography>
				</Grid>
			</Grid>
		</Container>
	)
}

const TooltipImage = ({image}: {image: ImageDetailed}) => {
	const [img, setImg] = useState(image.url);
	return (
		<div style={{width: '250px', height: 250 * image.height / image.width, position: 'relative', margin: '5px 0'}}>
			<Image
				src={img}
				fill
				alt={image.alt}
				style={{objectFit: 'contain'}}
				onError={() => setImg(placeholder.src)}
			/>
		</div>
	)
}

export default ProductView;