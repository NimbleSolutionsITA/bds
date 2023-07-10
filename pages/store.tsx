import {Container} from "@mui/material";
import {PageBaseProps} from "../src/types/settings";
import {getLayoutProps, getPageProps} from "../src/utils/wordpress_api";
import Layout from "../src/layout/Layout";
import dynamic from "next/dynamic";

const FullPageSlider = dynamic(() => import("../src/components/FullPageSlider"));
const BannerTop = dynamic(() => import("../src/pages/store/BannerTop"));
const BannerBottom = dynamic(() => import("../src/pages/store/BannerBottom"));
const BannerText = dynamic(() => import("../src/components/BannerText"));
const StaffBanner = dynamic(() => import("../src/pages/store/StaffBanner"));
const BannerContact = dynamic(() => import("../src/pages/store/BannerContact"));


export type StorePageProps = PageBaseProps & {
	acf: StoreACF
}

export default function StorePage({acf, layout}: StorePageProps) {
	return (
		<Layout layout={layout}>
			<FullPageSlider images={acf.slider} />
			<Container>
				<BannerTop data={acf.bannerTop} />
			</Container>
			<BannerText text={acf.bannerText} />
			<Container>
				<BannerBottom data={acf.bannerBottom} />
			</Container>
			<StaffBanner staff={acf.staff} />
			<Container>
				<BannerContact data={acf.contactsBanner} />
			</Container>
		</Layout>
	)
}

export async function getStaticProps({ locale}: { locale: 'it' | 'en'}) {
	const [
		{ ssrTranslations, ...layoutProps},
		{ seo, page: { acf } }
	] = await Promise.all([
		getLayoutProps(locale),
		getPageProps('store', locale)
	]);
	const urlPrefix = locale === 'it' ? '' : '/' + locale;
	return {
		props: {
			acf,
			layout: {
				seo,
				...layoutProps,
				breadcrumbs: [
					{ name: 'Home', href: urlPrefix + '/' },
					{ name: 'Store', href: urlPrefix + '/store' },
				]
			},
			...ssrTranslations
		},
		revalidate: 10
	}
}

interface StoreACF {
	slider: string[]
	bannerTop: BannerTop
	bannerText: string
	bannerBottom: BannerBottom
	staff: Staff[],
	contactsBanner: {
		left: ContactColumn,
		right: ContactColumn
		image: string
	}
}

interface ContactColumn {
	body: string
	cta1: Cta
	cta2: Cta
	cta3: Cta
}

interface BannerTop {
	left: Left
	right: Right
}

interface Left {
	title: string
	body: string
	ctaLeft: Cta
	ctaRight: Cta
}

interface Cta {
	type: string
	value: string
	url: string
	name: string
	title: string
	target: string
}

interface Right {
	image: string
	slider: string[]
}

interface BannerBottom {
	left: Left2
	right: Rigtht
}

interface Left2 {
	slider: string[]
}

interface Rigtht {
	title: string
	subtitle: string
	body: string
	ctaLeft: Cta
	ctaRight: Cta
}

interface Staff {
	name: string
	photo: string
	bio: string
}
