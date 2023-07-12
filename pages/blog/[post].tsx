import {Container} from "@mui/material";
import {PageBaseProps} from "../../src/types/settings";
import {getAllPostIds, getLayoutProps, getPosts, getSeo} from "../../src/utils/wordpress_api";
import Layout from "../../src/layout/Layout";
import HtmlBlock from "../../src/components/HtmlBlock";
import {Article} from "../../src/types/woocommerce";

export type GenericPageProps = PageBaseProps & {
    post: Article
}

export default function BlogPage({post, layout}: GenericPageProps) {
    return (
        <Layout layout={layout}>
            <Container>
                <HtmlBlock sx={{width: '100%', overflowX: 'hidden'}} html={post.content} />
            </Container>
        </Layout>
    )
}

export async function getStaticProps({ locale, params: { post: slug } }: { locale: 'it' | 'en', params: {post: string}}) {
    const [
        layoutProps,
        {posts: [post]}
    ] = await Promise.all([
        getLayoutProps(locale),
        getPosts(locale, undefined, undefined, slug)
    ]);

    if (!post)
        return { notFound: true };

    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    const seo = await getSeo(post.link);
    return post ? {
        props: {
            post,
            layout: {
                seo,
                ...layoutProps,
                breadcrumbs: [
                    { name: 'Home', href: urlPrefix + '/' },
                    { name: 'Dentro Diaries', href: urlPrefix + '/blog' },
                    { name: post.title, href: urlPrefix + '/blog/' + post.slug },
                ]
            }
        },
        revalidate: 10
    } : {
        notFound: true,
    }
}

export async function getStaticPaths() {
    const paths = await getAllPostIds();
    return {
        paths,
        fallback: 'blocking',
    };
}