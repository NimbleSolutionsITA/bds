import {PageBaseProps} from "../src/types/settings";
import Layout from "../src/layout/Layout";
import CookieSettings from "../src/pages/cookie-settings/CookieSettings";
import {LOCALE} from "../src/utils/utils";
import {cacheGetLayoutProps} from "../src/utils/cache";


export type GenericPageProps = PageBaseProps
export default function CookieSettingsPage({layout}: GenericPageProps) {
	return (
		<Layout layout={layout}>
			<CookieSettings />
		</Layout>
	)
}

export async function getStaticProps({ locale}: { locale: LOCALE}) {
	// @ts-ignore
	const [
		{ssrTranslations, ...layoutProps},
	] = await Promise.all([
		cacheGetLayoutProps(locale),
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