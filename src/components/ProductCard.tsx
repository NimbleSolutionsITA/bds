import {useState} from "react";
import {BaseProduct, BaseVariation, Color, ImageColor, TextAttribute} from "../types/woocommerce";
import {Box, Card, CardContent, CardMedia, Checkbox, IconButton, Typography} from "@mui/material";
import {CheckboxProps} from "@mui/material/Checkbox/Checkbox";
import {sanitize} from "../utils/utils";
import CartIcon from "../icons/CartIcon";
import {useDispatch} from "react-redux";
import {addCartItem} from "../redux/cartSlice";

type ColorAttribute = 'colore'|'lente'|'modello'|'montatura'
type ImageAttribute = 'montaturaLenti'
type BaseAttribute = 'calibro'|'formato'

type AttributeType = BaseAttribute|ImageAttribute|ColorAttribute

type CurrentAttribute = {
    [key in AttributeType]?: string
}

type ProductCardProps = {
    product: BaseProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const [hover, setHover] = useState(false);
    const defaultProduct = product.variations[0] ?? {
        id: product.id,
        stock_status: product.stock_status,
        stock_quantity: product.stock_quantity,
        image: product.image,
        price: product.price,
        attributes: Object.keys(product.attributes).map((key) => {
            const attributes = product.attributes[key as AttributeType];
            return ({
                id: 'pa_' + (key === 'montaturaLenti' ? 'montatura-lenti' : key),
                name: attributes && attributes[0].name,
                option: attributes && attributes[0].slug
            })
        })
    }

    const defaultCurrentAttributes: CurrentAttribute = defaultProduct.attributes ? defaultProduct.attributes.reduce((obj, item) => {
        const key = item.id.toString().replace("pa_", ""); // remove "pa_" prefix from id
        obj[key] = item.option;
        return obj;
    }, {} as {[key: string]: string}) : {};

    const [currentAttributes, setCurrentAttributes] = useState<CurrentAttribute>(defaultCurrentAttributes);

    const [currentProduct, setCurrentProduct] = useState<BaseVariation>(defaultProduct);
    const dispatch = useDispatch();

    const handleClickAttribute = async (attribute: AttributeType, slug: string) => {
        const newAttributes = {...currentAttributes, [attribute]: slug};
        await setCurrentAttributes(newAttributes)
        setCurrentProduct(
            product.variations.find(
                (variation) => {
                    return (
                        (!newAttributes.colore || variation.attributes?.find((attribute) => attribute.id === 'pa_colore')?.option === newAttributes.colore) &&
                        (!newAttributes.lente || variation.attributes?.find((attribute) => attribute.id === 'pa_lente')?.option === newAttributes.lente) &&
                        (!newAttributes.modello || variation.attributes?.find((attribute) => attribute.id === 'pa_modello')?.option === newAttributes.modello) &&
                        (!newAttributes.montatura || variation.attributes?.find((attribute) => attribute.id === 'pa_montatura')?.option === newAttributes.montatura) &&
                        (!newAttributes.montaturaLenti || variation.attributes?.find((attribute) => attribute.id === 'pa_montaturaL-lenti')?.option === newAttributes.montaturaLenti) &&
                        (!newAttributes.calibro || variation.attributes?.find((attribute) => attribute.id === 'pa_calibro')?.option === newAttributes.calibro) &&
                        (!newAttributes.formato || variation.attributes?.find((attribute) => attribute.id === 'pa_formato')?.option === newAttributes.formato)
                    )
                }
            ) ?? defaultProduct
        )
    }

    const handleAddToCart = () => {
        if (currentProduct.stock_status === 'instock') {
            dispatch(addCartItem({
                id: currentProduct.id,
                name: product.name,
                image: currentProduct.image ?? product.image,
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
                sx={{ width: '100%', height: '100%', minHeight: 250 }}
                image={currentProduct.image}
            />
            <CardContent sx={{textAlign: 'center', padding: '16px 0'}}>
                <Typography sx={{}} dangerouslySetInnerHTML={{ __html: sanitize(product.category.name)}} />
                <div style={{
                    margin: '10px 0',
                    padding: '10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    height: '90px',
                    borderTop: '1px solid',
                    borderBottom: '1px solid'
                }}>
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
                </div>
                <div style={{position: 'relative'}}>
                    {currentProduct.price && (
                        <Typography sx={{
                            fontSize: '14px',
                            opacity: hover ? 0 : 1,
                            transition: 'opacity .5s ease',
                            position: 'absolute',
                            width: '100%',
                        }}>{Number(currentProduct.price)},00€</Typography>
                    )}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: hover ? 1 : 1,
                        transition: 'opacity .5s ease',
                        width: '100%',
                        zIndex: 1
                    }}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px', width: 'calc(100% - 40px)'}}>
                            {['colore', 'lente', 'modello', 'montatura'].map((attribute) => {
                                const attributes = product.attributes[attribute as ColorAttribute];
                                return Array.isArray(attributes) ? (
                                    <div key={attribute} style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                                        {attributes.map((color) => (
                                            <ColorBox
                                                title={attribute + ' - ' + color.name }
                                                productColor={color}
                                                key={color.slug}
                                                checked={currentAttributes[attribute as ColorAttribute] === color.slug}
                                                onChange={() => handleClickAttribute(attribute as ColorAttribute, color.slug)}
                                            />
                                        ))}
                                    </div>
                                ) : null
                            })}
                            {Array.isArray(product.attributes.montaturaLenti) ? (
                                <div key="montaturaLenti" style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                                    {product.attributes.montaturaLenti.map((color) => (
                                        <ImageBox
                                            title={'montatura lenti' + ' - ' + color.name }
                                            productColor={color}
                                            key={color.slug}
                                            checked={currentAttributes.montaturaLenti === color.slug}
                                            onChange={() => handleClickAttribute('montaturaLenti', color.slug)}
                                        />
                                    ))}
                                </div>
                            ) : null}
                            {['calibro', 'formato'].map((attributeName) => {
                                const attributes = product.attributes[attributeName as BaseAttribute];
                                return Array.isArray(attributes) ? (
                                    <div key={attributeName} style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                                        {attributes.map((attribute) => (
                                            <TextBox
                                                title={attributeName + ' - ' + attribute.name }
                                                attribute={attribute}
                                                key={attribute.slug}
                                                checked={currentAttributes[attributeName as BaseAttribute] === attribute.slug}
                                                onChange={() => handleClickAttribute(attributeName as BaseAttribute, attribute.slug)}
                                            />
                                        ))}
                                    </div>
                                ) : null
                            })}
                        </div>
                        <IconButton
                            size="small"
                            onClick={handleAddToCart}
                            disabled={currentProduct.stock_status !== 'instock'}
                        >
                            <CartIcon />
                        </IconButton>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const ColorBox = ({ productColor, ...checkBoxProps }: { productColor: Color } & CheckboxProps) => {
    return (
        <Checkbox
            icon={<Box sx={{ height: '10px', width: '30px', backgroundColor: productColor.code }} />}
            checkedIcon={<div style={{ border: '1px solid', borderColor: productColor.code}}>
                <Box sx={{ height: '10px', width: '30px', backgroundColor: productColor.code, margin: '2px' }} />
            </div>}
            sx={{
                padding: 0,
                margin: 0
            }}
            {...checkBoxProps}
        />
    )
}

const ImageBox = ({ productColor, ...checkBoxProps }: { productColor: ImageColor } & CheckboxProps) => {
    return (
        <Checkbox
            icon={<img src={productColor.image} alt={productColor.name} width="30" height="10" />}
            checkedIcon={<div style={{ border: '1px solid #000', padding: '2px', height: '16px', width: '36px'}}>
                <img src={productColor.image} width="30" height="10" style={{display: 'block'}} alt={productColor.name} />
            </div>}
            sx={{
                padding: 0,
                margin: 0
            }}
            {...checkBoxProps}
        />
    )
}

const TextBox = ({ attribute, ...checkBoxProps }: { attribute: TextAttribute } & CheckboxProps) => {
    const AttributeBox = ({isChecked}: {isChecked?: boolean}) => (
        <Box sx={{
            height: isChecked ? '16px' : '14px',
            minWidth: isChecked ? '36px' : '30px',
            border: '1px solid #000',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isChecked ? '#fff' : '#000',
            backgroundColor: isChecked ? '#000' : '#fff',
            fontSize: '10px',
            fontWeight: isChecked ? 700 : 300,
        }}>
            {attribute.name}
        </Box>
    )
    return (
        <Checkbox
            icon={<AttributeBox />}
            checkedIcon={<AttributeBox isChecked />}
            sx={{
                padding: 0,
                margin: 0
            }}
            {...checkBoxProps}
        />
    )
}

export default ProductCard;