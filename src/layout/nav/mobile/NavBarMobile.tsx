import React, {useState} from "react";
import {AppBar, Button, IconButton, SwipeableDrawer, Toolbar, Container} from "@mui/material";
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
        console.log(nav)
        setOpen(false)
    }

    return (
        <>
            <AppBar
                color="secondary"
                elevation={0}
                position="sticky"
                sx={{
                    height: '80px',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
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
                    <CartIndicator iconProps={{fontSize: 'large'}} />
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                anchor="top"
                elevation={0}
                hideBackdrop
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    position: 'relative',
                    '& .MuiPaper-root': {
                        top: '80px',
                        height: 'calc(100% - 80px)',
                    }
                }}
            >
                <Container sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    paddingTop: '20px',
                    paddingBottom: '10px'
                }}>
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
                    <div style={{flexGrow: 1}} />
                    <div style={{width: '100%', textAlign: 'right'}}>
                        <LanguageButton onClick={() => setOpen(false)} />
                        <IconButton size="small">
                            <Facebook fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                            <Instagram fontSize="small" />
                        </IconButton>
                    </div>
                </Container>
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