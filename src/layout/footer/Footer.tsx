import {Button, Container, Grid, Typography} from "@mui/material";
import {GooglePlaces} from "../../../pages/api/google-places";
import LogoButton from "./LogoButton";
import GoogleAddress from "./GoogleAddress";
import GoogleReviews from "./GoogleReviews";
import BottomLinks from "./BottomLinks";
import Payments from "../../components/Payments";
import NewsletterForm from "../../components/NewsletterForm";
import {useTranslation} from "react-i18next";
import {BaseLayoutProps, Menus} from "../../types/settings";
import {
	DESIGNERS_SUB_PATH,
	LIQUIDES_IMAGINAIRES_SUB_PATH,
	OUR_PRODUCTION_SUB_PATH,
	PROFUMUM_ROMA_SUB_PATH
} from "../../utils/endpoints";
import Link from "../../components/Link";
import {getRelativePath} from "../../utils/utils";


type FooterProps = {
	googlePlaces: GooglePlaces
	mobileMenu: Menus['mobileMenu']
	categories: BaseLayoutProps['categories']
}

const Footer = ({googlePlaces, categories, mobileMenu: [opticalMan, sunglassesMan, opticalWoman, sunglassesWoman, designers, ourProduction, fragrances, store, blog]}: FooterProps) => {
	const { t } = useTranslation('common');
	const footerMenuLeft = [
		{ label: `${opticalMan.title} ${t('man')}`, href: opticalMan.url },
		{ label:`${sunglassesMan.title} ${t('man')}`, href: sunglassesMan.url },
		{ label: `${opticalWoman.title} ${t('woman')}`, href: opticalWoman.url },
		{ label: `${sunglassesWoman.title} ${t('woman')}`, href: sunglassesWoman.url },
		{ label: designers.title, href: DESIGNERS_SUB_PATH },
	]
	const footerMenuRight = [
		{ label: ourProduction.title, href: OUR_PRODUCTION_SUB_PATH },
		{ label: categories.fragrances.profumumMain[0].name, href: PROFUMUM_ROMA_SUB_PATH },
		{ label: categories.fragrances.liquidesMain[0].name, href: LIQUIDES_IMAGINAIRES_SUB_PATH },
		{ label: store.title, href: store.url },
		{ label: blog.title, href: blog.url },
	]
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
							{footerMenuLeft.map((item) => (
								<FooterNavButton key={item.label} title={item.label} href={item.href} />
							))}
						</Grid>
						<Grid item xs={12} sm={6} md={3} sx={{padding: '0 14px', display: { xs: 'none', md: 'unset'}}}>
							{footerMenuRight.map((item) => (
								<FooterNavButton key={item.label} title={item.label} href={item.href} />
							))}
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

const FooterNavButton = ({title, href}: {title: string, href: string}) => {
	return (
		<Button
			variant="text"
			fullWidth
			sx={{justifyContent: 'start', textAlign: 'left', paddingLeft: 0}}
			component={Link}
			href={getRelativePath(href)}
		>
			{title}
		</Button>
	)
}
export default Footer;