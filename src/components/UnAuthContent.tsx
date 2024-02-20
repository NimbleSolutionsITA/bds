import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";

import useAuth from "../utils/useAuth";
import Loading from "./Loading";

export default function UnAuthContent({ children }: { children: ReactNode }) {
	const { loggedIn, loading } = useAuth();
	const router = useRouter();

	// Navigate authenticated users to Members page.
	useEffect(() => {
		if (!loading && loggedIn) {
			router.push('/my-area/profile');
		}
	}, [loggedIn, loading, router]);

	if (!loggedIn) {
		return <>{children}</>;
	}

	return <Loading />;
}