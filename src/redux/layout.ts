import {createSlice} from '@reduxjs/toolkit'

const initialState = {
	newsletterDrawerOpen: false
}

export const layoutSlice = createSlice({
	name: 'layout',
	initialState,
	reducers: {
		toggleNewsletterDrawer: (state) => {
			state.newsletterDrawerOpen = !state.newsletterDrawerOpen
		},
		openNewsletterDrawer: (state) => {
			state.newsletterDrawerOpen = true
		},
		closeNewsletterDrawer: (state) => {
			state.newsletterDrawerOpen = false
		},
	},
})

// Action creators are generated for each case reducer function
export const {
	toggleNewsletterDrawer,
	openNewsletterDrawer,
	closeNewsletterDrawer,
} = layoutSlice.actions

export default layoutSlice.reducer