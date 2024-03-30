import { useEffect, ReactNode } from "react";
import useAuth from "../utils/useAuth";
import Loading from "./Loading";
import {useDispatch, useSelector} from "react-redux";
import {openLogInDrawer} from "../redux/layoutSlice";
import {Box} from "@mui/system";
import {RootState} from "../redux/store";

export default function AuthContent({ children }: { children: ReactNode }) {
	const { loggedIn, loading } = useAuth();
	const { logInDrawerOpen, signUpDrawerOpen } = useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch();
	// Navigate unauthenticated users to Log In page.
	useEffect(() => {
		if (!loading && !loggedIn) {
			dispatch(openLogInDrawer())
		}
	}, [loggedIn, loading, dispatch]);

	if (loggedIn) {
		return <>{children}</>;
	}

	return (
		<Box sx={{width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			{(signUpDrawerOpen || logInDrawerOpen || loading) ? <Loading /> : (
				<div style={{textAlign: 'center'}}>
					<Box sx={{fontSize: '100px', fontWeight: 700}}>
						401
					</Box>
					<Box sx={{fontSize: '20px', color: 'text.secondary'}}>
						Autorizzazione richiesta
					</Box>
				</div>
			)}
		</Box>
	)
}