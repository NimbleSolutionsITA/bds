import {
	AttributeType,
	ImageDetailed,
	Product,
	ProductCategory,
	ShippingClass,
	Variation
} from "../../types/woocommerce";
import {Button, Container, Grid, Tooltip, Typography} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ZoomableImage from "../../components/ZoomableImage";
import {findVariationFromAttributes, getDefaultProduct, sanitize} from "../../utils/utils";
import Link from "../../components/Link";
import HtmlBlock from "../../components/HtmlBlock";
import React, {useState} from "react";
import {addCartItem} from "../../redux/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {AttributeCheckboxes} from "../../components/AttributeCheckboxes";
import InStock from "../../icons/InStock";
import Image from "next/image";
import {ArrowForwardIosSharp, ArrowBackIosSharp} from "@mui/icons-material";
import placeholder from "../../images/placeholder.jpg";
import {RootState} from "../../redux/store";
import PriceFormat from "../../components/PriceFormat";
import StripePaymentButton from "../../components/StripePaymentButton";
import {openInStockNotifierDrawer} from "../../redux/layout";
import DHL from "../../icons/DHL";
import GLS from "../../icons/GLS";
import {useTranslation} from "next-i18next";
import {Trans} from "react-i18next";

type ProductViewProps = {
	product: Product
	category?: ProductCategory
	shipping: ShippingClass[]
}

const ProductView = ({product, category, shipping}: ProductViewProps) => {
	const init = getDefaultProduct(product);
	const { items, cartDrawerOpen } = useSelector((state: RootState) => state.cart);
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
	const { t } = useTranslation('common');
    const cartQuantity = items.find(v =>
	    v.product_id === product.id &&
	    v.variation_id === (product.type === 'variable' ? currentProduct.id : undefined)
    )?.qty ?? 0;
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

	const cartItem = {
		product_id: product.id,
		variation_id: product.type === 'variable' ? currentProduct.id : undefined,
		name: product.name,
		image: currentProduct.image.url ?? product.image.url,
		price: parseFloat(currentProduct.price as string),
		qty: 1,
		stock_quantity: Number(currentProduct.stock_quantity),
		attributes: currentProduct.attributes ?? [],
		category: category?.name ?? '',
		slug: product.slug,
	}

	const handleAddToCart = () => {
		if (currentProduct.stock_status === 'instock') {
			dispatch(addCartItem(cartItem));
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
					{cartItem.price > 0 && (
						<Typography variant="h3" sx={{fontFamily: 'Apercu', fontSize: '25px', fontWeight: 300, marginTop: '10px'}} component="div">
							<PriceFormat value={cartItem.price} decimalScale={0} />
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
						<>
							<Typography sx={{margin: '20px 0'}}>
								{t('notifier.title')}
							</Typography>
							<Button
								fullWidth
								onClick={() => dispatch(openInStockNotifierDrawer({
									productId: product.id,
									variationId: product.type === 'variable' ? currentProduct.id : undefined,
									name: product.name,
									category: category?.name,
									attributes: currentProduct.attributes?.map((attribute) => attribute.option).join(', ')

								}))}
								sx={{marginTop: '20px'}}
							>
								{t('notifier.cta')}
							</Button>
						</>
					) : (
						<Typography sx={{fontSize: '18px', display: 'flex', fontStyle: 'italic', margin: '10px 0'}}>
							<InStock sx={{fontSize: '30px', marginRight: '10px'}}/> {t('available').toLowerCase()}
						</Typography>
					)}
					{currentProduct.stock_status === 'instock'  && (
						<Button
							onClick={handleAddToCart}
							fullWidth
							disabled={cartQuantity >= (currentProduct.stock_quantity ?? 0)}
							sx={{
								marginTop: '20px',
							}}
						>
							{t('cart.add')}
						</Button>
					)}
					{!cartDrawerOpen && cartItem.stock_quantity > 0 && cartItem.price > 0 && (
						<div style={{marginTop: '20px'}}>
							<StripePaymentButton  items={[cartItem]} shipping={shipping} />
						</div>
					)}
					<div style={{marginTop: '20px', lineHeight: 1}}>
						<Typography component="div" sx={{marginTop: '20px'}}>
							<DHL sx={{fontSize: '40px', marginRight: '10px'}} />
							<GLS sx={{fontSize: '40px'}} />
							<br />
							<Trans i18nKey="shipping.line1b" components={[<b key={0} />]} />
							<br/>
							<Trans i18nKey="shipping.line2b" components={[<b key={0} />]} />
							<br />
							<Trans i18nKey="shipping.line3b" components={[<b key={0} />]} />
						</Typography>
					</div>
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