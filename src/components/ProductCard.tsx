import {useState} from "react";
import {
    AttributeType, BaseCategory,
    BaseProduct,
    BaseVariation,
} from "../types/woocommerce";
import {Box, Button, Card, CardContent, CircularProgress, Typography} from "@mui/material";
import {
    EYEWEAR_CATEGORIES,
    findVariationFromAttributes,
    getDefaultProduct, getProductMainCategory,
    sanitize
} from "../utils/utils";
import CartIcon from "../icons/CartIcon";
import {useDispatch, useSelector} from "react-redux";
import {addCartItem} from "../redux/cartSlice";
import Image from "next/image";
import Link from "./Link";
import placeholder from "../images/placeholder.jpg";
import blur from "../images/blur.jpg";
import {AttributeCheckboxes} from "./AttributeCheckboxes";
import PriceFormat from "./PriceFormat";
import {openInStockNotifierDrawer} from "../redux/layout";
import {DESIGNERS_SUB_PATH, PRODUCT_SUB_PATH} from "../utils/endpoints";
import {useTranslation} from "next-i18next";
import {AppDispatch, RootState} from "../redux/store";


type ProductCardProps = {
    product: BaseProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const isEyewear = product.categories.find(({id, parent }) =>
        EYEWEAR_CATEGORIES.includes(id) || EYEWEAR_CATEGORIES.includes(parent as number)
    ) !== undefined;
    const imageRatio = isEyewear ? 45 : 130;
    const init = getDefaultProduct(product);
    const defaultProduct = init.defaultProduct as BaseVariation;
    const {defaultAttributes} = init;

    const [currentAttributes, setCurrentAttributes] = useState(defaultAttributes);
    const [currentProduct, setCurrentProduct] = useState(defaultProduct);
    const [currentImage, setCurrentImage] = useState<string>(currentProduct.image);
    const category = getProductMainCategory(product);

    const handleClickAttribute = async (attribute: AttributeType, slug: string) => {
        const newAttributes = {...currentAttributes, [attribute]: slug};
        await setCurrentAttributes(newAttributes)
        const newProduct = findVariationFromAttributes(product, newAttributes) as BaseVariation ?? defaultProduct
        setCurrentProduct(newProduct)
        setCurrentImage(newProduct.image ?? product.image ?? placeholder)
    }

    const hasAttributes = Object.keys(product.attributes).length > 0

    return (
        <Card
            key={currentProduct.id}
            sx={{width: '100%', height: 'auto'}}
            elevation={0}
        >
            <Link href={`/${PRODUCT_SUB_PATH}/${product.slug}`}>
                <Box sx={{width: '100%', paddingBottom: imageRatio+'%', position: 'relative'}}>
                    <Image
                        src={currentImage}
                        alt={product.name}
                        fill
                        style={{objectFit: 'cover', objectPosition: 'center center'}}
                        onError={() => setCurrentImage(placeholder.src)}
                        placeholder="blur"
                        blurDataURL={blur.blurDataURL}
                    />
                </Box>
            </Link>
            <CardContent sx={{textAlign: 'center', padding: '16px 0', marginBottom: '20px'}}>
                {category &&(
                    <Link prefetch={false} href={`/${DESIGNERS_SUB_PATH}/${category.slug}`} style={{textDecoration: 'none'}}>
                        <Typography sx={{textDecoration: 'none'}} dangerouslySetInnerHTML={{ __html: sanitize(category.name)}} />
                    </Link>
                )}
                <div style={{
                    margin: '10px 0',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    height: '90px',
                    borderTop: '1px solid',
                    borderBottom: '1px solid'
                }}>
                    <Link prefetch={false} href={`/${PRODUCT_SUB_PATH}/${product.slug}`} style={{textDecoration: 'none', width: '100%'}}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: 'Ogg Roman',
                                fontSize: '24px',
                                width: '100%',
                                fontWeight: '300 !important'
                            }}
                            dangerouslySetInnerHTML={{ __html: sanitize(product.name)}}
                        />
                    </Link>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    zIndex: 2
                }}>
                    {hasAttributes ? (
                        <AttributeCheckboxes
                            product={product}
                            currentAttributes={currentAttributes}
                            handleClickAttribute={handleClickAttribute}
                        />
                    ) : (
                        <ActionButton product={product} currentProduct={currentProduct} category={category} />
                    )}
                    <Typography fontSize="20px">
                        {currentProduct.price ?
                            <PriceFormat value={parseFloat(currentProduct.price as string)} decimalScale={0} /> : '-'
                        }
                    </Typography>
                </div>
                {hasAttributes && (
                    <ActionButton product={product} currentProduct={currentProduct} category={category} />
                )}
            </CardContent>
        </Card>
    );
};

type ActionButtonProps = {
    currentProduct: BaseVariation,
    product: BaseProduct
    category: BaseCategory
}
const ActionButton = ({ currentProduct, product, category }: ActionButtonProps) => {
    const { t } = useTranslation();
    const { loading } = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch<AppDispatch>();
    const inStock = currentProduct.stock_status === 'instock' && currentProduct.price
    const getStartIcon = () => {
        if (inStock && !loading) {
            return <CartIcon />
        }
        if (inStock && loading) {
            return <CircularProgress size={20} color="inherit" />
        }
        return null
    }

    const handleAddToCart = () => {
        if (currentProduct.stock_status === 'instock') {
            dispatch(addCartItem({
                id: currentProduct.id.toString(),
                quantity: '1',
                variation: currentProduct.attributes?.reduce(
                    (result:  { [key: string]: string }, item) => {
                        result['attribute_' + item.id] = item.option;
                        return result;
                    },
                    {}
                ),
                item_data: {
                    category: category.name,
                    priceEU: currentProduct.price_eu ?? ''
                }
            }))
        }
    }

    const handleNotifyMe = () => dispatch(openInStockNotifierDrawer({
        productId: product.id,
        variationId: product.id !== currentProduct.id ? currentProduct.id : undefined,
        name: product.name,
        category: category?.name,
        attributes: currentProduct.attributes?.map((attribute) => attribute.option).join(', ')
    }))
    return (
        <Button
            size="small"
            variant="text"
            onClick={inStock ? handleAddToCart : handleNotifyMe}
            startIcon={getStartIcon()}
            sx={{
                minWidth: '90px',
                fontSize: '12px',
                padding: '10px'
            }}
        >
            {t(inStock  ? 'addToCart' : 'notify me')}
        </Button>
    )
}

export default ProductCard;