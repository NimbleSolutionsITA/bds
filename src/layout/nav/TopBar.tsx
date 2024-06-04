import Container from "@mui/material/Container";
import {IconButton, Box, Menu, MenuItem, Button} from "@mui/material";
import {
    BusinessSharp,
    Facebook,
    Instagram,
    LocalShippingSharp, LoginSharp, LogoutSharp, PersonAddOutlined,
    ReceiptLongSharp,
    ShoppingCartOutlined
} from "@mui/icons-material";
import CartIndicator from "../../components/CartIndicator";
import LanguageButton from "../../components/LanguageButton";
import {FACEBOOK_LINK, INSTAGRAM_LINK} from "../../utils/endpoints";
import SearchIcon from '@mui/icons-material/Search';
import {closeSearchDrawer, openLogInDrawer, openSearchDrawer, openSignUpDrawer} from "../../redux/layoutSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Trans} from "react-i18next";
import React from "react";
import UserIcon from "../../icons/UserIcon";
import useAuth from "../../utils/useAuth";
import {useState} from "react";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import Link from "../../components/Link";
import { PortraitSharp } from '@mui/icons-material';

export default function TopBar() {
    const { searchDrawerOpen } = useSelector((state: RootState) => state.layout);
    const dispatch = useDispatch()
    return (
        <Box sx={{backgroundColor: '#000', zIndex: 1100}}>
            <Container sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                zIndex: (theme) => theme.zIndex.appBar,
                minHeight: '60px'
            }}>
                <div>
                    <LanguageButton color="#FFF" />
                    <IconButton size="small" component="a" target="_blanh" href={FACEBOOK_LINK} sx={{color: '#FFF'}}>
                        <Facebook fontSize="small" />
                    </IconButton>
                    <IconButton size="small" component="a" target="_blanh" href={INSTAGRAM_LINK} sx={{color: '#FFF'}}>
                        <Instagram fontSize="small" />
                    </IconButton>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#FFF',
                        textAlign: 'center'
                    }}
                >
                    <Trans i18nKey="shipping.lineb" components={[<b key={0} />]} />
                    <Box sx={{fontSize: '16px', marginTop: '5px'}}>
                        <Trans i18nKey="newsletter.promo-banner" components={[<b key={0} />]} />
                    </Box>
                </div>
                <div>
                    <UserMenu />
                    <IconButton onClick={() => dispatch(searchDrawerOpen ? closeSearchDrawer() : openSearchDrawer())}>
                        <SearchIcon sx={{color: '#FFF'}} />
                    </IconButton>
                    <CartIndicator buttonProps={{sx: {color: '#FFF'}}} />
                </div>
            </Container>
        </Box>
    )
}

function UserMenu() {
    const { logOut, loggedIn, user } = useAuth();
    const router = useRouter();
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
                sx={{color: '#fff', fontSize: '12px'}}
            >
                <UserIcon sx={{padding: '3px', marginRight: loggedMenu && user?.firstName ? '5px' : 0}} />
                {loggedMenu && user?.firstName && user.firstName}
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