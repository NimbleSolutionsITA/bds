import {Container, Grid} from "@mui/material";
import {GooglePlaces} from "../../../pages/api/google-places";
import LogoButton from "./LogoButton";
import GoogleAddress from "./GoogleAddress";
import GoogleReviews from "./GoogleReviews";
import BottomLinks from "./BottomLinks";
import Payments from "../../components/Payments";


type FooterProps = {
	googlePlaces: GooglePlaces
}

const Footer = ({googlePlaces}: FooterProps) => {
	return (
		<footer style={{backgroundColor: '#fff', position: 'relative'}}>
			<Container sx={{padding: '24px 20px', zIndex: (theme) => theme.zIndex.appBar - 2}}>
				<Grid container>
					<Grid item xs={12} md={3} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
						<LogoButton />
					</Grid>
					<Grid item xs={12} sm={6} md={3} sx={{padding: '0 14px', textAlign: {xs: 'center', md: 'left'}}}>
						<GoogleAddress whatsApp="349 6393775" name="BOTTEGA DI SGUARDI" address={googlePlaces.main} />
					</Grid>
					<Grid item xs={12} sm={6} md={3} sx={{padding: '0 14px', textAlign: {xs: 'center', md: 'left'}}}>
						<GoogleAddress whatsApp="334 1577915" name="BOTTEGA DI SGUARDI - DENTRO" address={googlePlaces.secondary} />
					</Grid>
					<Grid item xs={12} md={3} sx={{padding: '0 14px', textAlign: 'center'}}>
						<GoogleReviews address={googlePlaces.main} />
						<Payments />
					</Grid>
					<Grid item xs={12} sx={{borderTop: '1px solid #ccc', marginTop: '20px'}}>
						<BottomLinks />
					</Grid>
				</Grid>
			</Container>
		</footer>
    );
}
export default Footer;