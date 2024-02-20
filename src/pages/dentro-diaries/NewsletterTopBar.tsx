import {Button, Container, Typography} from "@mui/material";
import {openNewsletterDrawer} from "../../redux/layoutSlice";
import {useDispatch} from "react-redux";
import {useTranslation, Trans} from "next-i18next";

const NewsletterTopBar = () => {
	const dispatch = useDispatch()
	const {t} = useTranslation()
	return (
		<div style={{
			backgroundColor: '#000',
			color: '#fff',
			borderTop: '1px solid rgba(255, 255, 255, 0.25)',
		}}>
			<Container sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<Typography sx={{fontSize: {xs: '14px', md: '16px'}}}>
					<Trans i18nKey="newsletter.promo-text" components={[<b key={0} />]} />
				</Typography>
				<Button
					size="small"
					onClick={() => dispatch(openNewsletterDrawer())}
				>
					{t('subscribe')}
				</Button>
			</Container>
		</div>
	)
}

export default NewsletterTopBar