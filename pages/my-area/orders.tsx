import {Container} from "@mui/material";
import {PageBaseProps} from "../../src/types/settings";
import {
	getLayoutProps,
	getPageProps,
} from "../../src/utils/wordpress_api";
import Layout from "../../src/layout/Layout";
import AuthContent from "../../src/components/AuthContent";
import useAuth from "../../src/utils/useAuth";
import MemberLayout from "../../src/pages/my-area/MemberLayout";
import OrderList from "../../src/pages/my-area/OrderList";

export type SignUpPageProps = PageBaseProps

export default function SignUpPage({layout}: SignUpPageProps) {
	const { logOut } = useAuth();
	return (
		<Layout layout={layout}>
			<Container>
				<AuthContent>
					<MemberLayout>
						<OrderList />
					</MemberLayout>
				</AuthContent>
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
					{ name: 'Profile', href: urlPrefix + '/my-area' + '/orders' },
				]
			},
			...ssrTranslations
		},
		revalidate: 10
	}
}