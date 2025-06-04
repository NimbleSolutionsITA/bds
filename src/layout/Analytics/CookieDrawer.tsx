import {Box, Drawer, Typography, Button, Container} from "@mui/material";
import { OptionalConsent} from "./GoogleAnalytics";
import {useDispatch} from "react-redux";
import {openCookiesModal} from "../../redux/layoutSlice";

type CookieDrawerProps = {
    open: boolean;
    onConsentChange: (consent: OptionalConsent) => void;
}

const CookieDrawer = ({open, onConsentChange}: CookieDrawerProps) => {
    const dispatch = useDispatch();
    const acceptCookies = (all: boolean) => {
        onConsentChange({
            adUserDataConsentGranted: all,
            adPersonalizationConsentGranted: all,
            analyticsConsentGranted: all,
            personalizationConsentGranted:all
        })
    }
    const acceptAll = () => acceptCookies(true)
    const acceptOnlyTechnical = () => acceptCookies(false)
    const cookieSettings = () => {
        dispatch(openCookiesModal());
        acceptCookies(false);
    }
    return (
        <Drawer
            open={open}
            anchor="right"
            sx={{zIndex: 1300}}
            PaperProps={{
                sx: {
                    padding: '20px 0',
                    height: 'auto',
                    top: {
                        xs: 0,
                        md: '10%'
                    },
                    right: {
                        xs: 0,
                        md: '24px'
                    },
                    width: '400px',
                    maxWidth: '100%',
                    backgroundColor: '#f1f1f1',
                }
            }}
        >
            <Container sx={{display: 'flex', flexDirection: 'column', position: 'relative', gap: 2}}>
                <Typography sx={{fontFamily: 'Ogg Roman', fontSize: '22px'}}>
                    Cookie Policy
                </Typography>

                <Typography color="primary" textAlign={{xs: 'center', md: 'left'}}>
                    By selecting “Accept All Cookies,” you consent to storing cookies on your device to improve site navigation, track usage, and support our marketing initiatives.
                </Typography>

                <Button
                    variant="outlined"
                    onClick={acceptOnlyTechnical}
                >
                    Accept only Tecnical Cookies
                </Button>
                <Button
                    variant="outlined"
                    onClick={cookieSettings}
                >
                    Cookie Settings
                </Button>
                <Button
                    variant="contained"
                    onClick={acceptAll}
                >
                    Accept all Cookies
                </Button>
            </Container>
        </Drawer>
    )
}

export default CookieDrawer;