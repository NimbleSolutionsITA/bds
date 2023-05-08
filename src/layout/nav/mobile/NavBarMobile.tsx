import React, {useState} from "react";
import {Box, AppBar, Button, IconButton, SwipeableDrawer, Toolbar} from "@mui/material";
import {MenuToggle} from "./MenuToggle";
import Image from "next/image";
import logo from "../../../images/bottega-di-sguardi-logo.png";
import {MenuItem, Menus} from "../../../types/settings";
import CartIndicator from "../../../components/CartIndicator";
import LanguageButton from "../../../components/LanguageButton";
import {Facebook, Instagram} from "@mui/icons-material";
import {useRouter} from "next/router";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";

type NavBarMobileProps = {
    mobileMenu: Menus['mobileMenu']
}

const drawerBleeding = 56;
export default function NavBarMobile({mobileMenu}: NavBarMobileProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    function handleClick(nav: MenuItem) {
        setOpen(false)
    }

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
                    <LogoButton onClick={() => {
                        setOpen(false)
                        router.push('/')

                    }} />
                    <IconButton onClick={() => setOpen(open => !open)}>
                        <MenuToggle isOpen={open} />
                    </IconButton>
                    <CartIndicator iconProps={{fontSize: 'large'}} amount={10} />
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
                    position: 'relative',
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
                            onClick={() => handleClick(nav)}

                        >
                            {nav.title}
                        </Button>
                    ))}
                </Box>
                <Box sx={{position: 'absolute', bottom: '20px', width: '100%', textAlign: 'right', paddingRight: '20px'}}>
                    <LanguageButton onClick={() => setOpen(false)} />
                    <IconButton size="small">
                        <Facebook fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                        <Instagram fontSize="small" />
                    </IconButton>
                </Box>
            </SwipeableDrawer>
        </>
    )
}

const LogoButton = (props: IconButtonProps) => (
    <IconButton sx={{
        position: 'absolute',
        left: 'calc(50% - 30px)',
        '&:hover': {
            backgroundColor: 'inherit'
        }
    }} {...props}>
        <Image
            src={logo}
            alt="Logo Bottega di Sguardi"
            style={{ width: '60px', height: 'auto' }}
        />
    </IconButton>
)