import React, {useState} from "react";
import {Box, AppBar, Button, IconButton, SwipeableDrawer, Toolbar} from "@mui/material";
import {MenuToggle} from "./MenuToggle";
import Image from "next/image";
import logo from "../../../images/bottega-di-sguardi-logo.png";
import CartIcon from "../../../icons/CartIcon";
import {Menus} from "../../../types/settings";

type NavBarMobileProps = {
    mobileMenu: Menus['mobileMenu']
}

const drawerBleeding = 56;
export default function NavBarMobile({mobileMenu}: NavBarMobileProps) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <AppBar
                color="secondary"
                elevation={0}
                position="sticky"
                sx={{
                    zIndex: 1201,
                    height: '80px'
            }}
            >
                <Toolbar sx={{position: 'relative', width: '100%', height: '100%', justifyContent: 'space-between'}}>
                    <LogoButton />
                    <IconButton onClick={() => setOpen(open => !open)}>
                        <MenuToggle isOpen={open} />
                    </IconButton>
                    <IconButton>
                        <CartIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                anchor="top"
                elevation={0}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    '& .MuiPaper-root': {
                        paddingTop: '80px',
                        height: '100%'
                    }
                }}
            >
                <Box display="flex" flexDirection="column" padding="20px">
                    {mobileMenu.map(nav => (
                        <Button
                            key={nav.id}
                            variant="text"
                            sx={{color: 'black'}}
                        >
                            {nav.title}
                        </Button>
                    ))}
                </Box>
            </SwipeableDrawer>
        </>
    )
}

const LogoButton = () => (
    <IconButton sx={{
        position: 'absolute',
        left: 'calc(50% - 30px)',
        '&:hover': {
            backgroundColor: 'inherit'
        }
    }}>
        <Image
            src={logo}
            alt="Logo Bottega di Sguardi"
            style={{ width: '60px', height: 'auto' }}
        />
    </IconButton>
)