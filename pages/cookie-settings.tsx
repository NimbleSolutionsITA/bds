import {Button, Container, FormControlLabel, Grid, Switch, SxProps, Theme, Typography} from "@mui/material";
import {PageBaseProps} from "../src/types/settings";
import {getLayoutProps} from "../src/utils/wordpress_api";
import {useState} from "react";
import Layout from "../src/layout/Layout";
import Cookies from 'js-cookie';
import {openCookiesSavedDrawer} from "../src/redux/layout";
import {useDispatch} from "react-redux";


export type GenericPageProps = PageBaseProps & {

}

export default function CookieSettingsPage({layout}: GenericPageProps) {
	const dispatch = useDispatch();
	const analyticsCookie = Cookies.get('analytics') === 'true';
	// const profilingCookie = Cookies.get('profiling') === 'true';
	const usageCookie = Cookies.get('usage') === 'true';


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

	console.log(analyticsCookie, analytics)
	console.log(usageCookie, usage)
	return (
		<Layout layout={layout}>
			<Container>
				<Typography variant="h1">
					Preferenze Cookie
				</Typography>
				<Typography sx={{marginTop: '20px'}}>
					I cookie sono delle informazione salvate in piccoli file di testo sul tuo browser quando visiti un sito web. Questi cookie consentono al mittente di identificare il tuo dispositivo durante il periodo di validità del consenso, che di solito è di un anno.
				</Typography>
				<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked disabled />
				)} label="Cookie funzionali (non facoltativi)" />
				<Typography>
					Alcuni di questi cookie sono essenziali per garantire il corretto funzionamento del sito e non possono essere disabilitati. Essi forniscono funzionalità chiave al sito (come la selezione della lingua, il carrello degli acquisti, la lista dei desideri, ecc.), oltre a contribuire alla protezione del sito da attacchi malevoli.
				</Typography>
				<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked={analytics} onChange={(e, value) => {
						setSaved(false)
						setAnalytics(value)
					}} />
				)} label="Cookie analitici" />
				<Typography>
					{`Altri cookie vengono utilizzati per analizzare il comportamento dei visitatori e monitorare le performance del sito. Accettando questi cookie, ci aiuti a migliorare il nostro sito web e a offrire un'esperienza di navigazione ottimale.`}
				</Typography>
				{/*<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked={profiling} onChange={(e, value) => {
						setSaved(false)
						setProfiling(value)
					}} />
				)} label="Cookie di profilazione pubblicitaria" />
				<Typography>
					Inoltre, ci sono cookie che consentono al sito di Bottega di Sguardi di mostrarti annunci pubblicitari basati sulle tue preferenze, in linea con le informazioni raccolte durante la tua navigazione. Questi cookie sono impostati sia da noi che da terze parti attentamente selezionate. Nel caso in cui disabiliti questi cookie, gli annunci che visualizzerai potrebbero essere meno pertinenti ai tuoi interessi personali.
				</Typography>*/}
				<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked={usage} onChange={(e, value) => {
						setSaved(false)
						setUsage(value)
					}} />
				)} label="Cookie per la personalizzare la tua esperienza su Bottega di Sguardi" />
				<Typography>
					{`Infine, esistono cookie che raccolgono informazioni sulle modalità di utilizzo del sito da parte dell'utente, al fine di migliorarne la qualità, personalizzarne le funzionalità e garantire un'esperienza di navigazione ottimizzata.`}
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
							Salve le preferenze
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
							Accetta tuttti i cookie
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