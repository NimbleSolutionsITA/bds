import {Container, IconButton, SwipeableDrawer, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeNewsletterDrawer, openNewsletterDrawer} from "../../redux/layoutSlice";
import {RootState} from "../../redux/store";
import {CloseSharp} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import NewsletterForm from "../../components/NewsletterForm";

const NewsletterDrawer = () => {
	const { newsletterDrawerOpen } = {newsletterDrawerOpen: true} // useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch()
	const { t } = useTranslation('common');

	return (
		<SwipeableDrawer
			anchor="right"
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
			open={newsletterDrawerOpen}
			onClose={() => dispatch(closeNewsletterDrawer())}
			onOpen={() => dispatch(openNewsletterDrawer())}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
				<IconButton onClick={() => dispatch(closeNewsletterDrawer())} sx={{position: 'absolute', right: '20px', top: '2px', padding: '4px'}}>
					<CloseSharp />
				</IconButton>
				<Typography sx={{fontFamily: 'Ogg Roman', fontSize: '22px', marginTop: '20px'}}>
					{t('newsletter.title')}
				</Typography>
				<Typography sx={{margin: '25px 0'}}>
					{t('newsletter.body')}
				</Typography>
				{newsletterDrawerOpen && <NewsletterForm/>}
			</Container>
		</SwipeableDrawer>
	)
}

export default NewsletterDrawer