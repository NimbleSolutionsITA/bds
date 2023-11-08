import {Badge, CircularProgress, IconButton} from "@mui/material";
import CartIcon from "../icons/CartIcon";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {toggleCartDrawer} from "../redux/cartSlice";

type CartIndicatorProps = {
	buttonProps?: IconButtonProps
	iconProps?: SvgIconProps
}
const CartIndicator = ({buttonProps, iconProps}: CartIndicatorProps) => {
	const { cart, loading } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch()
	return (
		<IconButton {...buttonProps} onClick={() => dispatch(toggleCartDrawer())}>
			<Badge
				badgeContent={cart?.items?.length ?? 0}
				overlap="circular"
				color="primary"
				sx={{
					'& .MuiBadge-badge': {
						fontSize: '.7rem',
						minWidth: '15px',
						height: '15px',
						backgroundColor: 'rgba(102,130,113,0.6)',
					}
				}}
			>
				{loading ?
					<CircularProgress size={20} color="inherit" /> :
					<CartIcon {...iconProps} />
				}
			</Badge>
		</IconButton>
	)
}

export default CartIndicator