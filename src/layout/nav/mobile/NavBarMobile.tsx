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
import {OUR_PRODUCTION_CATEGORIES} from "../../../utils/utils";
import {useTranslation} from "next-i18next";
import BottomBar from "../BottomBar";
import {closeSearchDrawer, openSearchDrawer} from "../../../redux/layoutSlice";
import SearchIcon from "@mui/icons-material/Search";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {
    DESIGNERS_SUB_PATH, LIQUIDES_IMAGINAIRES_SUB_PATH, MAISON_GABRIELLA_CHIEFFO_SUB_PATH,
    OUR_PRODUCTION_SUB_PATH,
    PROFUMUM_ROMA_SUB_PATH
} from "../../../utils/endpoints";
import NavButton from "../../../components/NavButton";
import AccordionNavButton from "../../../components/AccordionNavButton";
import {UserMenu} from "../UserMenu";


type NavBarMobileProps = {
    mobileMenu: Menus['mobileMenu']
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
    const ourProductionCategories = categories.designers.filter(c => [...OUR_PRODUCTION_CATEGORIES.it, ...OUR_PRODUCTION_CATEGORIES.en].includes(c.id))

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
                    <AccordionNavButton
                        title={designers.title}
                        items={categories.designers}
                        handleClick={handleClick}
                        path={DESIGNERS_SUB_PATH}
                    />
                    <AccordionNavButton
                        title={ourProduction.title}
                        items={ourProductionCategories}
                        handleClick={handleClick}
                        path={OUR_PRODUCTION_SUB_PATH}
                    />
                    <AccordionNavButton
                        title={categories.fragrances.profumumMain[0].name}
                        items={categories.fragrances.profumum}
                        handleClick={handleClick}
                        path={PROFUMUM_ROMA_SUB_PATH}
                    />
                    <AccordionNavButton
                        title={categories.fragrances.liquidesMain[0].name}
                        items={categories.fragrances.liquides}
                        handleClick={handleClick}
                        path={LIQUIDES_IMAGINAIRES_SUB_PATH}
                    />
                    <AccordionNavButton
                        title={categories.fragrances.maisonMain[0].name}
                        items={categories.fragrances.maison}
                        handleClick={handleClick}
                        path={MAISON_GABRIELLA_CHIEFFO_SUB_PATH}
                    />

                    {mobileMenu.map(nav => (
                        <NavButton key={nav.id} nav={nav} handleClick={handleClick} />
                    ))}
                    <div style={{marginTop: '20px'}}>
                        <PhoneButton
                            title={t('shop', {address: "VIA MARCONI"})}
                        />
                        <PhoneButton
                            title={t('shop', {address: "VIA DEL PARIONE"})}
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