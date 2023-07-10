import {Button, Grid, Typography} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock"
import FullPageSlider from "../../components/FullPageSlider";
import {StorePageProps} from "../../../pages/store";
import Image from "next/image";
import Link from "next/link";

type SliderWithTextProps = {
	data: StorePageProps['acf']['bannerTop']
}
const SliderWithText = ({data: {
	left: {title, body, ctaLeft, ctaRight},
	right: {image, slider}
}}: SliderWithTextProps) => {
	return (
		<Grid
			container
			alignItems="stretch"
			sx={{
				marginTop: '40px',
				flexDirection: {xs: 'row-reverse', lg: 'row'},
				'& div div div': {
					height: '100%'
				}
			}}
		>
			<Grid item xs={12} lg={6} sx={{padding: {xs: '1% 5% 5%', lg: '1% 5% 1% 5%'}}}>
				<Typography variant="h1" component="h2" sx={{ textAlign: 'center', fontSize: '40px', paddingBottom: '30px', borderBottom: '1px solid'}}>
					{title}
				</Typography>
				<HtmlBlock html={body} sx={{ marginTop: '20px' }} component={Typography} />
				<div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px'}}>
					<Button variant="outlined" component={Link} href={ctaLeft.url}>
						{ctaLeft.title}
					</Button>
					<Button variant="outlined" component={Link} href={ctaRight.url}>
						{ctaRight.title}
					</Button>
				</div>
			</Grid>
			<Grid item xs={6} lg={3} sx={{position: 'relative', display: 'flex', minHeight: '500px'}}>
				<Image
					src={image}
					alt="Bottega di Sguardi home slider image"
					fill
					style={{objectFit: 'cover', objectPosition: 'center center'}}
				/>
			</Grid>
			<Grid item xs={6} lg={3} sx={{display: 'flex', paddingRight: {xs: '1%' , lg: 0}, paddingLeft: {xs: 0 , lg: '1%'}, minHeight: '500px'}}>
				<FullPageSlider images={slider} disableFullPage />
			</Grid>
		</Grid>
	);
}



export default SliderWithText;
