import {Typography} from "@mui/material";
import HtmlBlock from "./HtmlBlock";

const BannerText = ({text}: {text: string}) => (
	<div style={{backgroundColor: 'rgba(0,0,0,.1)', textAlign: 'center', padding: '80px 0px 80px 0px'}}>
		<Typography variant="h1" component="div" sx={{
			fontSize: '2.5rem',
			fontWeight: 500,
			lineHeight: 1.2,
			maxWidth: '500px',
			margin: 'auto'
		}}>
			<HtmlBlock html={text} />
		</Typography>
	</div>
)

export default BannerText