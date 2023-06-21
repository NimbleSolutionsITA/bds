import {useState} from "react";
import {
    AttributeType,
    BaseProduct,
    BaseVariation,
} from "../types/woocommerce";
import {Box, Card, CardContent, IconButton, Typography} from "@mui/material";
import {
    EYEWEAR_CATEGORY,
    findVariationFromAttributes,
    getDefaultProduct,
    MAIN_CATEGORIES, OPTICAL_CATEGORY,
    sanitize, SUNGLASSES_CATEGORY
} from "../utils/utils";
import CartIcon from "../icons/CartIcon";
import {useDispatch} from "react-redux";
import {addCartItem} from "../redux/cartSlice";
import Image from "next/image";
import Link from "./Link";
import placeholder from "../images/placeholder.jpg";
import blur from "../images/blur.jpg";
import {AttributeCheckboxes} from "./AttributeCheckboxes";
import PriceFormat from "./PriceFormat";

type ProductCardProps = {
    product: BaseProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const eyewearCategories = [
        SUNGLASSES_CATEGORY.it,
        SUNGLASSES_CATEGORY.en,
        OPTICAL_CATEGORY.it,
        OPTICAL_CATEGORY.en,
        EYEWEAR_CATEGORY.it,
        EYEWEAR_CATEGORY.en,
    ];
    const isEyewear = product.categories.find(({id, parent }) =>
        eyewearCategories.includes(id) || eyewearCategories.includes(parent)
    ) !== undefined;
    const imageRatio = isEyewear ? 45 : 130;
    const [hover, setHover] = useState(false);
    const init = getDefaultProduct(product);
    const defaultProduct = init.defaultProduct as BaseVariation;
    const {defaultAttributes} = init;

    const [currentAttributes, setCurrentAttributes] = useState(defaultAttributes);
    const [currentProduct, setCurrentProduct] = useState(defaultProduct);
    const [currentImage, setCurrentImage] = useState<string>(currentProduct.image);

    const dispatch = useDispatch();
    const category = product.categories.find((cat) => MAIN_CATEGORIES.includes(cat.parent)) ?? product.categories[0];

    const handleClickAttribute = async (attribute: AttributeType, slug: string) => {
        const newAttributes = {...currentAttributes, [attribute]: slug};
        await setCurrentAttributes(newAttributes)
        const newProduct = findVariationFromAttributes(product, newAttributes) as BaseVariation ?? defaultProduct
        setCurrentProduct(newProduct)
        setCurrentImage(newProduct.image ?? product.image ?? placeholder)
    }

    const handleAddToCart = () => {
        if (currentProduct.stock_status === 'instock') {
            dispatch(addCartItem({
                product_id: product.id,
                variation_id: product.id !== currentProduct.id ? currentProduct.id : undefined,
                name: product.name,
                image: currentProduct.image ?? product.image,
                price: Number(currentProduct.price),
                qty: 1,
                stock_quantity: Number(currentProduct.stock_quantity),
                attributes: currentProduct.attributes ?? [],
                category: category.name,
                slug: product.slug,
            }));
        }
    }

    return (
        <Card
            key={currentProduct.id}
            sx={{width: '100%', height: 'auto'}}
            elevation={0}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Link href={`/products/${product.slug}`}>
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
            <CardContent sx={{textAlign: 'center', padding: '16px 0'}}>
                {category &&(
                    <Link href={`/designers/${category.name}`} style={{textDecoration: 'none'}}>
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
                    <Link href={`/products/${product.slug}`} style={{textDecoration: 'none', width: '100%'}}>
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
                <div style={{position: 'relative', paddingBottom: hover ? 0 : '27px'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: (!isEyewear || hover) ? 1 : 0,
                        transition: 'opacity .5s ease',
                        width: '100%',
                        zIndex: 2
                    }}>
                        <AttributeCheckboxes
                            product={product}
                            currentAttributes={currentAttributes}
                            handleClickAttribute={handleClickAttribute}
                        />
                        <IconButton
                            size="small"
                            onClick={handleAddToCart}
                            disabled={currentProduct.stock_status !== 'instock' || !currentProduct.price}
                        >
                            <CartIcon />
                        </IconButton>
                    </div>
                    <Typography sx={{
                        fontSize: currentProduct.price ?  '20px' : '16px',
                        top: '3px',
                        left: 'calc(50% - 50px)',
                        position:  (hover && isEyewear) ?  'relative' : 'absolute',
                        width: '100px'
                    }}>
                        {currentProduct.price ?
                            <PriceFormat value={parseFloat(currentProduct.price as string)} decimalScale={0} /> : 'upon request'
                        }
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;