import {Container} from "@mui/material";
import {PageBaseProps} from "../src/types/settings";
import {getAllPagesIds, getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import {Page} from "../src/types/woocommerce";
import HtmlBlock from "../src/components/HtmlBlock";

export type GenericPageProps = PageBaseProps & {
    page: Page
}

export default function GenericPage({page, layout}: GenericPageProps) {
    return (
        <Layout layout={layout}>
            <Container>
                <HtmlBlock sx={{width: '100%', overflowX: 'hidden'}} html={page.content} />
            </Container>
        </Layout>
    )
}

export async function getStaticProps({ locale, params: { page: slug } }: { locale: 'it' | 'en', params: {page: string}}) {
    // @ts-ignore
    const [
        layoutProps,
        { page, seo }
    ] = await Promise.all([
        getLayoutProps(locale),
        getPageProps(slug, locale)
    ]);
    const redirect = REDIRECTS.find(r => r.page === slug)
    if (redirect) {
        return {
            redirect: {
                destination: redirect.destination,
                permanent: true,
                // statusCode: 301
            },
        }
    }
    const urlPrefix = locale === 'it' ? '' : '/' + locale;
    return page ? {
        props: {
            page,
            layout: {
                seo,
                ...layoutProps,
                breadcrumbs: [
                    { name: 'Home', href: urlPrefix + '/' },
                    { name: page.title, href: urlPrefix + '/' + page.slug },
                ]
            }
        },
        revalidate: 10
    } : {
        notFound: true,
    }
}

export async function getStaticPaths() {
    const paths = await getAllPagesIds();
    return {
        paths,
        fallback: 'blocking',
    };
}

const REDIRECTS = [
    {
        page: 'xxx',
        destination: '/xxx',
    }
]
