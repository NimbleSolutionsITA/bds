import {useDispatch} from "react-redux";
import {Box, IconButton, Typography} from "@mui/material";
import {DeleteOutlineSharp} from "@mui/icons-material";
import {CartItem as CartItemType, deleteCartItem} from "../../redux/cartSlice";
import Image from "next/image";
import Minus from "./Minus";
import Plus from "./Plus";
import PriceFormat from "../../components/PriceFormat";

type CartItemProps = {
	item: CartItemType
}
const CartItem = ({item}: CartItemProps) => {
	const dispatch = useDispatch()
	return (
		<Box sx={{
			border: '1px solid #fff',
			display: 'flex',
			minHeight: '94px',
		}}>
			<div style={{
				width: '25%',
				height: '100%',
				backgroundColor: '#fff',
				display: 'flex',
				alignItems: 'center',
				position: 'relative',
				borderRight: '1px solid #fff'
			}}>
				<Image
					src={item.image}
					alt={item.name}
					fill
					style={{objectFit: 'contain'}}

				/>
			</div>
			<div style={{width: '75%', padding: '10px', position: 'relative'}}>
				<Typography sx={{fontWeight: 500, lineHeight: '16px', marginBottom: '8px'}}>
					{item.category} - {item.name}<br />
					<PriceFormat value={item.price} decimalScale={0} />
				</Typography>
				{item.attributes.map((attribute) => (
					<Typography sx={{fontSize: '12px', lineHeight: '16px'}} key={attribute.id}>
						{attribute.id.toString().replace("pa_", "").toUpperCase()}: {attribute.name}
					</Typography>
				))}
				<Typography sx={{fontSize: '12px', lineHeight: '16px'}}>
					QUANTITÀ: <Minus item={item} />{item.qty}<Plus item={item} />
				</Typography>
				<IconButton
					size="small"
					onClick={() => dispatch(deleteCartItem({ product_id: item.product_id, variation_id: item.variation_id}))}
					sx={{position: 'absolute', bottom: '5px', right: '5px'}}
				>
					<DeleteOutlineSharp fontSize="small" />
				</IconButton>
			</div>
		</Box>
	)
}

export default CartItem