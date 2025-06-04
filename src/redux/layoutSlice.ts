import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Country, ShippingClass} from "../types/woocommerce";
import Cookies from "js-cookie";

export type ShippingData = {
	classes: ShippingClass[],
	countries: Country[]
}

type LayoutState = {
	newsletterDrawerOpen: boolean
	cookiesModalOpen: boolean
	searchDrawerOpen: boolean
	logInDrawerOpen: boolean
	signUpDrawerOpen: boolean
	forgotPasswordDrawerOpen: boolean
	inStockNotifierDrawer: {
		open: boolean
		productId: number | null
		variationId?: number | null
		name: string | null
		category?: string | null
		attributes?: string | null
	}
	pageStates?: {
		route: string
		scroll: number
		state: any
	}[]
	shipping?: ShippingData
}

const initialState: LayoutState = {
	newsletterDrawerOpen: false,
	cookiesModalOpen: false,
	searchDrawerOpen: false,
	logInDrawerOpen: false,
	signUpDrawerOpen: false,
	forgotPasswordDrawerOpen: false,
	inStockNotifierDrawer: {
		open: false,
		productId: null,
		variationId: null,
		name: null,
		category: null,
		attributes: null
	}
}

export const layoutSlice = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		openCookiesModal: (state) => {
			state.cookiesModalOpen = true
		},
		closeCookiesModal: (state) => {
			Cookies.set('is_cookies_seen', 'true');
			state.cookiesModalOpen = false
		},
		openSearchDrawer: (state) => {
			state.searchDrawerOpen = true
		},
		openLogInDrawer: (state) => {
			state.logInDrawerOpen = true
		},
		openSignUpDrawer: (state) => {
			state.signUpDrawerOpen = true
		},
		openForgotPasswordDrawer: (state) => {
			state.forgotPasswordDrawerOpen = true
		},
		closeSearchDrawer: (state) => {
			state.searchDrawerOpen = false
		},
		openNewsletterDrawer: (state) => {
			state.newsletterDrawerOpen = true
		},
		closeNewsletterDrawer: (state) => {
			Cookies.set('is_newsletter_seen', 'true');
			state.newsletterDrawerOpen = false
		},
		closeLogInDrawer: (state) => {
			state.logInDrawerOpen = false
		},
		closeSignUpDrawer: (state) => {
			state.signUpDrawerOpen = false
		},
		closeForgotPasswordDrawer: (state) => {
			state.forgotPasswordDrawerOpen = false
		},
		openInStockNotifierDrawer: (state, { payload }: PayloadAction<{ name: string, productId: number, category?: string, attributes?: string, variationId?: number }>) => {
			state.inStockNotifierDrawer = {
				open: true,
				...payload
			}
		},
		closeInStockNotifierDrawer: (state) => {
			state.inStockNotifierDrawer = {
				open: false,
				productId: null,
				variationId: null,
				name: null,
				category: null,
				attributes: null
			}
		},
		setPageState: (state, { payload }: PayloadAction<{ route: string, scroll: number, state: any }>) => {
			const index = state.pageStates?.findIndex(pageState => pageState.route === payload.route) ?? -1
			if (index !== -1) {
				state.pageStates![index] = payload
			} else {
				state.pageStates = state.pageStates ? [...state.pageStates, payload] : [payload]
			}
		},
		setShippingData: (state, { payload }: PayloadAction<ShippingData>) => {
			state.shipping = payload
		},
	},
})

// Action creators are generated for each case reducer function
export const {
	openCookiesModal,
	closeCookiesModal,
	openNewsletterDrawer,
	closeNewsletterDrawer,
	openInStockNotifierDrawer,
	closeInStockNotifierDrawer,
	openSearchDrawer,
	closeSearchDrawer,
	setPageState,
	openLogInDrawer,
	closeLogInDrawer,
	openSignUpDrawer,
	closeSignUpDrawer,
	openForgotPasswordDrawer,
	closeForgotPasswordDrawer,
	setShippingData
} = layoutSlice.actions

export default layoutSlice.reducer