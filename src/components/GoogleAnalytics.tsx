'use client';
import {useEffect} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import {pageview} from "../utils/utils";

const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string;

export default function GoogleAnalytics(){
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const params = searchParams.toString()

	useEffect(() => {
		const url = pathname + (params ? ('?' + params) : '');
		pageview(TAG_MANAGER_ID, url);
	}, [pathname, params, TAG_MANAGER_ID]);

	return TAG_MANAGER_ID ? (
		<noscript>
			<iframe
				src={`https://www.googletagmanager.com/ns.html?id=${TAG_MANAGER_ID}`}
				height="0"
				width="0"
				style={{display: 'none', visibility: 'hidden'}}
			>
			</iframe>
		</noscript>
	) : null
}