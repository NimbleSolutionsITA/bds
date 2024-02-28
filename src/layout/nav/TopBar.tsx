import Container from "@mui/material/Container";
import {IconButton, Box, Menu, MenuItem} from "@mui/material";
import {Facebook, Instagram} from "@mui/icons-material";
import CartIndicator from "../../components/CartIndicator";
import LanguageButton from "../../components/LanguageButton";
import ShippingBanner from "./ShippingBanner";
import {FACEBOOK_LINK, INSTAGRAM_LINK} from "../../utils/endpoints";
import SearchIcon from '@mui/icons-material/Search';
import {closeSearchDrawer, openLogInDrawer, openSearchDrawer, openSignUpDrawer} from "../../redux/layoutSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import UserIcon from "../../icons/UserIcon";
import useAuth from "../../utils/useAuth";
import {useState} from "react";
import {useRouter} from "next/router";

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
                        color: '#FFF'
                    }}
                >
                    <ShippingBanner />
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
        { label: 'Profile', onClick: () => router.push('/my-area', { query: { tab : 0 } }) },
        { label: 'Billing', onClick: () => router.push('/my-area', { query: { tab : 1 } }) },
        { label: 'Shipping', onClick: () => router.push('/my-area', { query: { tab : 2 } }) },
        { label: 'Orders', onClick: () => router.push('/my-area', { query: { tab : 3 } }) },
        { label: 'Logout', onClick: logOut },
    ]

    const guestMenu = [
        { label: 'Login', onClick: () => dispatch(openLogInDrawer()) },
        { label: 'Register', onClick: () => dispatch(openSignUpDrawer()) },
    ]
    const menuItemns = loggedIn ? loggedMenu : guestMenu;
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
                {menuItemns.map(({onClick, label}) => (
                    <MenuItem sx={{textTransform: 'uppercase'}} key={label} onClick={() => {
                        handleClose();
                        onClick();
                    }}>{label}</MenuItem>
                ))}
            </Menu>
        </>
    );
}