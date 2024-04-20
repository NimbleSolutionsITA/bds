'use client;'

import {Button, Container, Drawer, FormControlLabel, Grid, Switch, SxProps, Theme, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {getLocalStorage, setLocalStorage} from "../../utils/storage-helper";
import {gtagConsent} from "../../utils/utils";


const defaultCookieSettings = {
	analytics: true,
	profiling: true,
	usage: true,
	storage: true
}

const getConsent = (consent: boolean) => consent ? 'granted' : 'denied'

const CookieSettings = () => {
	const { t } = useTranslation('common');
	const [analytics, setAnalytics] = useState(defaultCookieSettings.analytics);
	const [profiling, setProfiling] = useState(defaultCookieSettings.profiling);
	const [usage, setUsage] = useState(defaultCookieSettings.usage);
	const [storage, setStorage] = useState(defaultCookieSettings.storage);
	const [saved, setSaved] = useState(false);
	const [drawerTimer, setDrawerTimer] = useState<NodeJS.Timeout | null>(null);

	const handleSaveSettings = (allTrue?: boolean) => {
		if (allTrue) {
			setAnalytics(true);
			setProfiling(true);
			setUsage(true);
			setStorage(true);
		}
		const preferences = {
			analytics: allTrue || analytics,
			profiling: allTrue || profiling,
			usage: allTrue || usage,
			storage: allTrue || storage
		}
		setLocalStorage('cookie_consent', preferences)
		gtagConsent({
			'ad_user_data': getConsent(preferences.usage),
			'ad_personalization': getConsent(preferences.profiling),
			'ad_storage': getConsent(preferences.storage),
			'analytics_storage': getConsent(preferences.analytics),
		})
		setSaved(true);
	}

	const formLabelStyle: SxProps<Theme> = {
		margin: '20px 0 10px',
		marginRight: 'auto',
		textTransform: 'uppercase'
	}

	useEffect(() => {
		if (saved) {
			const timer = setTimeout(() => {
				setSaved(false);
			}, 2000);
			setDrawerTimer(timer);
		}
		return () => {
			if (drawerTimer) {
				clearTimeout(drawerTimer);
			}
		}
	}, [saved]);

	useEffect (() => {
		let cookieSettings = getLocalStorage("cookie_consent", defaultCookieSettings)
		setAnalytics(cookieSettings.analytics)
		setProfiling(cookieSettings.profiling)
		setUsage(cookieSettings.usage)
		setStorage(cookieSettings.storage)
	}, [])

	return (
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
			<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
					<Switch checked={profiling} onChange={(e, value) => {
						setSaved(false)
						setProfiling(value)
					}} />
				)} label={t('cookies.profiling')} />
			<Typography>
				{t('cookies.profiling-body')}
			</Typography>
			<FormControlLabel sx={formLabelStyle} labelPlacement="end" control={(
				<Switch checked={storage} onChange={(e, value) => {
					setSaved(false)
					setStorage(value)
				}} />
			)} label={t('cookies.storage')} />
			<Typography>
				{t('cookies.storage-body')}
			</Typography>
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
			<Drawer
				anchor="right"
				PaperProps={{
					sx: {
						padding: '20px 0',
						height: 'auto',
						top: '200px',
						right: {
							xs: 0,
							md: '24px'
						},
						width: '400px',
						maxWidth: '100%',
						backgroundColor: '#f1f1f1',
					}
				}}
				open={saved}
			>
				<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
					<Typography sx={{fontFamily: 'Ogg Roman', fontSize: '22px'}}>
						Cookie Policy
					</Typography>
					<Typography sx={{margin: '25px 0'}}>
						{t('cookie-policy.saved')}
					</Typography>
				</Container>
			</Drawer>
		</Container>
	)
}

export default CookieSettings