import Container from "@mui/material/Container";
import {IconButton, Box} from "@mui/material";
import {Facebook, Instagram} from "@mui/icons-material";
import CartIndicator from "../../components/CartIndicator";
import LanguageButton from "../../components/LanguageButton";
import ShippingBanner from "./ShippingBanner";
import {FACEBOOK_LINK, INSTAGRAM_LINK} from "../../utils/endpoints";
import SearchIcon from '@mui/icons-material/Search';
import {closeSearchDrawer, openSearchDrawer} from "../../redux/layout";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Trans} from "react-i18next";
import React from "react";

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
                    <IconButton onClick={() => dispatch(searchDrawerOpen ? closeSearchDrawer() : openSearchDrawer())}>
                        <SearchIcon sx={{color: '#FFF'}} />
                    </IconButton>
                    <CartIndicator buttonProps={{sx: {color: '#FFF'}}} />
                </div>
            </Container>
        </Box>
    )
}