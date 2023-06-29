import {Box} from '@mui/material';
import {ListArticle} from "../../types/woocommerce";
import ArticleCard from "../../components/ArticleCard";
import SectionTitle from "../../components/SectionTitle";

type FeaturedArticlesProps = {
	title: string
	articles: ListArticle[]
}
const FeaturedArticles = ({articles, title}: FeaturedArticlesProps) => {
	return (
		<Box sx={{
			width: '100%',
			boxSizing: 'border-box',
			m: 0,
			p: 0,
			gap: '20px',
			display: { xs: 'flex', md: 'grid' },
			flexDirection: 'column',
			gridTemplateColumns: { md: '1fr 2fr 1fr' },
			gridAutoFlow: { md: 'dense' },
			marginTop: '30px',
		}}>
			<SectionTitle title={title} />
			<Box sx={{gridColumn: { md: 2 } }}>
				<ArticleCard article={articles[0]} isVertical />
			</Box>
			<Box sx={{gridColumn: { md: 1 }, display: { xs: 'grid', md: 'flex'}, gap: '20px 0', flexDirection: 'column' }}>
				<ArticleCard article={articles[1]} />
				<ArticleCard article={articles[2]} />
			</Box>
			<Box sx={{gridColumn: { md: 3 }, display: { xs: 'grid', md: 'flex'}, gap: '20px 0', flexDirection: 'column' }}>
				<ArticleCard article={articles[3]} />
				<ArticleCard article={articles[4]} />
			</Box>
		</Box>
	);
}



export default FeaturedArticles;
