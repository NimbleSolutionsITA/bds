import {Container} from "@mui/material";
import {PageBaseProps} from "../../src/types/settings";
import {
	getLayoutProps,
	getPageProps,
} from "../../src/utils/wordpress_api";
import Layout from "../../src/layout/Layout";
import UnAuthContent from "../../src/components/UnAuthContent";
import LogInForm from "../../src/pages/my-area/LoginForm";
import SignUpForm from "../../src/pages/my-area/SignUpForm";

export type SignUpPageProps = PageBaseProps

export default function SignUpPage({layout}: SignUpPageProps) {
	return (
		<Layout layout={layout}>
			<Container maxWidth="sm">
				<UnAuthContent>
					<SignUpForm />
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
					{ name: 'Sign Up', href: urlPrefix + '/sign-up' },
				]
			},
			...ssrTranslations
		},
		revalidate: 10
	}
}