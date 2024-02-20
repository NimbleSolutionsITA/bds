import {Container} from "@mui/material";
import {PageBaseProps} from "../../src/types/settings";
import {
	getLayoutProps,
	getPageProps,
} from "../../src/utils/wordpress_api";
import Layout from "../../src/layout/Layout";
import UnAuthContent from "../../src/components/UnAuthContent";
import LogInForm from "../../src/pages/my-area/LoginForm";

export type MyAreaPageProps = PageBaseProps

export default function MyAreaPage({layout}: MyAreaPageProps) {
	return (
		<Layout layout={layout}>
			<Container maxWidth="sm">
				<UnAuthContent>
					<LogInForm />
				</UnAuthContent>
			</Container>
		</Layout>
	)
}

export async function getStaticProps({ locale }: { locale: 'it' | 'en'}) {
	const [
		{ ssrTranslations, ...layoutProps},
		{ seo, page }
	] = await Promise.all([
		getLayoutProps(locale),
		getPageProps('my-area', locale)
	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;

	if (!page) {
		return {
			notFound: true
		}
	}

	return {
		props: {
			layout: {
				seo,
				...layoutProps,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'My Area', href: urlPrefix + '/my-area' },
				]
			},
			...ssrTranslations
		},
		revalidate: 10
	}
}