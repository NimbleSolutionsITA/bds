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
        body1: {
            fontSize: '14px',
            fontWeight: 300,
        },
        h1: {
            fontFamily: secondaryFont.style.fontFamily,
            fontWeight: 500,
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontFamily: primaryFont.style.fontFamily,
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            lineHeight: 1.2,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.2,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.2,
        }
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
        MuiInputBase: {
            styleOverrides: {
                colorSecondary: {
                    color: '#ffffff',
                    '&:before': {
                        borderColor: 'rgba(255,255,255,0.5) !important'
                    },
                    '& input::placeholder': {
                        color: 'rgba(255,255,255,0.5)'
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'rgba(255,255,255,0.5)',
                }
            }
        }
    }
});

export default theme;