import useAuth from "../../utils/useAuth";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {
	BusinessSharp,
	LocalShippingSharp, LoginSharp, LogoutSharp, PersonAddOutlined,
	PortraitSharp,
	ReceiptLongSharp,
	ShoppingCartOutlined
} from "@mui/icons-material";
import {openLogInDrawer, openSignUpDrawer} from "../../redux/layoutSlice";
import {useTranslation} from "next-i18next";
import {Button, IconButton, Menu, MenuItem, Hidden} from "@mui/material";
import UserIcon from "../../icons/UserIcon";
import Link from "../../components/Link";

export function UserMenu() {
	const { logOut, loggedIn, user } = useAuth();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const dispatch = useDispatch()
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const loggedMenu = [
		{ label: 'profile', href: "/my-area?tab=0", Icon: PortraitSharp },
		{ label: 'billing', href: "/my-area?tab=1", Icon: BusinessSharp },
		{ label: 'shipping', href: "/my-area?tab=2", Icon: LocalShippingSharp },
		{ label: 'invoice', href: "/my-area?tab=3", Icon: ReceiptLongSharp },
		{ label: 'orders', href: "/my-area?tab=4", Icon: ShoppingCartOutlined },
		{ label: 'logout', onClick: logOut, Icon: LogoutSharp },
	]

	const guestMenu = [
		{ label: 'login', onClick: () => dispatch(openLogInDrawer()), href: undefined, Icon: LoginSharp },
		{ label: 'register', onClick: () => dispatch(openSignUpDrawer()), href: undefined, Icon: PersonAddOutlined },
	]
	const menuItems = loggedIn ? loggedMenu : guestMenu;
	const { t } = useTranslation()
	return (
		<>
			<IconButton
				id="user-button"
				aria-controls={open ? 'user-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				sx={{color: {xs: "rgba(0, 0, 0, 0.54)", md: '#fff'}, fontSize: '12px'}}
			>
				<UserIcon sx={{padding: '3px', marginRight: loggedMenu && user?.firstName ? '5px' : 0}} />
				<Hidden mdDown>{loggedMenu && user?.firstName && user.firstName}</Hidden>
			</IconButton>
			<Menu
				id="user-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'user-button',
				}}
			>
				{menuItems.map(({onClick = undefined, label, href = undefined, Icon}) => (
					<MenuItem sx={{textTransform: 'uppercase'}} key={label}>
						<Button
							variant="text"
							size="small"
							startIcon={<Icon />}
							sx={{
								fontWeight: 300,
								padding: 0,
								fontSize: '14px',
								lineHeight: '1.5',
								minWidth: 0
							}}
							{...(onClick ? {
								onClick: () => {
									onClick()
									handleClose()
								}
							} : {
								component: Link,
								href
							})}
						>
							{t(`my-area.${label}`)}
						</Button>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}