import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const CUSTOM_COLOR = 'rgba(102,130,113)';

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
        background: {

        }
    },
    typography: {
        fontFamily: 'Apercu, sans-serif',
        body1: {
            fontSize: '14px',
            fontWeight: 300,
        },
        h1: {
            fontFamily: 'Ogg Roman, serif',
            fontSize: '2.5rem',
            lineHeight: 1.2,
            fontWeight: 300,
        },
        h2: {
            fontSize: '2rem',
        },
        h3: {
            fontSize: '1.75rem',
            lineHeight: 1.2,
            fontWeight: 300,
        },
        h4: {
            fontSize: '1.5rem',
            lineHeight: 1.2,
            fontWeight: 300,
        },
        h6: {
            fontSize: '1rem',
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
        MuiFormLabel: {
            styleOverrides: {
                colorSecondary: {
                    color: 'rgba(255,255,255,0.5)',
                }
            }
        },
        MuiIcon: {
            defaultProps: {
                sx: {
                    fontFamily: `"Material Icons Sharp"`,
                    fontDisplay: "block",
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                track: {
                    borderRadius: 0,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                },
                thumb: {
                    borderRadius: 0,
                    border: '1px solid rgba(0,0,0,0.1)'
                }
            }
        }
    }
});

export default theme;