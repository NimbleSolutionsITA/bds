import {PageBaseProps} from "../src/types/settings";
import Layout from "../src/layout/Layout";
import {LOCALE} from "../src/utils/utils";
import {cacheGetLayoutProps} from "../src/utils/cache";
import {
	Button,
	Container,
	Grid2 as Grid,
	Table,
	Typography,
	TableBody,
	TableHead,
	TableRow,
	TableCell, TableContainer, Paper
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {openCookiesModal} from "../src/redux/layoutSlice";
import {useDispatch} from "react-redux";


export type GenericPageProps = PageBaseProps
export default function PrivacyPolicyPage({layout}: GenericPageProps) {
	const { t } = useTranslation();
	const dispatch = useDispatch()
	return (
		<Layout layout={layout}>
			<Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 4 }}>
				<Grid container spacing={2}>
					<Grid size={{xs: 12}} sx={{textAlign: "center"}}>
						<Typography fontWeight="500" variant="h2" gutterBottom>
							{t("privacyPolicy.title")}
						</Typography>
						<Typography variant="body1">
							{t("privacyPolicy.intro")}
						</Typography>
					</Grid>
					<Grid size={{xs: 12, md: 6}}>
						<Typography mt={4} fontWeight="500" variant="h4" gutterBottom>{t("privacyPolicy.controllerTitle")}</Typography>
						<Typography>{t("privacyPolicy.controller")}</Typography>

						<Typography mt={4} fontWeight="500" variant="h4" gutterBottom>{t("privacyPolicy.dataCollectedTitle")}</Typography>
						<Typography>{t("privacyPolicy.dataCollected")}</Typography>

						<Typography mt={4} fontWeight="500" variant="h4" gutterBottom>{t("privacyPolicy.purposeTitle")}</Typography>
						<Typography>{t("privacyPolicy.purpose")}</Typography>

						<Typography mt={4} fontWeight="500" variant="h4" gutterBottom>{t("privacyPolicy.legalBasisTitle")}</Typography>
						<Typography>{t("privacyPolicy.legalBasis")}</Typography>
					</Grid>
					<Grid size={{xs: 12, md: 6}}>
						<Typography mt={4} fontWeight="500" variant="h4" gutterBottom>{t("privacyPolicy.dataSharingTitle")}</Typography>
						<Typography>{t("privacyPolicy.dataSharing")}</Typography>

						<Typography mt={4} fontWeight="500" variant="h4" gutterBottom>{t("privacyPolicy.retentionTitle")}</Typography>
						<Typography>{t("privacyPolicy.retention")}</Typography>

						<Typography mt={4} fontWeight="500" variant="h4" gutterBottom>{t("privacyPolicy.rightsTitle")}</Typography>
						<Typography>{t("privacyPolicy.rights")}</Typography>

						<Typography mt={4} fontWeight="500" variant="h4" gutterBottom>{t("privacyPolicy.cookiesTitle")}</Typography>

						<Typography>{t("privacyPolicy.cookies")}</Typography>
					</Grid>
					<Grid size={{xs: 12}} sx={{textAlign: "center"}}>
						<Typography variant="body1">
							{t("privacyPolicy.managePreferences")}
						</Typography>
						<Button sx={{mt: 2}} variant="contained" onClick={() => dispatch(openCookiesModal())}>
							{t("privacyPolicy.openCookieSettings")}
						</Button>
					</Grid>
					<Grid size={{xs: 12}}>
						{/* Cookie Necessari */}
						<Typography fontWeight="500" variant="h2" gutterBottom>
							{t("privacyPolicy.cookieTables.necessary.title")}
						</Typography>
						<Typography>
							{t("privacyPolicy.cookieTables.necessary.description")}
						</Typography>
						<TableContainer component={Paper} sx={{ mb: 6}} elevation={0}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>{t("privacyPolicy.cookieTables.columns.name")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.columns.purpose")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.columns.duration")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.columns.provider")}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>session_id</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.necessary.purpose.session")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.session")}</TableCell>
										<TableCell>bottegadisguardi.com</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>csrf_token</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.necessary.purpose.csrf")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.session")}</TableCell>
										<TableCell>bottegadisguardi.com</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>pll_language</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.necessary.purpose.language")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.1year")}</TableCell>
										<TableCell>bottegadisguardi.com</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>newsletter_optin</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.necessary.purpose.newsletter")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.1year")}</TableCell>
										<TableCell>bottegadisguardi.com</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>_sentry_breadcrumb</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.advertising.purpose.sentry")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.session")}</TableCell>
										<TableCell>Sentry</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>

						{/* Cookie Pubblicitari */}
						<Typography variant="h4" fontWeight="500" gutterBottom>
							{t("privacyPolicy.cookieTables.advertising.title")}
						</Typography>
						<Typography>
							{t("privacyPolicy.cookieTables.advertising.description")}
						</Typography>
						<TableContainer component={Paper} sx={{ mb: 6}} elevation={0}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>{t("privacyPolicy.cookieTables.columns.name")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.columns.purpose")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.columns.duration")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.columns.provider")}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>_fbp</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.advertising.purpose.facebook")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.3months")}</TableCell>
										<TableCell>Facebook</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>_ga</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.advertising.purpose.analytics")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.2years")}</TableCell>
										<TableCell>Google</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>ads/ga-audiences</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.advertising.purpose.googleAds")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.session")}</TableCell>
										<TableCell>Google Ads</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>google_pay_token</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.advertising.purpose.googlePay")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.session")}</TableCell>
										<TableCell>Google Pay</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>apple_pay_session</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.advertising.purpose.applePay")}</TableCell>
										<TableCell>{t("privacyPolicy.cookieTables.duration.session")}</TableCell>
										<TableCell>Apple Pay</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
			</Container>
		</Layout>
	)
}

export async function getStaticProps({ locale}: { locale: LOCALE}) {
	// @ts-ignore
	const [
		{ssrTranslations, ...layoutProps},
	] = await Promise.all([
		cacheGetLayoutProps(locale),
	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			layout: {
				...layoutProps,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'Privacy Policy', href: urlPrefix + '/privacy-policy' },
				]
			},
			...ssrTranslations
		},
	}
}