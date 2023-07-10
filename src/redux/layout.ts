import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type LayoutState = {
	newsletterDrawerOpen: boolean
	cookiesDrawerOpen: boolean
	cookiesSavedDrawerOpen: boolean
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
	cookiesSavedDrawerOpen: false,
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
		openCookiesSavedDrawer: (state) => {
			state.cookiesSavedDrawerOpen = true
		},
		closeCookiesSavedDrawer: (state) => {
			state.cookiesSavedDrawerOpen = false
		},
		openNewsletterDrawer: (state) => {
			state.newsletterDrawerOpen = true
		},
		closeNewsletterDrawer: (state) => {
			state.newsletterDrawerOpen = false
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
	openCookiesSavedDrawer,
	closeCookiesSavedDrawer,
	openNewsletterDrawer,
	closeNewsletterDrawer,
	openInStockNotifierDrawer,
	closeInStockNotifierDrawer,
} = layoutSlice.actions

export default layoutSlice.reducer