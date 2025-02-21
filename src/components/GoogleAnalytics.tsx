'use client'

import { GoogleTagManager } from '@next/third-parties/google';
import { useEffect } from "react";
import Cookies from "js-cookie";
import { openCookiesDrawer } from "../redux/layoutSlice";
import { getLocalStorage, setLocalStorage } from "../utils/storage-helper";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {usePathname, useSearchParams} from "next/navigation";

const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string;

export const getConsent = (consent: boolean) => consent ? 'granted' : 'denied';

const DEFAULT_SETTINGS = {
	analytics: false,
	profiling: false,
	usage: false,
	storage: false
};

export default function GoogleAnalytics() {
	const dispatch = useDispatch<AppDispatch>();
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useEffect(() => {
		const savedCookieSettings = getLocalStorage("cookie_consent", undefined);
		if (!savedCookieSettings) {
			setLocalStorage('cookie_consent', DEFAULT_SETTINGS);
		}
		const cookieSettings = savedCookieSettings ?? DEFAULT_SETTINGS;

		// Delay GTM initialization by 10 seconds
		const timer = setTimeout(() => {
			window.gtag?.("consent", 'update', {
				ad_user_data: getConsent(cookieSettings.usage),
				ad_personalization: getConsent(cookieSettings.profiling),
				ad_storage: getConsent(cookieSettings.storage),
				analytics_storage: getConsent(cookieSettings.analytics),
			});
		}, 1000);

		const cookiesSeen = Cookies.get('is_cookies_seen');
		if (!cookiesSeen) {
			dispatch(openCookiesDrawer());
		}

		// Cleanup function to prevent memory leaks
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const url = pathname + searchParams.toString();

		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('config', TAG_MANAGER_ID, {
				page_path: url,
			});
		}
	}, [pathname, searchParams]);

	if (!TAG_MANAGER_ID) return null;

	return (
		<GoogleTagManager gtmId={TAG_MANAGER_ID} />
	);
}