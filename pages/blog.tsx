import {Container} from "@mui/material";
import {PageBaseProps} from "../src/types/settings";
import {
	getLayoutProps,
	getPageProps,
	getPosts,
	getPostsAttributes,
	mapAcfImage,
	mapListArticle
} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import FeaturedArticles from "../src/pages/dentro-diaries/FeaturedArticles";
import {AcfImage, Article, ListArticle} from "../src/types/woocommerce";
import TopBanner from "../src/pages/dentro-diaries/TopBanner";
import NewsletterTopBar from "../src/pages/dentro-diaries/NewsletterTopBar";
import ArticlesRow from "../src/components/ArticlesRow";
import ArticlePreview from "../src/pages/dentro-diaries/ArticlePreview";
import {useTranslation} from "next-i18next";


export type DentroDiariesProps = PageBaseProps & {
	headerGallery: AcfImage[]
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

export default function Blog({headerGallery, featuredArticles, layout, preview, postsByCategory, title, content}: DentroDiariesProps) {
	const { t } = useTranslation('common')
	return (
		<Layout layout={layout}>
			<NewsletterTopBar />
			<Container maxWidth="lg" sx={{marginTop: '20px'}}>
				<TopBanner gallery={headerGallery} title={title} content={content} />
				<FeaturedArticles title={t('featured-news')} articles={featuredArticles} />
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
		{ssrTranslations, ...layoutProps},
		{ page, seo },
		{  categories },
	] = await Promise.all([
		getLayoutProps(locale),
		getPageProps('blog', locale),
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
			headerGallery: page.acf.headerGallery.map(mapAcfImage),
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
			...ssrTranslations
		},
		revalidate: 10
	} : {
		notFound: true,
	}
}

