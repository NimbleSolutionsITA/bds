import {HomeProps} from "../../../pages";
import {Grid} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";

type BannerTopProps = {
	bannerTop: HomeProps['page']['bannerTop']
}

const BannerTop = ({bannerTop}: BannerTopProps) => {

	return (
		<Grid
			container
			sx={{minHeight: '60vh'}}
		>
			<Grid item xs={12} md={4}>
				<div
					style={{
						width: '100%',
						height: '100%',
						backgroundImage: `url(${bannerTop.imageLeft.url})`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'bottom left',
					}}
				/>
			</Grid>
			<Grid item xs={12} md={4}>
				<HtmlBlock
					sx={{
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'end',
						padding: '0% 10% 5% 10%'
					}}
					html={bannerTop.body}
				/>
			</Grid>
			<Grid item xs={12} md={4}>
				<div
					style={{
						width: '100%',
						height: '100%',
						backgroundImage: `url(${bannerTop.imageRight.url})`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
						backgroundPosition: 'bottom center',
					}}
				/>
			</Grid>
		</Grid>
	)
}

export default BannerTop;