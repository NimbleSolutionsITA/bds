import {useEffect, useState} from "react";
import {Button, Container, Grid, Drawer, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeCookiesDrawer, closeCookiesSavedDrawer} from "../../redux/layout";
import {RootState} from "../../redux/store";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import Cookies from "js-cookie";

const CookiesDrawer = () => {
	const { t } = useTranslation('common')
	const { cookiesDrawerOpen, cookiesSavedDrawerOpen } = useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch()
	const {push} = useRouter()
	const [drawerTimer, setDrawerTimer] = useState<NodeJS.Timeout | null>(null);
	const handleAccept = () => {
		Cookies.set('analytics', 'true');
		Cookies.set('profiling', 'true');
		Cookies.set('usage', 'true');
		dispatch(closeCookiesDrawer())
	}
	const handleGoToSettings = () => {
		dispatch(closeCookiesDrawer())
		return push('/cookie-settings')
	}

	useEffect(() => {
		// Start a new timer when cookiesSavedDrawerOpen becomes true
		if (cookiesSavedDrawerOpen) {
			const timer = setTimeout(() => {
				dispatch(closeCookiesSavedDrawer());
			}, 2000);
			setDrawerTimer(timer);
		}
		return () => {
			if (drawerTimer) {
				clearTimeout(drawerTimer);
			}
		}
	}, [cookiesSavedDrawerOpen]);

	return (
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
			open={cookiesDrawerOpen || cookiesSavedDrawerOpen}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
				<Typography sx={{fontFamily: 'Ogg Roman', fontSize: '22px'}}>
					Cookie Policy
				</Typography>
				{cookiesDrawerOpen && (<>
					<Typography sx={{margin: '25px 0'}}>
						{t('cookie-policy.body')}
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Button
								variant="outlined"
								color="primary"
								fullWidth
								onClick={handleGoToSettings}
								href="/cookie-settings"
								sx={{marginTop: '20px'}}
							>
								{t('cookie-policy.edit')}
							</Button>
						</Grid>
						<Grid item xs={12} md={6}>
							<Button
								onClick={handleAccept}
								variant="contained"
								color="primary"
								fullWidth
								sx={{marginTop: '20px'}}
							>
								{t('accept')}
							</Button>
						</Grid>
					</Grid>
				</>)}
				{cookiesSavedDrawerOpen && (
					<Typography sx={{margin: '25px 0'}}>
						{t('cookie-policy.saved')}
					</Typography>
				)}
			</Container>
		</Drawer>
	)
}

export default CookiesDrawer