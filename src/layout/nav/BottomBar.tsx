import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function BottomBar() {
    return (
        <Container sx={{justifyContent: 'center', display: 'flex', height: '30px', alignItems: 'center'}}>
            <Box width="calc(50% - 10px)" textAlign="right">
                <Typography fontWeight={300} fontSize="small">
                    Spedizione gratuita per ordini superiori a 150€
                </Typography>
            </Box>
            <Box width="20px" textAlign="center">
                <Typography fontWeight={300} fontSize="small">
                    |
                </Typography>
            </Box>
            <Box width="calc(50% - 10px)">
                <Typography fontWeight={300} fontSize="small">
                    Spedizione in Italia entro 24/48 ore con corriere DHL o GLS
                </Typography>
            </Box>
        </Container>
    )
}