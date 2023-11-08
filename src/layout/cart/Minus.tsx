import {useDispatch} from "react-redux";
import {IconButton} from "@mui/material";
import {updateCartItem} from "../../redux/cartSlice";
import {RemoveCircleOutlineSharp} from "@mui/icons-material";
import {Item} from "../../types/cart-type";
import {AppDispatch} from "../../redux/store";

type CartButtonProps = {
	item: Item
	disabled?: boolean
}

const Minus = ({item, disabled}: CartButtonProps) => {
	const dispatch = useDispatch<AppDispatch>()
	return (
		<IconButton
			size="small"
			disabled={item.quantity.value <= 1 || disabled}
			onClick={() => dispatch(updateCartItem({key: item.item_key, quantity: item.quantity.value - 1}))}
		>
			<RemoveCircleOutlineSharp sx={{fontSize: '16px'}} />
		</IconButton>
	)
}

export default Minus