import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { DefaultAttribute} from "../types/woocommerce";

type CartItem = {
	id: number
	name: string
	image: string
	price: number
	qty: number
	attributes: DefaultAttribute[]
	stock_quantity: number
}

type CartState = {
	items: CartItem[]
}

const initialState: CartState = {
	items: [],
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		initCart: (state, action) => {
			state = JSON.parse( localStorage.getItem( 'bdg-cart' ) || '{ "items": [] }' )
			return state
		},
		addCartItem: (state, { payload }: PayloadAction<CartItem>) => {
			const i = state.items.findIndex((_element: CartItem) => _element.id === payload.id)
			if (i > -1) state.items[i].qty = state.items[i].qty + 1
			else state.items.push(payload)
			localStorage.setItem('bdg-cart', JSON.stringify(state))
		},
		updateCartItem: (state, { payload }: PayloadAction<{ id: number, qty: number }>) => {
			const i = state.items.findIndex((_element: CartItem) => _element.id === payload.id)
			if (i > -1) state.items[i].qty = payload.qty
			localStorage.setItem('bdg-cart', JSON.stringify(state))
		},
		deleteCartItem: (state, { payload }: PayloadAction<number>) => {
			state.items = state.items.filter((item: CartItem) => item.id !== payload)
			localStorage.setItem('bdg-cart', JSON.stringify(state))
		},
		destroyCart: (state) => {
			localStorage.setItem('bdg-cart', JSON.stringify(initialState))
			return initialState
		},
	},
})

// Action creators are generated for each case reducer function
export const { initCart, addCartItem, updateCartItem, deleteCartItem, destroyCart } = cartSlice.actions

export default cartSlice.reducer