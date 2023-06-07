import {CartItem as CartItemType, updateCartItem} from "../../redux/cartSlice";
import {useDispatch} from "react-redux";
import {IconButton} from "@mui/material";
import {AddCircleOutlineSharp} from "@mui/icons-material";

type CartButtonProps = {
	item: CartItemType
	disabled?: boolean
}

const Plus = ({item, disabled}:CartButtonProps) => {
	const dispatch = useDispatch()
	return (
		<IconButton
			disabled={item.stock_quantity <= item.qty || disabled}
			size="small"
			onClick={() => dispatch(updateCartItem({
				product_id: item.product_id,
				variation_id: item.variation_id,
				qty: item.qty + 1
			}))}
		>
			<AddCircleOutlineSharp sx={{fontSize: '16px'}} />
		</IconButton>
	)
}

export default Plus