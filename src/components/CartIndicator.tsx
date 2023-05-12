import {Badge, IconButton} from "@mui/material";
import CartIcon from "../icons/CartIcon";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

type CartIndicatorProps = {
	amount: number,
	buttonProps?: IconButtonProps
	iconProps?: SvgIconProps
}
const CartIndicator = ({amount, buttonProps, iconProps}: CartIndicatorProps) => {
	const { items } = useSelector((state: RootState) => state.cart);
	return (
		<IconButton {...buttonProps}>
			<Badge
				badgeContent={items.length}
				overlap="circular"
				color="primary"
				sx={{
					'& .MuiBadge-badge': {
						fontSize: '.7rem',
						minWidth: '15px',
						height: '15px',
						backgroundColor: 'rgba(0,0,0,0.6)',
					}
				}}
			>
				<CartIcon {...iconProps} />
			</Badge>
		</IconButton>
	)
}

export default CartIndicator