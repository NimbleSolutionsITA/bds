'use client'

import { GoogleTagManager } from '@next/third-parties/google';
import {useEffect} from "react";
import Cookies from "js-cookie";
import {openCookiesDrawer} from "../redux/layoutSlice";
import {getLocalStorage} from "../utils/storage-helper";
import {gtagConsent} from "../utils/utils";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";

const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string;

export const getConsent = (consent: boolean) => consent ? 'granted' : 'denied'

export default function GoogleAnalytics() {
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		const cookiesSeen = Cookies.get('is_cookies_seen');
		if (!cookiesSeen) {
			// 'firstAccess' cookie doesn't exist. Setting the cookie and opening the CookiesDrawer.
			dispatch(openCookiesDrawer());
		}
		else {
			const cookieSettings = getLocalStorage("cookie_consent", {
				analytics: false,
				profiling: false,
				usage: false,
				storage: false
			})
			console.log(cookieSettings);
			gtagConsent({
				ad_user_data: getConsent(cookieSettings.usage),
				ad_personalization: getConsent(cookieSettings.profiling),
				ad_storage: getConsent(cookieSettings.storage),
				analytics_storage: getConsent(cookieSettings.analytics),
			})
		}
	}, [])


	if (!TAG_MANAGER_ID) return null;

	const dataLayer = {
		event: 'consent',
		consent: {
			ad_user_data: "denied",
			ad_personalization: "denied",
			ad_storage: "denied",
			analytics_storage: "denied"
		},
	};

	return (
		<GoogleTagManager gtmId={TAG_MANAGER_ID} dataLayer={dataLayer} />
	);
}