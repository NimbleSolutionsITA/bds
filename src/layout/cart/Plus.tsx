import {updateCartItem} from "../../redux/cartSlice";
import {useDispatch} from "react-redux";
import {IconButton} from "@mui/material";
import {AddCircleOutlineSharp} from "@mui/icons-material";
import {Item} from "../../types/cart-type";
import {AppDispatch} from "../../redux/store";

type CartButtonProps = {
	item: Item
	disabled?: boolean
}

const Plus = ({item, disabled}:CartButtonProps) => {
	const dispatch = useDispatch<AppDispatch>()
	return (
		<IconButton
			disabled={item.quantity.value >= item.quantity.max_purchase || disabled}
			size="small"
			onClick={() => dispatch(updateCartItem({key: item.item_key, quantity: item.quantity.value + 1}))}
		>
			<AddCircleOutlineSharp sx={{fontSize: '16px'}} />
		</IconButton>
	)
}

export default Plus