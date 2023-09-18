import {Article} from "../../types/woocommerce";
import ArticleCardMini from "../../components/ArticleCardMini";
import ArticleCard from "../../components/ArticleCard";
import {Typography} from "@mui/material";
import Chip from "../../components/Chip";
import NewsletterForm from "../../components/NewsletterForm";
import {useTranslation} from "react-i18next";
import {ReactNode} from "react";
import SocialShare from "../product/SocialShare";
import {useRouter} from "next/router";

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
	const router = useRouter()
	return (
		<div>
			{postsByCategory.map(({type, posts, id}) => {
				const [ latestArticle, ...otherArticles ] = posts
				return (
					<Section key={type} title={type}>
						<ArticleCard article={latestArticle} isVertical isSidebar />
						{otherArticles.map(post => (
							<ArticleCardMini key={post.id} article={post} />
						))}
					</Section>
				)
			})}
			{tags.length > 0 && (
				<Section title={'Tags'}>
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
				</Section>
			)}
			<Section title={"Share"}>
				<SocialShare
					facebookUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/${router.asPath}`}
					emailUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/${router.asPath}`}
					twitterUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/${router.asPath}`}
					telegramUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/${router.asPath}`}
					whatsappUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/${router.asPath}`}
				/>
			</Section>
			<Section title={'Newsletter'}>
				<Typography sx={{margin: '25px 0'}}>
					{t('newsletter.body')}
				</Typography>
				<NewsletterForm/>
			</Section>
		</div>
	)
}

const Section = ({children, title}: {children: ReactNode, title: string}) => (
	<div style={{padding: '10px 0'}}>
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
			{title}
		</Typography>
		{children}
	</div>
)

export default ArticleSidebar