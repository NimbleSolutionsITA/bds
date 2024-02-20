import {Container} from "@mui/material";
import {PageBaseProps} from "../src/types/settings";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import SetPasswordForm from "../src/pages/my-area/SetPasswordForm";
import {useRouter} from "next/router";


export type SetPasswordPageProps = PageBaseProps

export default function SetPasswordPage({layout}: SetPasswordPageProps) {
	const router = useRouter();
	const resetKey = String(router.query.key || '');
	const login = String(router.query.login || '');
	return (
		<Layout layout={layout}>
			<Container maxWidth="sm">
				<SetPasswordForm resetKey={resetKey} login={login} />
			</Container>
		</Layout>
	)
}

export async function getStaticProps({ locale}: { locale: 'it' | 'en'}) {
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
					{ name: 'Set Password', href: urlPrefix + '/set-password' },
				]
			},
			...ssrTranslations
		},
		revalidate: 10
	}
}