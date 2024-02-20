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
import ProfileForm from "../../src/pages/my-area/ProfileForm";
import AddressesForm from "../../src/pages/my-area/AddressesForm";

export type SignUpPageProps = PageBaseProps

export default function SignUpPage({layout}: SignUpPageProps) {
	const { logOut } = useAuth();
	return (
		<Layout layout={layout}>
			<Container>
				<AuthContent>
					<MemberLayout>
						<AddressesForm />
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
					{ name: 'Profile', href: urlPrefix + '/my-area' + '/addresses' },
				]
			},
			...ssrTranslations
		},
		revalidate: 10
	}
}