import {ListArticle} from "../../types/woocommerce";
import Image from "next/image";
import {Button, Grid, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";

const ArticlePreview = ({ article }: { article: ListArticle }) => {
	const { t } = useTranslation();

	return (
		<Grid container sx={{height: '100%', minHeight: '50vw', margin: '40px 0'}}>
			<Grid item xs={12} md={6} sx={{position: 'relative', minHeight: '50vw'}}>
				<Image
					src={article.image.full}
					alt={article.title}
					fill
					style={{
						objectFit: 'cover',
						objectPosition: 'center center',
						height: '100%',
						width: '100%'
					}}
				/>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
				sx={{
					backgroundColor: 'rgba(0,0,0,0.1)',
					padding: '5%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'start'
				}}
			>
				<Typography
					sx={{
						margin: 0,
						fontFamily: 'Apercu',
						fontSize: '30px',
						lineHeight: 1.2,
					}}
				>
					{article.categories.map(c => c.name.toUpperCase()).join(' | ')}
				</Typography>
				<Typography
					sx={{
						margin: 0,
						fontFamily: 'Ogg Roman',
						fontSize: '60px',
						lineHeight: 1.2,
					}}
				>
					{article.title}
				</Typography>
				<Typography
					sx={{
						margin: '20px 80px 0 0',
						fontSize: '18x',
						lineHeight: 1.2,
					}}
				>
					{article.excerpt}
				</Typography>
				<div style={{width: '100%', textAlign: 'center', padding: '20px 0'}} >
					<Button>
						{t('read-more')}
					</Button>
				</div>
			</Grid>
		</Grid>
	)
}

export default ArticlePreview;