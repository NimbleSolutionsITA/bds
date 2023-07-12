import {Button, Container, FormControlLabel, Grid, Switch, SxProps, Theme, Typography} from "@mui/material";
import {PageBaseProps} from "../src/types/settings";
import {getLayoutProps} from "../src/utils/wordpress_api";
import {useState} from "react";
import Layout from "../src/layout/Layout";
import Cookies from 'js-cookie';
import {openCookiesSavedDrawer} from "../src/redux/layout";
import {useDispatch} from "react-redux";
import {useTranslation} from "next-i18next";


export type GenericPageProps = PageBaseProps & {

}

export default function CookieSettingsPage({layout}: GenericPageProps) {
	const dispatch = useDispatch();
	const analyticsCookie = Cookies.get('analytics') === 'true';
	// const profilingCookie = Cookies.get('profiling') === 'true';
	const usageCookie = Cookies.get('usage') === 'true';
	const { t } = useTranslation('common');


	const [analytics, setAnalytics] = useState(analyticsCookie);
	// const [profiling, setProfiling] = useState(profilingCookie);
	const [usage, setUsage] = useState(usageCookie);
	const [saved, setSaved] = useState(true);

	const handleSaveSettings = (allTrue?: boolean) => {
		if (allTrue) {
			setAnalytics(true);
			// setProfiling(true);
			setUsage(true);
		}
		Cookies.set('analytics', String(allTrue ?? analytics));
		// Cookies.set('profiling', String(allTrue ?? profiling));
		Cookies.set('usage', String(allTrue ?? usage));
		setSaved(true);
		dispatch(openCookiesSavedDrawer());
	}

	const formLabelStyle: SxProps<Theme> = {
		margin: '20px 0 10px',
		marginRight: 'auto',
		textTransform: 'uppercase'
	}
	return (
		<Layout layout={layout}>
			<Container>
				<Typography variant="h1">
					{t('cookies.title')}
				</Typography>
				<Typography sx={{marginTop: '20px'}}>
					{t('cookies.body')}
				</Typography>
				<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked disabled />
				)} label="Cookie funzionali (non facoltativi)" />
				<Typography>
					{t('cookies.mandatory-body')}
				</Typography>
				<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked={analytics} onChange={(e, value) => {
						setSaved(false)
						setAnalytics(value)
					}} />
				)} label={t('cookies.analytics')} />
				<Typography>
					{t('cookies.analytics-body')}
				</Typography>
				{/*<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked={profiling} onChange={(e, value) => {
						setSaved(false)
						setProfiling(value)
					}} />
				)} label={t('cookies.profiling')} />
				<Typography>
					{t('cookies.profiling-body')}
				</Typography>*/}
				<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked={usage} onChange={(e, value) => {
						setSaved(false)
						setUsage(value)
					}} />
				)} label={t('cookies.usage')} />
				<Typography>
					{t('cookies.usage-body')}
				</Typography>
				<Grid container spacing={2} sx={{margin: '20px 0 40px'}}>
					<Grid item xs={6} md={3}>
						<Button
							disabled={ saved || (analytics === analyticsCookie && /*profiling === profilingCookie &&*/ usage === usageCookie) }
							variant="outlined"
							color="primary"
							fullWidth
							onClick={() => handleSaveSettings()}
							href="/cookie-settings"
							sx={{marginTop: '20px'}}
						>
							{t('cookies.save')}
						</Button>
					</Grid>
					<Grid item xs={6} md={3}>
						<Button
							disabled={analytics && /*profiling &&*/ usage}
							onClick={() => handleSaveSettings(true)}
							variant="contained"
							color="primary"
							fullWidth
							sx={{marginTop: '20px'}}
						>
							{t('cookies.accept')}
						</Button>
					</Grid>
				</Grid>
			</Container>
		</Layout>
	)
}

export async function getStaticProps({ locale}: { locale: 'it' | 'en'}) {
	// @ts-ignore
	const [
		{ssrTranslations, ...layoutProps},
	] = await Promise.all([
		getLayoutProps(locale),
	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			layout: {
				...layoutProps,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'Preferenze Cookie', href: urlPrefix + '/cookie-settings' },
				]
			},
			...ssrTranslations
		},
	}
}