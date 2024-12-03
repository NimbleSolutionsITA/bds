import Container from "@mui/material/Container";
import {IconButton, Box} from "@mui/material";
import {Facebook, Instagram} from "@mui/icons-material";
import CartIndicator from "../../components/CartIndicator";
import LanguageButton from "../../components/LanguageButton";
import {FACEBOOK_LINK, INSTAGRAM_LINK} from "../../utils/endpoints";
import SearchIcon from '@mui/icons-material/Search';
import {closeSearchDrawer, openSearchDrawer} from "../../redux/layoutSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Trans} from "react-i18next";
import React from "react";
import {UserMenu} from "./UserMenu";
import Marquee from "react-fast-marquee";

export default function TopBar() {
    const { searchDrawerOpen } = useSelector((state: RootState) => state.layout);
    const dispatch = useDispatch()
    const topBannerPromos = ['lineb', 'line1b', 'line2b']

    return (
        <Box sx={{backgroundColor: '#000', zIndex: 1100}}>
            <Container sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: (theme) => theme.zIndex.appBar,
                minHeight: '40px'
            }}>
                <div style={{display: 'flex'}}>
                    <LanguageButton color="#FFF" />
                    <IconButton size="small" component="a" target="_blank" href={FACEBOOK_LINK} sx={{color: '#FFF'}}>
                        <Facebook fontSize="small" />
                    </IconButton>
                    <IconButton size="small" component="a" target="_blank" href={INSTAGRAM_LINK} sx={{color: '#FFF'}}>
                        <Instagram fontSize="small" />
                    </IconButton>
                </div>
                <div
                    style={{
                        color: '#FFF',
                        textAlign: 'center',
                        flexGrow: 1,
                        width: 0
                    }}
                >
                    <Marquee>
                        {topBannerPromos.map((key, index) => (
                            <div key={key} style={{margin: '0 100px'}}>
                                <Trans i18nKey={`shipping.${key}`} components={[<b key={0} />]} />
                            </div>
                        ))}
                    </Marquee>
                    {/*<Box sx={{fontSize: '16px', marginTop: '5px'}}>
                        <Trans i18nKey="newsletter.promo-banner" components={[<b key={0} />]} />
                    </Box>*/}
                </div>
                <div style={{display: 'flex'}}>
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