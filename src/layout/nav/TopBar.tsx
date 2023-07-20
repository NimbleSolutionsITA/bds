import Container from "@mui/material/Container";
import {IconButton} from "@mui/material";
import {Facebook, Instagram} from "@mui/icons-material";
import CartIndicator from "../../components/CartIndicator";
import LanguageButton from "../../components/LanguageButton";
import ShippingBanner from "./ShippingBanner";
import {FACEBOOK_LINK, INSTAGRAM_LINK} from "../../utils/endpoints";

export default function TopBar() {
    return (
        <Container sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: (theme) => theme.zIndex.appBar,
            position: 'relative'
        }}>
            <div>
                <LanguageButton />
                <IconButton size="small" component="a" target="_blanh" href={FACEBOOK_LINK}>
                    <Facebook fontSize="small" />
                </IconButton>
                <IconButton size="small" component="a" target="_blanh" href={INSTAGRAM_LINK}>
                    <Instagram fontSize="small" />
                </IconButton>
            </div>
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 500,
                    color: 'rgba(0,0,0,0.54)'
                }}
            >
                <ShippingBanner />
            </div>
            <CartIndicator />
        </Container>
    )
}