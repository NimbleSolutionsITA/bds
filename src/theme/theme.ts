import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import localFont from 'next/font/local'

export const primaryFont = localFont({
    src: [
        {
            path: '../../public/fonts/Apercu-Light.woff2',
            weight: '300',
            style: 'normal'
        },
        {
            path: '../../public/fonts/Apercu-Medium.woff2',
            weight: '500',
            style: 'normal'
        }
    ]
});

export const secondaryFont = localFont({
    src: [
        {
            path: '../../public/fonts/OggRoman-Regular.woff2',
            weight: '300',
            style: 'normal'
        }
    ]
});

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#ffffff',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: primaryFont.style.fontFamily,
    },
    shape: {
        borderRadius: 0
    },
    components: {
        MuiContainer: {
            defaultProps: {
                maxWidth: 'xl'
            }
        },
        MuiButton: {
            defaultProps: {
                variant: 'contained',
                disableElevation: true,
            },
            styleOverrides: {
                contained: {
                    padding: '20px 40px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '15px',
                    lineHeight: 1
                },
                containedPrimary: {
                    color: '#ffffff',
                }
            }
        },
    }
});

export default theme;