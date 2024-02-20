import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";

import useAuth from "../utils/useAuth";
import Loading from "./Loading";

export default function AuthContent({ children }: { children: ReactNode }) {
	const { loggedIn, loading } = useAuth();
	const router = useRouter();

	// Navigate unauthenticated users to Log In page.
	useEffect(() => {
		if (!loading && !loggedIn) {
			router.push('/my-area');
		}
	}, [loggedIn, loading, router]);

	if (loggedIn) {
		return <>{children}</>;
	}

	return <Loading />;
}