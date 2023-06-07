import React, {useState} from "react";
import {AppBar, Button, IconButton, SwipeableDrawer, Toolbar, Container, Typography} from "@mui/material";
import {MenuToggle} from "./MenuToggle";
import Image from "next/image";
import logo from "../../../images/bottega-di-sguardi-logo.png";
import {MenuItem, Menus} from "../../../types/settings";
import CartIndicator from "../../../components/CartIndicator";
import LanguageButton from "../../../components/LanguageButton";
import {Facebook, Instagram, PhoneEnabledSharp} from "@mui/icons-material";
import {useRouter} from "next/router";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";
import Link from "../../../components/Link";
import {getRelativePath} from "../../../utils/utils";

type NavBarMobileProps = {
    mobileMenu: Menus['mobileMenu']
}

const drawerBleeding = 56;
export default function NavBarMobile({
    mobileMenu: [opticalMan, sunglassesMan, opticalWoman, sunglassesWoman, ...mobileMenu]
}: NavBarMobileProps) {
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
                    paddingBottom: '10px',
                    alignItems: 'start'
                }}>
                    <div style={{display: 'flex', marginBottom: '20px', gap: '20px'}}>
                        <TopNavButtons title="UOMO" nav1={opticalMan} nav2={sunglassesMan} handleClick={handleClick} />
                        <TopNavButtons title="DONNA" nav1={opticalWoman} nav2={sunglassesWoman} handleClick={handleClick} />
                    </div>
                    {mobileMenu.map(nav => (
                        <NavButton key={nav.id} nav={nav} handleClick={handleClick} />
                    ))}
                    <div style={{marginTop: '20px'}}>
                        <PhoneButton
                            title="NEGOZIO VIA MARCONI"
                        />
                        <PhoneButton
                            title="NEGOZIO VIA DEL PARIONE"
                        />
                    </div>
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

const PhoneButton = ({title}: {title: string}) => (
    <Button
        variant="text"
        startIcon={
            <div style={{backgroundColor: '#000', padding: '2px', height: '30px', width: '30px'}}>
                <PhoneEnabledSharp color="secondary" />
            </div>
        }
        sx={{marginTop: '10px'}}
    >
        {title}
    </Button>
)

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

const NavButton = ({nav , handleClick}: {nav: MenuItem, handleClick: (nav: MenuItem) => void}) => (
    <Button
        key={nav.id}
        variant="text"
        sx={{color: 'black', minWidth: 0}}
        onClick={() => handleClick(nav)}
        component={Link}
        href={getRelativePath(nav.url)}
    >
        {nav.title}
    </Button>
)

const TopNavButtons = ({nav1, nav2, title, handleClick}: {title: string, nav1: MenuItem, nav2: MenuItem, handleClick: (nav: MenuItem) => void}) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
        <Typography variant="h3" sx={{fontWeight: 700, padding: '6px 8px'}}>{title}</Typography>
        <NavButton nav={nav1} handleClick={handleClick} />
        <NavButton nav={nav2} handleClick={handleClick} />
    </div>
)