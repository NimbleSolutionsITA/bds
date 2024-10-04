import {Container} from "@mui/material";
import {PageBaseProps} from "../src/types/settings";
import {getPageProps} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import SetPasswordForm from "../src/pages/my-area/SetPasswordForm";
import {useRouter} from "next/router";
import {LOCALE} from "../src/utils/utils";
import {cacheGetLayoutProps} from "../src/utils/cache";


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

export async function getStaticProps({ locale}: { locale: LOCALE}) {
	const [
		{ ssrTranslations, ...layoutProps},
		{ seo, page }
	] = await Promise.all([
		cacheGetLayoutProps(locale),
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