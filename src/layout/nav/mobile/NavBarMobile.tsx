import React, {useRef, useState} from "react";
import {
    AppBar,
    Button,
    IconButton,
    SwipeableDrawer,
    Toolbar,
    Container,
    Typography,
} from "@mui/material";
import {MenuToggle} from "./MenuToggle";
import Image from "next/image";
import logo from "../../../images/bottega-di-sguardi-logo.png";
import {BaseLayoutProps, BreadCrumb, MenuItem, Menus} from "../../../types/settings";
import CartIndicator from "../../../components/CartIndicator";
import LanguageButton from "../../../components/LanguageButton";
import {Facebook, Instagram, PhoneEnabledSharp} from "@mui/icons-material";
import {useRouter} from "next/router";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";
import {FRAGRANCES_CATEGORY, OUR_PRODUCTION_CATEGORIES} from "../../../utils/utils";
import {useTranslation} from "next-i18next";
import BottomBar from "../BottomBar";
import {closeSearchDrawer, openSearchDrawer} from "../../../redux/layoutSlice";
import SearchIcon from "@mui/icons-material/Search";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import NavButton from "../../../components/NavButton";
import AccordionNavButton from "../../../components/AccordionNavButton";
import {UserMenu} from "../UserMenu";
import {
    DESIGNERS_CATEGORY,
    FACEBOOK_LINK, INSTAGRAM_LINK,
    OUR_PRODUCTION_SUB_PATH
} from "../../../utils/endpoints";


type NavBarMobileProps = {
    mobileMenu: Menus['mobile']
    breadcrumbs?: BreadCrumb[]
    categories: BaseLayoutProps['categories']
}

const drawerBleeding = 56;
export default function NavBarMobile({
                                         mobileMenu: [opticalMan, sunglassesMan, opticalWoman, sunglassesWoman, designers, ourProduction, fragrances, ...mobileMenu], breadcrumbs, categories
                                     }: NavBarMobileProps) {
    const ref = useRef<HTMLElement>(null);
    const { searchDrawerOpen } = useSelector((state: RootState) => state.layout);
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { t } = useTranslation('common')
    function handleClick() {
        setOpen(false)
    }
    const appbarHeight = ref.current ? ref.current.clientHeight : 0 + 'px'

    const accordionCategories = [
        {id: designers.id, name: designers.title, slug: DESIGNERS_CATEGORY, child_items: categories.find(c => c.slug === DESIGNERS_CATEGORY)?.child_items},
        {id: ourProduction.id, name: ourProduction.title, slug: OUR_PRODUCTION_SUB_PATH, child_items: categories.find(c => c.slug === DESIGNERS_CATEGORY)?.child_items?.filter(c => [...OUR_PRODUCTION_CATEGORIES.it, ...OUR_PRODUCTION_CATEGORIES.en].includes(c.id))},
        ...(categories.find(c => Object.values(FRAGRANCES_CATEGORY).includes(c.id))?.child_items?.sort((a,b) => a.menu_order - b.menu_order) ?? [])
    ]
    return (
        <>
            <AppBar
                component="header"
                ref={ref}
                color="secondary"
                elevation={0}
                position="sticky"
                sx={{
                    height: breadcrumbs ? '100px' : '70px',
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
                    <div>
                        <UserMenu />
                        <IconButton
                            onClick={() => dispatch(searchDrawerOpen ? closeSearchDrawer() : openSearchDrawer())}
                        >
                            <SearchIcon fontSize="medium" />
                        </IconButton>
                        <CartIndicator iconProps={{fontSize: 'medium'}} />
                    </div>
                </Toolbar>
                {breadcrumbs && <BottomBar breadcrumbs={breadcrumbs}/>}
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
                        top: appbarHeight,
                        height: `calc(100% - ${appbarHeight}px)`,
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
                    <div style={{display: 'flex', gap: '20px'}}>
                        <TopNavButtons title={t('man').toUpperCase()} nav1={opticalMan} nav2={sunglassesMan} handleClick={handleClick} />
                        <TopNavButtons title={t('woman').toUpperCase()} nav1={opticalWoman} nav2={sunglassesWoman} handleClick={handleClick} />
                    </div>
                    {accordionCategories.map(category => category.child_items && (
                        <AccordionNavButton
                            key={category.id}
                            title={category.name}
                            items={category.child_items}
                            handleClick={handleClick}
                            path={category.slug}
                        />
                    ))}

                    {mobileMenu.map(nav => (
                        <NavButton key={nav.id} nav={nav} handleClick={handleClick} />
                    ))}
                    <div style={{marginTop: '20px'}}>
                        <PhoneButton
                            title={t('shop', {address: "VIA MARCONI"})}
                            url="https://api.whatsapp.com/send?phone=393496393775&text=Ciao!"
                        />
                        <PhoneButton
                            title={t('shop', {address: "VIA DEL PARIONE"})}
                            url="https://api.whatsapp.com/send?phone=393341577915&text=Ciao!"
                        />
                    </div>
                    <div style={{flexGrow: 1}} />
                    <div style={{width: '100%', textAlign: 'left'}}>
                        <LanguageButton onClick={() => setOpen(false)} />
                        <IconButton size="small" component="a" target="_blank" href={FACEBOOK_LINK}>
                            <Facebook fontSize="small" />
                        </IconButton>
                        <IconButton size="small" component="a" target="_blank" href={INSTAGRAM_LINK}>
                            <Instagram fontSize="small" />
                        </IconButton>
                    </div>
                </Container>
            </SwipeableDrawer>
        </>
    )
}

const PhoneButton = ({title, url}: {title: string, url: string}) => (
    <Button
        variant="text"
        component="a"
        href={url}
        target="_blank"
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
        left: 'calc(50% - 38px)',
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

const TopNavButtons = ({nav1, nav2, title, handleClick}: {title: string, nav1: MenuItem, nav2: MenuItem, handleClick: (nav: MenuItem) => void}) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
        <Typography variant="h3" sx={{fontWeight: 700, padding: '6px 8px'}}>{title}</Typography>
        <NavButton nav={nav1} handleClick={handleClick} />
        <NavButton nav={nav2} handleClick={handleClick} />
    </div>
)