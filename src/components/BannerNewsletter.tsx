import HtmlBlock from "./HtmlBlock";
import {Button, Box} from "@mui/material";
import {CUSTOM_COLOR} from "../theme/theme";
import {useDispatch} from "react-redux";
import {openNewsletterDrawer} from "../redux/layoutSlice";

type BannerNewsletterProps = {
	body: string
	ctaText: string
}

const BannerNewsletter = ({body, ctaText}: BannerNewsletterProps) => {
	const dispatch = useDispatch()
	return (
		<Box sx={{
			backgroundColor: CUSTOM_COLOR,
			color: '#fff',
			textAlign: 'center',
			padding: '40px 20px'
		}}>
			<HtmlBlock html={body} />
			<Button
				onClick={() => dispatch(openNewsletterDrawer())}
				variant="contained"
				sx={{margin: '20px auto 0'}}
			>
				{ctaText}
			</Button>
		</Box>
	);
}

export default BannerNewsletter;