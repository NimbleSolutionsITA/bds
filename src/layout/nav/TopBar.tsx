import Container from "@mui/material/Container";
import {IconButton} from "@mui/material";
import {Facebook, Instagram} from "@mui/icons-material";
import CartIndicator from "../../components/CartIndicator";
import LanguageButton from "../../components/LanguageButton";
import ShippingBanner from "./ShippingBanner";
import {FACEBOOK_LINK, INSTAGRAM_LINK} from "../../utils/endpoints";

export default function TopBar() {
    return (
        <div style={{backgroundColor: '#000'}}>
            <Container sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: (theme) => theme.zIndex.appBar,
                position: 'relative',
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
                <CartIndicator buttonProps={{sx: {color: '#FFF'}}} />
            </Container>
        </div>
    )
}