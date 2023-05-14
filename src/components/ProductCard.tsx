import {useState} from "react";
import {BaseProduct, BaseVariation, Color} from "../types/woocommerce";
import {Box, Button, Card, CardContent, CardMedia, Checkbox, Typography} from "@mui/material";
import {CheckboxProps} from "@mui/material/Checkbox/Checkbox";
import {sanitize} from "../utils/utils";
import CartIcon from "../icons/CartIcon";
import {useDispatch} from "react-redux";
import {addCartItem} from "../redux/cartSlice";

type ProductCardProps = {
    product: BaseProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const [hover, setHover] = useState(false);
    const defaultProduct = {
        id: product.id,
        stock_status: product.stock_status,
        stock_quantity: product.stock_quantity,
        image: product.image,
        price: product.price,
    }
    const [currentProduct, setCurrentProduct] = useState<BaseVariation>(product.variations[0] ?? defaultProduct);
    const dispatch = useDispatch();

    const findVariation = (colorName: string): BaseVariation  =>
        product.variations.find((variation) => variation.attributes?.find((attribute) => attribute.id === 'pa_colore')?.option === colorName) ?? defaultProduct;

    const handleAddToCart = () => {
        if (currentProduct.stock_status === 'instock') {
            dispatch(addCartItem({
                id: currentProduct.id,
                name: product.name,
                image: currentProduct.image,
                price: Number(currentProduct.price),
                qty: 1,
                stock_quantity: Number(currentProduct.stock_quantity),
                attributes: currentProduct.attributes ?? []
            }));
        }
    }

    return (
        <Card
            sx={{width: '100%', height: 'auto'}}
            elevation={0}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <CardMedia
                sx={{ width: '100%', height: '100%', minHeight: 200 }}
                image={currentProduct.image}
            />
            <CardContent sx={{textAlign: 'center', padding: '16px 0'}}>
                <Typography sx={{}} dangerouslySetInnerHTML={{ __html: sanitize(product.category.name)}} />
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: 'Ogg Roman',
                        fontSize: '24px',
                        borderTop: '1px solid',
                        borderBottom: '1px solid',
                        padding: '30px 10px',
                        margin: '10px 0',
                        fontWeight: '300 !important'
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitize(product.name)}}
                />
                <div style={{position: 'relative'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: hover ? 1 : 0, transition: 'opacity .5s ease', position: 'absolute', width: '100%', zIndex: 1}}>
                        <div style={{display: 'flex', gap: '5px'}}>
                            {product.variations[0] && product.colors.map((color) => (
                                <ColorBox
                                    productColor={color}
                                    key={color.slug}
                                    checked={currentProduct.attributes?.find(attr => attr.id === 'pa_colore')?.option === color.slug}
                                    onChange={() => setCurrentProduct(findVariation(color.slug))}
                                />
                            ))}
                        </div>
                        <Button
                            startIcon={currentProduct.stock_status === 'instock' && <CartIcon />}
                            disabled={currentProduct.stock_status !== 'instock'}
                            variant="text"
                            sx={{
                                fontSize: '14px',
                                padding: 0,
                                textTransform: 'none',
                                fontWeight: 300
                            }}
                            onClick={handleAddToCart}
                        >
                            {currentProduct.stock_status !== 'instock' ? 'prodotto non in-stock' : 'Aggiungi al carrello'}
                        </Button>
                    </div>
                    {currentProduct.price && (
                        <Typography sx={{
                            fontSize: '14px',
                            opacity: hover ? 0 : 1,
                            transition: 'opacity .5s ease'
                        }}>{currentProduct.price},00€</Typography>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const ColorBox = ({ productColor, ...checkBoxProps }: { productColor: Color } & CheckboxProps) => {
    return (
        <Checkbox
            icon={<Box key={productColor.slug} sx={{ height: '10px', width: '30px', backgroundColor: productColor.code }} />}
            checkedIcon={<div style={{ border: '1px solid', borderColor: productColor.code}}>
                <Box key={productColor.slug} sx={{ height: '10px', width: '30px', backgroundColor: productColor.code, margin: '2px' }} />
            </div>}
            sx={{
                padding: 0,
                margin: 0
            }}
            {...checkBoxProps}
        />
    )
}

export default ProductCard;