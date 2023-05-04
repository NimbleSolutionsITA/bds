import HtmlBlock from "./HtmlBlock";
import {Button, Box} from "@mui/material";

type BannerNewsletterProps = {
	body: string
	ctaText: string
}

const BannerNewsletter = ({body, ctaText}: BannerNewsletterProps) => {
	return (
		<Box sx={{
			backgroundColor: '#708477',
			color: '#fff',
			textAlign: 'center',
			padding: '40px 20px'
		}}>
			<HtmlBlock html={body} />
			<Button variant="contained" sx={{marginTop: '20px'}}>
				{ctaText}
			</Button>
		</Box>
	);
}

export default BannerNewsletter;