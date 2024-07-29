'use client';
import { GoogleTagManager } from '@next/third-parties/google'



const TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string;

export default function GoogleAnalytics(){
	return TAG_MANAGER_ID ? (
		<GoogleTagManager gtmId={TAG_MANAGER_ID} />
	) : null
}