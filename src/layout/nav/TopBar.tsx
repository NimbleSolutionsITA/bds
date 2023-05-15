import Container from "@mui/material/Container";
import {IconButton} from "@mui/material";
import {Facebook, Instagram} from "@mui/icons-material";
import CartIndicator from "../../components/CartIndicator";
import React from "react";
import LanguageButton from "../../components/LanguageButton";

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
                <IconButton size="small">
                    <Facebook fontSize="small" />
                </IconButton>
                <IconButton size="small">
                    <Instagram fontSize="small" />
                </IconButton>
            </div>
            <CartIndicator amount={13} />
        </Container>
    )
}