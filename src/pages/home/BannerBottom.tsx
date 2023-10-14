import {HomeProps} from "../../../pages";
import {Box, Button, Grid} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";

type BannerBottomProps = {
	bannerBottom: HomeProps['page']['bannerBottom']
}

const BannerBottom = ({bannerBottom}: BannerBottomProps) => (
	<Grid container sx={{minHeight: '60vh', alignItems: 'end'}}>
		<Grid container item xs={12} md={8} sx={{flexDirection: {xs: 'column-reverse', md: 'row'}, alignItems: {md: 'end'}}}>
			<SideGrid column={bannerBottom.leftColumn} />
			<CenterImage imageCenter={bannerBottom.imageCenter} />
		</Grid>
		<SideGrid column={bannerBottom.rightColumn} isRight />
	</Grid>
)

const CenterImage = ({imageCenter}: { imageCenter: BannerBottomProps['bannerBottom']['imageCenter'] }) => (
	<Grid item xs={12} md={6}>
		<Box
			sx={{
				width: '100%',
				minHeight: {
					xs: '180vw',
					md: '60vw'
				},
				backgroundImage: `url(${imageCenter.url})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundPosition: 'bottom center',
			}}
		/>
	</Grid>
)
const SideGrid = ({column, isRight}: {isRight?: boolean, column: BannerBottomProps['bannerBottom']['rightColumn'] | BannerBottomProps['bannerBottom']['leftColumn']}) => (
	<Grid
		item
		xs={12}
		md={isRight ? 4 : 6}
		sx={{
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'end',
			alignItems: 'center',
			marginTop: {
				xs: '5%',
				md: 0
			}
		}}
	>
		<HtmlBlock
			sx={{padding: '0% 10% 10px 10%', width: '100%'}}
			html={column.body}
		/>
		<Button sx={{marginBottom: 3}} component="a" href={column.cta.url}>
			{column.cta.title}
		</Button>
	</Grid>
)

export default BannerBottom;