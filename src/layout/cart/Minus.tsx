import {useDispatch} from "react-redux";
import {IconButton} from "@mui/material";
import {CartItem as CartItemType, updateCartItem} from "../../redux/cartSlice";
import {RemoveCircleOutlineSharp} from "@mui/icons-material";

type CartButtonProps = {
	item: CartItemType
	disabled?: boolean
}

const Minus = ({item, disabled}: CartButtonProps) => {
	const dispatch = useDispatch()
	return (
		<IconButton
			size="small"
			disabled={item.qty <= 1 || disabled}
			onClick={() => dispatch(updateCartItem({
				product_id: item.product_id,
				variation_id: item.variation_id,
				qty: item.qty - 1
			}))}
		>
			<RemoveCircleOutlineSharp sx={{fontSize: '16px'}} />
		</IconButton>
	)
}

export default Minus