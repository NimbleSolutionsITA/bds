import {Container, Grid2 as Grid} from "@mui/material";
import {PageBaseProps} from "../../src/types/settings";
import {getAllPostIds, getSeo} from "../../src/utils/wordpress_api";
import Layout from "../../src/layout/Layout";
import {Article, BaseProduct} from "../../src/types/woocommerce";
import ArticleSidebar from "../../src/pages/dentro-diaries/ArticleSidebar";
import {LOCALE} from "../../src/utils/utils";
import {cacheGetLayoutProps, cacheGetPostAttributes, cacheGetPosts} from "../../src/utils/cache";
import ArticleContent from "../../src/components/ArticleContent";

export type Shortcode = {
    shortcode: string,
    products: BaseProduct[]
}

export type AcfArticle = Article & { acf: { shortcodes: Shortcode[] } }

export type GenericPageProps = PageBaseProps & {
    post: AcfArticle
    postsByCategory: {
        type: string
        id: number
        posts: Article[]
    }[]

}

export default function BlogPage({post, postsByCategory, layout}: GenericPageProps) {
    return (
        <Layout layout={layout}>
            <Container>
                <Grid container spacing={5}>
                    <Grid size={{xs: 12, md: 9}}>
                        <ArticleContent article={post} />
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <ArticleSidebar postsByCategory={postsByCategory} tags={post.tags} />
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    )
}

export async function getStaticProps({ locale, params: { post: slug } }: { locale: LOCALE, params: {post: string}}) {
    const [
        {ssrTranslations, ...layoutProps},
        {posts: [post]},
        {  categories },
    ] = await Promise.all([
        cacheGetLayoutProps(locale),
        cacheGetPosts(locale, 1, 1, slug),
        cacheGetPostAttributes(locale)
    ]);

    if (!post)
        return { notFound: true };
    const postsByCategory = (await Promise.all(categories.map(category =>
        cacheGetPosts(locale, 1, 4, undefined, [category.id])
    ))).map(({posts}, index) => ({
        type: categories[index].name,
        id: categories[index].id,
        posts
    }));

    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    const seo = await getSeo(post.link);
    return post ? {
        props: {
            post,
            postsByCategory,
            layout: {
                seo,
                ...layoutProps,
                breadcrumbs: [
                    { name: 'Home', href: urlPrefix + '/' },
                    { name: 'Dentro Diaries', href: urlPrefix + '/blog' },
                    { name: post.title, href: urlPrefix + '/blog/' + post.slug },
                ]
            },
            ...ssrTranslations
        },
        revalidate: 10
    } : {
        notFound: true,
    }
}

export async function getStaticPaths() {
    const paths = await getAllPostIds();
    return {
        paths: process.env.DISABLE_DYNAMIC_BUILD ? [] : paths,
        fallback: 'blocking',
    };
}