import {Button, Container, Grid2 as Grid, Drawer, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeCookiesDrawer} from "../../redux/layoutSlice";
import {RootState} from "../../redux/store";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {setLocalStorage} from "../../utils/storage-helper";
import {gtagConsent} from "../../utils/utils";

const CookiesDrawer = () => {
	const { t } = useTranslation('common')
	const { cookiesDrawerOpen } = useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch()
	const {push} = useRouter()
	const handleAccept = () => {
		setLocalStorage('cookie_consent', {
			analytics: true,
			profiling: true,
			usage: true,
			storage: true
		})
		gtagConsent({
			'ad_user_data': 'granted',
			'ad_personalization': 'granted',
			'ad_storage': 'granted',
			'analytics_storage': 'granted'
		})
		dispatch(closeCookiesDrawer())
	}
	const handleGoToSettings = () => {
		dispatch(closeCookiesDrawer())
		return push('/cookie-settings')
	}

	return (
		<Drawer
			anchor="right"
			sx={{zIndex: 1300}}
			PaperProps={{
				sx: {
					padding: '20px 0',
					height: 'auto',
					top: {
						xs: 0,
						md: '10%'
					},
					right: {
						xs: 0,
						md: '24px'
					},
					width: '400px',
					maxWidth: '100%',
					backgroundColor: '#f1f1f1',
				}
			}}
			open={cookiesDrawerOpen}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
				<Typography sx={{fontFamily: 'Ogg Roman', fontSize: '22px'}}>
					Cookie Policy
				</Typography>
				<Typography sx={{margin: '25px 0'}}>
					{t('cookie-policy.body')}
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{xs: 12, md: 6}}>
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
					<Grid size={{xs: 12, md: 6}}>
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
			</Container>
		</Drawer>
	)
}

export default CookiesDrawer