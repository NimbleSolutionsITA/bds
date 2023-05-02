import {AcfProduct} from "../types/woocommerce";
import {Card, CardContent, CardMedia, Typography} from "@mui/material";

type ProductCardProps = {
    product: AcfProduct;
    width?: string | number;
}

const ProductCard = ({ product, width = '100%' }: ProductCardProps) => {

    return (
        <Card
            sx={{width, height: 'auto'}}
            elevation={0}
        >
            <CardMedia
                sx={{ width: '100%', height: '100%', minHeight: 200 }}
                image={product.image}
            />
            <CardContent sx={{textAlign: 'center'}}>
                <Typography sx={{}}>{product.category.name}</Typography>
                <Typography variant="h3" sx={{
                    fontFamily: 'Ogg Roman',
                    fontSize: '24px',
                    borderTop: '1px solid',
                    borderBottom: '1px solid',
                    padding: '30px 10px',
                    margin: '10px 0',
                    fontWeight: '300 !important'
                }}>
                    {product.name}
                </Typography>
                <Typography sx={{fontSize: '14px'}}>{product.price},00€</Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCard;