import {
	AttributeType, Country,
	ImageDetailed,
	Product,
	ProductCategory,
	ShippingClass,
	Variation
} from "../../types/woocommerce";
import {Button, Container, Grid2 as Grid, Tooltip, Typography} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ZoomableImage from "../../components/ZoomableImage";
import {
	EYEWEAR_CATEGORIES,
	findVariationFromAttributes,
	FRAGRANCES_CATEGORY,
	getDefaultProduct,
	sanitize
} from "../../utils/utils";
import Link from "../../components/Link";
import HtmlBlock from "../../components/HtmlBlock";
import React, {useEffect, useState} from "react";
import {addCartItem, initialCart} from "../../redux/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {AttributeCheckboxes} from "../../components/AttributeCheckboxes";
import InStock from "../../icons/InStock";
import Image from "next/image";
import {ArrowForwardIosSharp, ArrowBackIosSharp} from "@mui/icons-material";
import placeholder from "../../images/placeholder.jpg";
import {AppDispatch, RootState} from "../../redux/store";
import PriceFormat from "../../components/PriceFormat";
import {openInStockNotifierDrawer} from "../../redux/layoutSlice";
import DHL from "../../icons/DHL";
import GLS from "../../icons/GLS";
import {useTranslation} from "next-i18next";
import {Trans} from "react-i18next";
import {DESIGNERS_SUB_PATH} from "../../utils/endpoints";
import SaveMoney from "../../icons/SaveMoney";
import FastShipping from "../../icons/FastShipping";
import EuShipping from "../../icons/EuShipping";
import AppleGooglePayButtons from "../../components/AppleGooglePayButtons";

type ProductViewProps = {
	product: Product
	category?: ProductCategory
	shipping: ShippingClass[]
	countries: Country[]
}

const removeDuplicates = (array: ImageDetailed[]) => {
	let uniqueUrls: string[] = [];
	return array.filter((item) => {
		if (!uniqueUrls.includes(item.url)) {
			uniqueUrls.push(item.url);
			return true;
		}
		return false;
	})
}

const ProductView = ({product, category, shipping, countries}: ProductViewProps) => {
	const { cart: { customer: { shipping_address: { shipping_country }} } = initialCart } = useSelector((state: RootState) => state.cart);
	const isEU = !!shipping_country && shipping_country !== 'IT'
	const init = getDefaultProduct(product);
	const isEyewear = product.categories.find(({id, parent }) =>
		EYEWEAR_CATEGORIES.includes(id) || EYEWEAR_CATEGORIES.includes(parent as number)
	) !== undefined;
	const { cart, cartDrawerOpen } = useSelector((state: RootState) => state.cart);
	const defaultProduct = init.defaultProduct as Variation;
	const {defaultAttributes} = init;
	const [currentAttributes, setCurrentAttributes] = useState(defaultAttributes);
	const [currentProduct, setCurrentProduct] = useState(defaultProduct);

	const galleryImages = removeDuplicates([...product.gallery, ...product.variations.map(v => v.image)])


	const [galleryIndex, setGalleryIndex] = useState(galleryImages.findIndex(v => v.url === defaultProduct.image.url) ?? 0);
	const dispatch = useDispatch<AppDispatch>();
	const { t } = useTranslation('common');
    const cartQuantity = cart?.items?.find(v => [product.id, currentProduct.id].includes(v.id))?.quantity.value ?? 0;
	const categoryLink = (category && (Object.values(FRAGRANCES_CATEGORY).includes(category.parent as number) ? '/' + category.slug : '/' +  DESIGNERS_SUB_PATH + '/' + category.slug)) ?? ''

	const handleClickAttribute = async (attribute: AttributeType, slug: string) => {
		const newAttributes = {...currentAttributes, [attribute]: slug};
		await setCurrentAttributes(newAttributes)
		const newProduct = findVariationFromAttributes(product, newAttributes) as Variation ?? defaultProduct
		setCurrentProduct(newProduct)
		setGalleryIndex(galleryImages.findIndex(v => v.url === newProduct.image?.url) ?? 0)
	}

	const cartItem = {
		price: parseFloat(currentProduct.price as string),
		priceEU: currentProduct.price_eu ? parseFloat(currentProduct.price_eu) : undefined,
		stock_quantity: Number(currentProduct.stock_quantity),
	}

	const addCartItemPayload = {
		id: currentProduct.id.toString(),
		quantity: '1',
		variation: currentProduct.attributes?.reduce((result: { [key: string]: string }, attribute) => {
			result[`attribute_${attribute.id}`] = attribute.option;
			return result;
		}, {}),
		item_data: {
			category: category?.name ?? '',
			priceEU: currentProduct.price_eu ?? '',
		}
	}

	const handleAddToCart = () => {
		if (currentProduct.stock_status === 'instock') {
			dispatch(addCartItem(addCartItemPayload))
		}
	}

	useEffect(() => {
		setCurrentAttributes(defaultAttributes)
		setCurrentProduct(defaultProduct)
	}, [product.id]);


	return (
		<Container key={product.id}>
			<Grid container spacing={5}>
				<Grid component="div" size={{xs: 12, md: isEyewear ? 7 : 5, lg: isEyewear ? 7 : 4, xl: isEyewear ? 7 : 3}}>
					<Carousel
						animation="slide"
						autoPlay={false}
						index={galleryIndex}
						sx={{
							/*minHeight: isEyewear ? '100%' : undefined,
							maxHeight: isEyewear ? '1000px' : undefined,*/
							display: 'flex',
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
				<Grid component="div" size={{xs: 12, md: isEyewear ? 5 : 7, lg: isEyewear ? 5 : 8, xl: isEyewear ? 5 : 9}}>
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
							href={categoryLink}
						/>
					)}
					{cartItem.price > 0 && (
						<Typography variant="h3" sx={{fontFamily: 'Apercu', fontSize: '25px', fontWeight: 300, marginTop: '10px'}} component="div">
							<PriceFormat value={isEU ? (cartItem.priceEU ?? cartItem.price) : cartItem.price} decimalScale={0} />
						</Typography>
					)}
					{product.short_description && (
						<HtmlBlock
							sx={{margin: '20px 0', paddingBottom: '20px', borderBottom: '1px solid'}}
							html={product.short_description}
						/>
					)}
					<AttributeCheckboxes
						product={product}
						currentAttributes={currentAttributes}
						handleClickAttribute={handleClickAttribute}
						extended
					/>
					{currentProduct.stock_status === 'instock' && currentProduct.price ? (
						<Typography sx={{fontSize: '18px', display: 'flex', fontStyle: 'italic', margin: '10px 0'}}>
							<InStock sx={{fontSize: '30px', marginRight: '10px'}}/> {t('available').toLowerCase()}
						</Typography>
					) : (
						<>
							<Typography sx={{margin: '20px 0'}}>
								{t('notifier.title')}
							</Typography>
							<Button
								onClick={() => dispatch(openInStockNotifierDrawer({
									productId: product.id,
									variationId: product.type === 'variable' ? currentProduct.id : undefined,
									name: product.name,
									category: category?.name,
									attributes: currentProduct.attributes?.map((attribute) => attribute.option).join(', ')

								}))}
								sx={{marginTop: '20px', width: '250px', height: '48px'}}
							>
								{t('notifier.cta')}
							</Button>
						</>
					)}
					<div style={{display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap'}}>
						{currentProduct.stock_status === 'instock'  && (
							<>
								<Button
									onClick={handleAddToCart}
									disabled={cartQuantity >= (currentProduct.stock_quantity ?? 0)}
									sx={{
										width: '250px',
										height: '48px'
									}}
								>
									{t('cart.add')}
								</Button>
								<AppleGooglePayButtons
									item={addCartItemPayload}
									shipping={{classes: shipping, countries}}
									buttonWidth="250px"
								/>
							</>
						)}
					</div>
					<div style={{marginTop: '40px', lineHeight: 1}}>
						<div>
							<DHL sx={{fontSize: '40px', marginRight: '10px'}} />
							<GLS sx={{fontSize: '40px'}} />
						</div>
						<div style={{display: 'flex', alignItems: 'center'}}>
							<SaveMoney fontSize="medium" sx={{marginRight: '10px'}} />
							<Typography><Trans i18nKey="shipping.line1b" components={[<b key={0} />]} /></Typography>
						</div>
						<div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
							<FastShipping fontSize="medium" sx={{marginRight: '10px'}} />
							<Typography><Trans i18nKey="shipping.line2b" components={[<b key={0} />]} /></Typography>
						</div>
						<div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
							<EuShipping fontSize="medium" sx={{marginRight: '10px'}} />
							<Typography><Trans i18nKey="shipping.line3b" components={[<b key={0} />]} /></Typography>
						</div>
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