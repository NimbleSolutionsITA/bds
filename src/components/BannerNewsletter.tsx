import HtmlBlock from "./HtmlBlock";
import {Button, Box, Collapse, TextField, Zoom, CircularProgress} from "@mui/material";
import {useState} from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type BannerNewsletterProps = {
	body: string
	ctaText: string
}

const BannerNewsletter = ({body, ctaText}: BannerNewsletterProps) => {
	const [buttonText, setButtonText] = useState(ctaText)
	const handleClick = () => {
		if (buttonText === ctaText)
			setButtonText('invia')
		if (buttonText === 'invia') {
			setButtonText('sending')
			setTimeout(() => {
				setButtonText('sent')
			}   , 2000)
		}

	}
	return (
		<Box sx={{
			backgroundColor: '#708477',
			color: '#fff',
			textAlign: 'center',
			padding: '40px 20px'
		}}>
			<HtmlBlock html={body} />
			<Collapse in={buttonText === 'invia'}>
				<div>
					<TextField
						color="secondary"
						label="Email"
						variant="standard"
						type="email"
					/>
				</div>
			</Collapse>
			{
				[ctaText, 'invia'].includes(buttonText) ?
					(
						<Button
							onClick={handleClick}
							variant="contained"
							sx={{margin: '20px auto 0'}}
						>
							{buttonText}
						</Button>
					) : (
						<Zoom in={![ctaText, 'invia'].includes(buttonText)}>
							<div style={{marginTop: '20px'}}>
								{buttonText === 'sent' ?
									<CheckCircleIcon sx={{fontSize: '40px'}} /> :
									<CircularProgress color="secondary" sx={{fontSize: '40px'}} />
								}
							</div>
						</Zoom>
					)
			}
		</Box>
	);
}

export default BannerNewsletter;