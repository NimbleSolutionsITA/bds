'use client';

import Script from 'next/script'
import {useEffect} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import {pageview} from "../utils/utils";

export default function GoogleAnalytics({GA_MEASUREMENT_ID} : {GA_MEASUREMENT_ID : string}){
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const params = searchParams.toString()

	useEffect(() => {
		const url = pathname + (params ? ('?' + params) : '');
		pageview(GA_MEASUREMENT_ID, url);
	}, [pathname, params, GA_MEASUREMENT_ID]);

	return (
		<>
			<Script strategy="afterInteractive"
			        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}/>
			<Script id='google-analytics' strategy="afterInteractive"
			        dangerouslySetInnerHTML={{
				        __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                   'ad_user_data': 'denied',
				   'ad_personalization': 'denied',
				   'ad_storage': 'denied',
				   'analytics_storage': 'denied',
				   'wait_for_update': 500,
                });
                
                gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                });
                `,
			        }}
			/>
		</>
	)}