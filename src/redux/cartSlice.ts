import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { DefaultAttribute} from "../types/woocommerce";

export type CartItem = {
	product_id: number
	variation_id?: number
	name: string
	image: string
	price: number
	qty: number
	attributes: DefaultAttribute[]
	stock_quantity: number
	category: string
	slug: string
}

type CartState = {
	cartDrawerOpen?: boolean
	items: CartItem[]
}

const initialState: CartState = {
	items: [],
	cartDrawerOpen: false
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		initCart: (state) => {
			try {
				state.items = JSON.parse(localStorage.getItem( 'bdg-cart' ) ?? '[]' )
			}
			catch {
				state.items = []
			}
			return state
		},
		addCartItem: (state, { payload }: PayloadAction<CartItem>) => {
			const i = state.items.findIndex((_element: CartItem) => _element.product_id === payload.product_id && _element.variation_id === payload.variation_id)
			if (i > -1) state.items[i].qty = state.items[i].qty + 1
			else state.items.push(payload)
			state.cartDrawerOpen = true
			localStorage.setItem('bdg-cart', JSON.stringify(state.items))
		},
		updateCartItem: (state, { payload }: PayloadAction<{ product_id: number, variation_id?: number, qty: number }>) => {
			const i = state.items.findIndex((_element: CartItem) => _element.product_id === payload.product_id && _element.variation_id === payload.variation_id)
			if (i > -1) {
				if (payload.qty === 0) {
					state.items = state.items.filter((item: CartItem) => item.product_id !== payload.product_id && item.variation_id !== payload.variation_id)
				} else {
					state.items[i].qty = payload.qty
				}
			}
			localStorage.setItem('bdg-cart', JSON.stringify(state.items))
		},
		deleteCartItem: (state, { payload }: PayloadAction<{ product_id: number, variation_id?: number }>) => {
			state.items = state.items.filter((item: CartItem) => item.product_id !== payload.product_id && item.variation_id !== payload.variation_id)
			localStorage.setItem('bdg-cart', JSON.stringify(state.items))
		},
		destroyCart: () => {
			localStorage.setItem('bdg-cart', JSON.stringify([]))
			return initialState
		},
		toggleCartDrawer: (state) => {
			state.cartDrawerOpen = !state.cartDrawerOpen
		},
		openCartDrawer: (state) => {
			state.cartDrawerOpen = true
		},
		closeCartDrawer: (state) => {
			state.cartDrawerOpen = false
		},
	},
})

// Action creators are generated for each case reducer function
export const {
	initCart,
	addCartItem,
	updateCartItem,
	deleteCartItem,
	destroyCart,
	toggleCartDrawer,
	openCartDrawer,
	closeCartDrawer,
} = cartSlice.actions

export default cartSlice.reducer