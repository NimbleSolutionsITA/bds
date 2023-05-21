import {Button, Container, IconButton, SwipeableDrawer, TextField, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeNewsletterDrawer, openNewsletterDrawer} from "../../redux/layout";
import {RootState} from "../../redux/store";
import {useState} from "react";
import Link from "../../components/Link";
import {CloseSharp} from "@mui/icons-material";

const NewsletterDrawer = () => {
	const [email, setEmail] = useState<string>('')
	const { newsletterDrawerOpen } = useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch()
	return (
		<SwipeableDrawer
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
			open={newsletterDrawerOpen}
			onClose={() => dispatch(closeNewsletterDrawer())}
			onOpen={() => dispatch(openNewsletterDrawer())}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
				<IconButton onClick={() => dispatch(closeNewsletterDrawer())} sx={{position: 'absolute', right: '20px', top: '2px', padding: '4px'}}>
					<CloseSharp />
				</IconButton>
				<Typography sx={{fontFamily: 'Ogg Roman', fontSize: '22px'}}>
					Iscriviti alla newsletter
				</Typography>
				<Typography sx={{margin: '25px 0'}}>
					Abbonati alla nostra newsletter per ottenere aggiornamenti su esclusive anteprime di collezioni, eventi eccezionali e offerte di stagione.
				</Typography>
				<form>
					<TextField
						required
						fullWidth
						label="Email"
						variant="outlined"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Typography sx={{fontStyle: 'italic', fontSize: '13px', lineHeight: '1.3', marginTop: '10px'}}>
						Abbonandoti alla newsletter, confermi di aver letto la <Link href="/privacy-plicy" >Privacy Policy</Link> e acconsenti al trattamento dei tuoi dati personali per finalità di marketing.
					</Typography>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						sx={{marginTop: '20px'}}
					>
						Iscriviti
					</Button>
				</form>
			</Container>
		</SwipeableDrawer>
	)
}

export default NewsletterDrawer