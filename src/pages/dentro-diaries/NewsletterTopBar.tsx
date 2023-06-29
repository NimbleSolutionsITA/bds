import {Button, Container, Typography} from "@mui/material";
import {openNewsletterDrawer} from "../../redux/layout";
import {useDispatch} from "react-redux";

const NewsletterTopBar = () => {
	const dispatch = useDispatch()
	return (
		<div style={{
			backgroundColor: '#000',
			color: '#fff',
		}}>
			<Container sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<Typography sx={{fontSize: '16px'}}>
					<b>Iscriviti alla newsletter</b> per ricevere le ultime notizie e <b>10% di sconto</b> sul tuo primo ordine!
				</Typography>
				<Button
					size="small"
					onClick={() => dispatch(openNewsletterDrawer())}
				>
					Iscriviti
				</Button>
			</Container>
		</div>
	)
}

export default NewsletterTopBar