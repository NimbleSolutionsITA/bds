import {Container} from "@mui/material";
import {BreadCrumb, Menus} from "../src/types/settings";
import {GooglePlaces} from "./api/google-places";
import {getAllPagesIds, getPageProps} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import {Page} from "../src/types/woocommerce";
import HtmlBlock from "../src/components/HtmlBlock";

export type GenericPageProps = {
    menus: Menus,
    googlePlaces: GooglePlaces
    seo: string
    page: Page
    breadcrumbs?: BreadCrumb[],
}

export default function GenericPage({page, menus, googlePlaces, seo, breadcrumbs}: GenericPageProps) {
    return (
        <Layout menus={menus} googlePlaces={googlePlaces} seo={seo} breadcrumbs={breadcrumbs}>
            <Container>
                <HtmlBlock sx={{width: '100%', overflowX: 'hidden'}} html={page.content} />
            </Container>
        </Layout>
    )
}

export async function getStaticProps({ locale, params: { page: slug } }: { locale: 'it' | 'en', params: {page: string}}) {
    // @ts-ignore
    const [
        { page, seo, menus, googlePlaces }
    ] = await Promise.all([
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
            seo,
            menus,
            googlePlaces,
            breadcrumbs: [
                { name: 'Home', href: urlPrefix + '/' },
                { name: page.title, href: urlPrefix + '/' + page.slug },
            ]
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
