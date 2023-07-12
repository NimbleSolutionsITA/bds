import {Button, Grid, Typography} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock"
import FullPageSlider from "../../components/FullPageSlider";
import {StorePageProps} from "../../../pages/negozi-ottica-firenze";

type SliderWithTextProps = {
	data: StorePageProps['acf']['bannerBottom']
}
const SliderWithText = ({data: {
	right: {title, subtitle, body, ctaLeft, ctaRight},
	left: {slider}
}}: SliderWithTextProps) => {
	return (
		<Grid
			container
			alignItems="stretch"
			sx={{
				marginTop: '40px',
				'& div div div': {
					height: '100%'
				}
			}}
		>
			<Grid item xs={12} lg={6} sx={{display: 'flex', minHeight: '500px'}}>
				<FullPageSlider images={slider} disableFullPage />
			</Grid>
			<Grid item xs={12} lg={6} sx={{padding: {xs: '1% 5% 5%', lg: '1% 5% 1% 5%'}}}>
				<Typography variant="h1" component="h2" sx={{ textAlign: 'center', fontSize: '40px'}}>
					{title}
				</Typography>
				<Typography variant="h3" component="h3" sx={{ textAlign: 'center', fontSize: '30px', padding: '10px 0 30px', borderBottom: '1px solid'}}>
					| {subtitle} |
				</Typography>
				<HtmlBlock html={body} sx={{ marginTop: '20px' }} component={Typography} />
				<div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px'}}>
					{ctaLeft && (
						<Button target="_blank" variant="outlined" component="a" href={ctaLeft.url}>
							{ctaLeft.title}
						</Button>
					)}
					{ctaRight && (
						<Button target="_blank" variant="outlined" component="a" href={ctaRight.url}>
							{ctaRight.title}
						</Button>
					)}
				</div>
			</Grid>
		</Grid>
	);
}



export default SliderWithText;
