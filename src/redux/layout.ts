import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type LayoutState = {
	newsletterDrawerOpen: boolean
	cookiesDrawerOpen: boolean
	searchDrawerOpen: boolean
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
}

const initialState: LayoutState = {
	newsletterDrawerOpen: false,
	cookiesDrawerOpen: false,
	searchDrawerOpen: false,
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
		closeSearchDrawer: (state) => {
			state.searchDrawerOpen = false
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
		setPageState: (state, { payload }: PayloadAction<{ route: string, scroll: number, state: any }>) => {
			const index = state.pageStates?.findIndex(pageState => pageState.route === payload.route) ?? -1
			if (index !== -1) {
				state.pageStates![index] = payload
			} else {
				state.pageStates = state.pageStates ? [...state.pageStates, payload] : [payload]
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
	setPageState,
} = layoutSlice.actions

export default layoutSlice.reducer