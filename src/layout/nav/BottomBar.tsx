import Container from "@mui/material/Container";
import Breadcrumbs from "./Breadcrumbs";
import {BreadCrumb} from "../../types/settings";

type BottomBarProps = {
    breadcrumbs?: BreadCrumb[]
}

export default function BottomBar({breadcrumbs}: BottomBarProps) {
    return breadcrumbs && (
        <Container sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            paddingTop: '5px',
            paddingBottom: '3px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.10)',
            marginBottom: { xs: 0, md: '5px' },
            backgroundColor: '#FFF',
        }}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Container>
    )
}