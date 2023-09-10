import {Button, Grid} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import Image from "next/image";
import {StorePageProps} from "../../../pages/negozi-ottica-firenze";

type BannerContactProps = {
	data: StorePageProps['acf']['contactsBanner']
}

const BannerContact = ({ data }: BannerContactProps) => (
	<Grid container alignItems="stretch" sx={{padding: '40px 0'}} spacing={5}>
		<ContactBlock {...data.left} />
		<ContactBlock {...data.right} />
		<Grid item xs={12} lg={6} >
			<div style={{position: 'relative', height: '100%', minHeight: '200px'}}>
				<Image
					src={data.image}
					alt="Negozio Bottega di Sguardi"
					fill
					style={{objectFit: 'cover', objectPosition: 'center center'}}
				/>
			</div>
		</Grid>
	</Grid>
)


const ContactBlock = ({ body, cta1, cta2, cta3 }: BannerContactProps['data']['right'] | BannerContactProps['data']['left']) => (
	<Grid item xs={12} md={6} lg={3} sx={{display: 'flex', flexDirection: 'column', alignItems: {xs: 'center', md: 'start'}}}>
		<HtmlBlock html={body} />
		<Button target="_blank" variant="outlined" component="a" href={cta1.url} sx={{marginTop: '20px', width: '100%'}}>
			{cta1.title}
		</Button>
		<Button target="_blank" variant="outlined" component="a" href={cta2.url} sx={{marginTop: '20px', width: '100%'}}>
			{cta2.title}
		</Button>
		<Button target="_blank" variant="outlined" component="a" href={cta3.url} sx={{marginTop: '20px', width: '100%'}}>
			{cta3.title}
		</Button>
	</Grid>
)
export default BannerContact