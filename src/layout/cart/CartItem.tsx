import {useDispatch} from "react-redux";
import {Box, IconButton, Typography} from "@mui/material";
import {DeleteOutlineSharp} from "@mui/icons-material";
import {CartItem as CartItemType, deleteCartItem} from "../../redux/cartSlice";

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
				paddingBottom: '15%',
				backgroundImage: `url(${item.image})`,
				backgroundSize: 'contain',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center center',
				backgroundColor: '#fff'
			}} />
			<div style={{width: '75%', padding: '10px', position: 'relative'}}>
				<Typography sx={{fontFamily: 'Apercu', fontWeight: 500, lineHeight: '16px', marginBottom: '8px'}}>
					{item.category} - {item.name}<br />
					{item.price} €
				</Typography>
				{item.attributes.map((attribute) => (
					<Typography sx={{fontFamily: 'Apercu', fontSize: '12px', lineHeight: '16px'}} key={attribute.id}>
						{attribute.id.toString().replace("pa_", "").toUpperCase()}: {attribute.name}
					</Typography>
				))}
				<Typography sx={{fontFamily: 'Apercu', fontSize: '12px', lineHeight: '16px'}}>QUANTITÀ: {item.qty}</Typography>
				<IconButton
					size="small"
					onClick={() => dispatch(deleteCartItem(item.id))}
					sx={{position: 'absolute', bottom: '5px', right: '5px'}}
				>
					<DeleteOutlineSharp fontSize="small" />
				</IconButton>
			</div>

		</Box>
	)
}

export default CartItem