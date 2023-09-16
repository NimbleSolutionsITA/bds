import {Article} from "../../types/woocommerce";
import ArticleCardMini from "../../components/ArticleCardMini";
import ArticleCard from "../../components/ArticleCard";
import {Typography} from "@mui/material";
import Chip from "../../components/Chip";
import NewsletterForm from "../../components/NewsletterForm";
import {useTranslation} from "react-i18next";

type ArticleSideBarProps = {
	postsByCategory: {
		type: string
		id: number
		posts: Article[]
	}[],
	tags: Article['tags']
}
const ArticleSidebar = ({postsByCategory, tags}: ArticleSideBarProps) => {
	const { t } = useTranslation('common');
	return (
		<div>
			{postsByCategory.map(({type, posts, id}) => {
				const [ latestArticle, ...otherArticles ] = posts
				return (
					<div key={type}>
						<SectionTitle text={type} />
						<ArticleCard article={latestArticle} isVertical isSidebar />
						{otherArticles.map(post => (
							<ArticleCardMini key={post.id} article={post} />
						))}
					</div>
				)
			})}
			{tags.length > 0 && (
				<div style={{padding: '10px 0'}}>
					<SectionTitle text={'Tags'} />
					<div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
						{tags.map(tag => (
							<Chip
								key={tag.slug}
								tag={{name: tag.name}}
								onClick={() => {}}
								isActive={false}
							/>
						))}
					</div>
				</div>
			)}
			<div style={{padding: '10px 0'}}>
				<SectionTitle text={'Newsletter'} />
				<Typography sx={{margin: '25px 0'}}>
					{t('newsletter.body')}
				</Typography>
				<NewsletterForm/>
			</div>
		</div>
	)
}

const SectionTitle = ({text}: {text: string}) => (
	<Typography
		variant="h4"
		sx={{
			textTransform: 'uppercase',
			marginBottom: '10px',
			paddingBottom: '5px',
			borderBottom: '1px solid #000',
			fontWeight: 500
		}}
	>
		{text}
	</Typography>
)

export default ArticleSidebar