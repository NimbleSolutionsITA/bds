import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type LayoutState = {
	newsletterDrawerOpen: boolean
	cookiesDrawerOpen: boolean
	searchDrawerOpen: boolean
	logInDrawerOpen: boolean
	signUpDrawerOpen: boolean
	inStockNotifierDrawer: {
		open: boolean
		productId: number | null
		variationId?: number | null
		name: string | null
		category?: string | null
		attributes?: string | null
	}
}

const initialState: LayoutState = {
	newsletterDrawerOpen: false,
	cookiesDrawerOpen: false,
	searchDrawerOpen: false,
	logInDrawerOpen: false,
	signUpDrawerOpen: false,
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
		openCookiesDrawer: (state) => {
			state.cookiesDrawerOpen = true
		},
		closeCookiesDrawer: (state) => {
			state.cookiesDrawerOpen = false
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
		closeSearchDrawer: (state) => {
			state.searchDrawerOpen = false
		},
		openNewsletterDrawer: (state) => {
			state.newsletterDrawerOpen = true
		},
		closeNewsletterDrawer: (state) => {
			state.newsletterDrawerOpen = false
		},
		closeLogInDrawer: (state) => {
			state.logInDrawerOpen = false
		},
		closeSignUpDrawer: (state) => {
			state.signUpDrawerOpen = false
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
	},
})

// Action creators are generated for each case reducer function
export const {
	openCookiesDrawer,
	closeCookiesDrawer,
	openNewsletterDrawer,
	closeNewsletterDrawer,
	openInStockNotifierDrawer,
	closeInStockNotifierDrawer,
	openSearchDrawer,
	closeSearchDrawer,
	openLogInDrawer,
	closeLogInDrawer,
	openSignUpDrawer,
	closeSignUpDrawer
} = layoutSlice.actions

export default layoutSlice.reducer