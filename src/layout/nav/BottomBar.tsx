import Container from "@mui/material/Container";
import Breadcrumbs from "./Breadcrumbs";
import {BreadCrumb} from "../../types/settings";

type BottomBarProps = {
    breadcrumbs?: BreadCrumb[]
}

export default function BottomBar({breadcrumbs}: BottomBarProps) {
    return (
        <Container sx={{
            display: 'flex',
            height: '30px',
            alignItems: 'center',
            position: 'relative'
        }}>
            {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
        </Container>
    )
}