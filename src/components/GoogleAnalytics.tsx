'use client';

import { GoogleTagManager, sendGTMEvent } from '@next/third-parties/google'
import {useEffect} from "react";
import {usePathname, useSearchParams} from "next/navigation";

const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

export default function GoogleAnalytics(){
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const params = searchParams.toString()

	useEffect(() => {
		const url = pathname + (params ? ('?' + params) : '');
		sendGTMEvent({ event: 'page_view', value: {
				// page_title: url,
				page_location: url
			}})
	}, [pathname, params]);

	return TAG_MANAGER_ID ? (
		<GoogleTagManager gtmId={TAG_MANAGER_ID} />
	) : null
}