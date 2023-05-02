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
            main: '#ffffff',
        },
        secondary: {
            main: '#19857b',
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
        MuiCssBaseline: {
            styleOverrides: (themeParam) => `
                h2 {
                    font-size: 2rem;
                }
                body {
                    color: black;
                    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
                    font-size: 14px;
                }
            `,
        }
    }
});

export default theme;