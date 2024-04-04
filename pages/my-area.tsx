import {PageBaseProps} from "../src/types/settings";
import {
	getLayoutProps,
	getPageProps,
} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import MyArea from "../src/pages/my-area/MyArea";
import {getShippingInfo} from "./api/shipping";
import {Country} from "../src/types/woocommerce";
import AuthContent from "../src/components/AuthContent";

export type MyAreaPageProps = PageBaseProps & { countries: Country[] }

export default function MyAreaPage({layout, countries}: MyAreaPageProps) {
	return (
		<Layout layout={layout}>
			<AuthContent>
				<MyArea countries={countries} />
			</AuthContent>
		</Layout>
	)
}

export async function getStaticProps({ locale }: { locale: 'it' | 'en'}) {
	const [
		{ ssrTranslations, ...layoutProps},
		{ countries },
		{ seo, page }
	] = await Promise.all([
		getLayoutProps(locale),
		getShippingInfo(locale),
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
			countries,
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