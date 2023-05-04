import {HomeProps} from "../../../pages";
import {Button, Grid} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";

type BannerBottomProps = {
	bannerBottom: HomeProps['page']['bannerBottom']
}

const BannerBottom = ({bannerBottom}: BannerBottomProps) => (
	<Grid container sx={{minHeight: '60vh', alignItems: 'end'}}>
		<SideGrid column={bannerBottom.leftColumn} />
		<Grid item xs={12} md={4}>
			<div
				style={{
					width: '100%',
					minHeight: '60vh',
					backgroundImage: `url(${bannerBottom.imageCenter.url})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'bottom center',
				}}
			/>
		</Grid>
		<SideGrid column={bannerBottom.rightColumn} />
	</Grid>
)
const SideGrid = ({column}: {column: BannerBottomProps['bannerBottom']['rightColumn'] | BannerBottomProps['bannerBottom']['leftColumn']}) => (
	<Grid
		item
		xs={12}
		md={4}
		sx={{
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'end',
			alignItems: 'center'
		}}
	>
		<div style={{flexGrow: 1}} />
		<HtmlBlock
			sx={{padding: '0% 10% 5% 10%', width: '100%'}}
			html={column.body}
		/>
		<Button sx={{marginBottom: 2}}>
			{column.cta.title}
		</Button>
	</Grid>
)

export default BannerBottom;