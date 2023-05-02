import Container from "@mui/material/Container";
import {Button, IconButton} from "@mui/material";
import {Facebook, Instagram} from "@mui/icons-material";
import Box from "@mui/material/Box";
import {useRouter} from "next/router";

export default function TopBar() {
    const {locale, locales, push, asPath} = useRouter()
    const setLanguage = async (language: string) => {
        document.cookie = `NEXT_LOCALE=${language}; max-age=31536000; path=/`
        await push(asPath, asPath, {locale: language})
    }
    return (
        <Container sx={{display: 'flex', justifyContent: 'space-between'}}>
            {locales?.filter(l => l !== locale).map((language) => (
                <Button
                    key={language}
                    onClick={() => setLanguage(language)}
                    sx={{minWidth: 0, color: 'black'}}
                    size="small"
                    variant="text"
                >
                    {language}
                </Button>
            ))}
            <Box>
                <IconButton size="small">
                    <Facebook fontSize="small" />
                </IconButton>
                <IconButton size="small">
                    <Instagram fontSize="small" />
                </IconButton>
            </Box>
        </Container>
    )
}