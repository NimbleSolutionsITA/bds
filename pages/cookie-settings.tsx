import {PageBaseProps} from "../src/types/settings";
import {getLayoutProps} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import CookieSettings from "../src/pages/cookie-settings/CookieSettings";


export type GenericPageProps = PageBaseProps
export default function CookieSettingsPage({layout}: GenericPageProps) {
	return (
		<Layout layout={layout}>
			<CookieSettings />
		</Layout>
	)
}

export async function getStaticProps({ locale}: { locale: 'it' | 'en'}) {
	// @ts-ignore
	const [
		{ssrTranslations, ...layoutProps},
	] = await Promise.all([
		getLayoutProps(locale),
	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			layout: {
				...layoutProps,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'Preferenze Cookie', href: urlPrefix + '/cookie-settings' },
				]
			},
			...ssrTranslations
		},
	}
}