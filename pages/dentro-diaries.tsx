import {Container} from "@mui/material";
import {PageBaseProps} from "../src/types/settings";
import {getLayoutProps, getPageProps, getPosts, getPostsAttributes, mapListArticle} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import FeaturedArticles from "../src/pages/dentro-diaries/FeaturedArticles";
import {Article, ListArticle} from "../src/types/woocommerce";
import TopBanner from "../src/pages/dentro-diaries/TopBanner";
import NewsletterTopBar from "../src/pages/dentro-diaries/NewsletterTopBar";
import ArticlesRow from "../src/components/ArticlesRow";
import ArticlePreview from "../src/pages/dentro-diaries/ArticlePreview";


export type DentroDiariesProps = PageBaseProps & {
	headerImage: {
		url: string
		width: number
		height: number
		alt: string
	}
	preview: ListArticle|null
	featuredArticles: ListArticle[]
	postsByCategory: {
		type: string
		id: number
		posts: Article[]
	}[],
	title: string
	content: string
}

export default function DentroDiaries({headerImage, featuredArticles, layout, preview, postsByCategory, title, content}: DentroDiariesProps) {
	return (
		<Layout layout={layout}>
			<NewsletterTopBar />
			<Container maxWidth="lg" sx={{marginTop: '20px'}}>
				<TopBanner image={headerImage} title={title} content={content} />
				<FeaturedArticles title="Notizie in evidenza" articles={featuredArticles} />
			</Container>
			{preview && <ArticlePreview article={preview}/>}
			<Container maxWidth="lg" sx={{marginTop: '20px'}}>
				{postsByCategory.map(({type, posts, id}) => (
					<ArticlesRow key={type} postsByCategory={{type, posts, id}} />
				))}
			</Container>
		</Layout>
	)
}

export async function getStaticProps({ locale }: { locale: 'it' | 'en'}) {
	// @ts-ignore
	const [
		layoutProps,
		{ page, seo },
		{  categories },
	] = await Promise.all([
		getLayoutProps(locale),
		getPageProps('dentro-diaries', locale),
		getPostsAttributes(locale)
	]);
	const postsByCategory = (await Promise.all(categories.map(category =>
		getPosts(locale, 1, 4, undefined, [category.id])
	))).map(({posts}, index) => ({
		type: categories[index].name,
		id: categories[index].id,
		posts
	}));
	const urlPrefix = locale === 'it' ? '' : '/' + locale;

	return page ? {
		props: {
			headerImage: {
				url: page.acf.headerImage.url,
				width: page.acf.headerImage.width,
				height: page.acf.headerImage.height,
				alt: page.acf.headerImage.alt,
			},
			preview: page.acf.preview[0] ? mapListArticle(page.acf.preview[0]) : null,
			featuredArticles: [
				mapListArticle(page.acf.featured.middleColumn.post[0]),
				mapListArticle(page.acf.featured.leftColumn.postTopL[0]),
				mapListArticle(page.acf.featured.leftColumn.postBottomL[0]),
				mapListArticle(page.acf.featured.rightColumn.postTopR[0]),
				mapListArticle(page.acf.featured.rightColumn.postBottomR[0]),
			],
			layout: {
				seo,
				...layoutProps,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: page.title, href: urlPrefix + '/' + page.slug },
				]
			},
			postsByCategory,
			title: page.title,
			content: page.content,
		},
		revalidate: 10
	} : {
		notFound: true,
	}
}

