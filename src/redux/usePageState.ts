import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store";
import {setPageState} from "./layoutSlice"
import {useEffect} from "react";

const usePageState = (initialState: any) => {
	const { pathname } = useRouter();
	const dispatch = useDispatch();
	const { pageStates } = useSelector((state: RootState) => state.layout);
	const pageState = pageStates?.find((pageState) => pageState.route === pathname) ?? {
		state: initialState,
		route: pathname,
		scroll: 0
	};
	const setState = (state: any) => dispatch(setPageState({...pageState, state: { ...pageState.state, ...state}}))
	const setScroll = (scroll: number) => dispatch(setPageState({...pageState, scroll}))

	useEffect(() => {
		if (pageState.scroll) {
			setTimeout(() => {
				window.scrollTo(0, pageState.scroll);
			}, (10));
		}
		// add scroll event listener
		const handleScroll = () => {
			setScroll(window.scrollY);
		}
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		}
	}, []);

	return { ...pageState.state, setState }
}

export default usePageState;