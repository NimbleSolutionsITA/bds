import {IconButton} from "@mui/material";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";
import {Add} from "@mui/icons-material";

type AddToCartProps = {
	buttonProps?: IconButtonProps
	iconProps?: SvgIconProps
}
const AddToCart = ({buttonProps, iconProps}: AddToCartProps) => {
	return (
		<IconButton {...buttonProps}>
			<Add {...iconProps} />
		</IconButton>
	)
}

export default AddToCart