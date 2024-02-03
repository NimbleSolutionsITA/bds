import {Button, Container, Grid, Typography} from "@mui/material";
import {GooglePlaces} from "../../../pages/api/google-places";
import LogoButton from "./LogoButton";
import GoogleAddress from "./GoogleAddress";
import GoogleReviews from "./GoogleReviews";
import BottomLinks from "./BottomLinks";
import Payments from "../../components/Payments";
import NewsletterForm from "../../components/NewsletterForm";
import {useTranslation} from "react-i18next";


type FooterProps = {
	googlePlaces: GooglePlaces
}

const Footer = ({googlePlaces}: FooterProps) => {
	const { t } = useTranslation('common');
	return (
		<footer style={{backgroundColor: '#fff', position: 'relative'}}>
			<Container sx={{padding: '24px 20px', zIndex: (theme) => theme.zIndex.appBar - 2}}>
				<Grid container>
					<Grid item xs={12} md={3} sx={{display: {xs: 'flex', sm: 'none', md: 'flex'}, justifyContent: 'center'}}>
						<div>
							<LogoButton />
						</div>
					</Grid>
					<Grid item container xs={12} md={9}>
						<Grid item sm={4} sx={{display: {xs: 'none', sm: 'flex', md: 'none'}, justifyContent: 'center'}}>
							<div>
								<LogoButton />
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={3} sx={{padding: '0 14px', display: { xs: 'none', md: 'unset'}}}>
							<FooterNavButton title="Sunglasses Man" />
							<FooterNavButton title="Sunglasses Woman" />
							<FooterNavButton title="Optical Man" />
							<FooterNavButton title="Optical Woman" />
							<FooterNavButton title="Designers" />
						</Grid>
						<Grid item xs={12} sm={6} md={3} sx={{padding: '0 14px', display: { xs: 'none', md: 'unset'}}}>
							<FooterNavButton title="Our Production" />
							<FooterNavButton title="Profumum Roma" />
							<FooterNavButton title="Liquides Imaginaires" />
							<FooterNavButton title="Store" />
							<FooterNavButton title="Dentro Diaries" />
						</Grid>
						<Grid item xs={12} sm={8} md={6} sx={{padding: '0 14px', margin: { xs: '20px 0', md: '0 0 20px'}}}>
							<h5>NEWSLETTER</h5>
							<Typography sx={{fontStyle: 'italic', fontSize: '13px', lineHeight: '1.3', margin: '10px 0'}}>
								{t('newsletter.body')}
							</Typography>
							<NewsletterForm />
						</Grid>
						<Grid item xs={12} sm={4} md={4} sx={{padding: '0 14px'}}>
							<GoogleAddress whatsApp="349 6393775" name="BOTTEGA DI SGUARDI" address={googlePlaces.main} />
						</Grid>
						<Grid item xs={12} sm={4} md={4} sx={{padding: '0 14px'}}>
							<GoogleAddress whatsApp="334 1577915" name="BOTTEGA DI SGUARDI - DENTRO" address={googlePlaces.secondary} />
						</Grid>
						<Grid item sm={4} sx={{padding: '0 14px', textAlign: 'center', display: { xs: 'none', sm: 'unset'}}}>
							<GoogleReviews address={googlePlaces.main} />
							<Payments />
						</Grid>
					</Grid>
					<Grid item xs={12} sx={{borderTop: '1px solid #ccc', marginTop: '20px'}}>
						<BottomLinks />
					</Grid>
				</Grid>
			</Container>
		</footer>
    );
}

const FooterNavButton = ({title}: {title: string}) => (
	<Button variant="text" fullWidth sx={{justifyContent: 'start', textAlign: 'left', paddingLeft: 0}}>
		{title}
	</Button>
)
export default Footer;