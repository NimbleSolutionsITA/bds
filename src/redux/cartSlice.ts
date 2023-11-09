import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { Cart, Totals} from "../types/cart-type";
import {NEXT_API_ENDPOINT} from "../utils/endpoints";
import {RootState} from "./store";
import {BillingData, ShippingData} from "../types/woocommerce";

type CartState = {
	nonce?: string
	cart: Partial<Cart>
	cartDrawerOpen: boolean
	loading: boolean
	stripe?: {
		intentId: string
		clientSecret: string
	}
	customer?:{
		billing: BillingData
		shipping?: ShippingData
	}
}

const initialState: CartState = {
	loading: false,
	cartDrawerOpen: false,
	cart: {
		items: [],
		totals: {
			subtotal: '0',
			subtotal_tax: '0',
		} as Totals
	},
}

export const fetchCartData = createAsyncThunk('cart/fetchData', async (params, thunkAPI) => {
	return await callCartData('/v2/cart', {}, "GET")
});


export type AddItemToCartPayload = {
	id: string
	quantity: string
	variation?: { [key: string]: string }
	item_data?: object
}

export const addCartItem = createAsyncThunk('cart/addItem', async (payload: AddItemToCartPayload, thunkAPI) => {
	return await callCartData('/v2/cart/add-item', payload, "POST");
});

type UpdateItemInCartPayload = {
	key: string
	quantity: number
}

export const updateCartItem = createAsyncThunk('cart/updateItem', async (payload: UpdateItemInCartPayload, thunkAPI) => {
	return await callCartData('/v2/cart/item/' + payload.key , {
		item_key: payload.key,
		quantity: payload.quantity
	}, "POST");
});

type DeleteItemFromCartPayload = {
	key: string
}

export const deleteCartItem = createAsyncThunk('cart/deleteItem', async (payload: DeleteItemFromCartPayload, thunkAPI) => {
	return await callCartData('/v2/cart/item/' + payload.key, {}, "DELETE");
});

type UpdateShippingCountry = {
	country: string
	state?: string
	city?: string
	postcode?: string
}

export const updateShippingCountry = createAsyncThunk('cart/updateCustomer', async (payload: UpdateShippingCountry, thunkAPI) => {
	await callCartData('/v1/calculate/shipping', payload, "POST");
	return await callCartData('/v2/cart', {}, "GET")
});

type SelectShippingPayload = {
	key: string
}

export const selectShipping = createAsyncThunk('cart/selectShipping', async (payload: SelectShippingPayload, thunkAPI) => {
	await callCartData('/v1/shipping-methods', payload, "POST");
	return await callCartData('/v2/cart', {}, "GET")
});

type SetCouponPayload = {
	code: string
	oldCode?: string
}

export const setCoupon = createAsyncThunk('cart/setCoupon', async (payload: SetCouponPayload, thunkAPI) => {
	await callCartData('/v1/cart/coupon', {coupon: payload.code}, "POST")
	return await callCartData('/v2/cart', {}, "GET")
});

type RemoveCouponPayload = {
	code: string
}

export const removeCoupon = createAsyncThunk('cart/removeCoupon', async (payload: RemoveCouponPayload, thunkAPI) => {
	await callCartData('/v1/cart/coupon', {coupon: payload.code}, "DELETE");
	return await callCartData('/v2/cart', {}, "GET")
});

export const createIntent = createAsyncThunk('cart/createIntent', async (arg, thunkAPI) => {
	const { cart } = thunkAPI.getState() as RootState;
	const total = cart?.cart?.totals?.total;
	if (!total) {
		throw new Error('Cart not found');
	}
	const paymentIntent = await fetch(NEXT_API_ENDPOINT + '/order/stripe-intent', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ amount: total }),
	}).then((r) => r.json());
	if (paymentIntent.error) {
		throw new Error(paymentIntent.error);
	}
	return paymentIntent;
});

export const destroyCart = createAsyncThunk('cart/destroy', async (arg, thunkAPI) => {
	await callCartData('/v2/cart/clear', {}, "DELETE");
	return await callCartData('/v2/cart', {}, "GET")
});

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		toggleCartDrawer: (state) => {
			state.cartDrawerOpen = !state.cartDrawerOpen
		},
		openCartDrawer: (state) => {
			state.cartDrawerOpen = true
		},
		closeCartDrawer: (state) => {
			state.cartDrawerOpen = false
		},
		setCustomerData: (state, action) => {
			state.customer = action.payload
		},
		destroyIntent: (state) => {
			state.stripe = undefined
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCartData.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchCartData.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(fetchCartData.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(addCartItem.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(addCartItem.fulfilled, (state, action) => {
			state.cartDrawerOpen = true
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(addCartItem.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(updateCartItem.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(updateCartItem.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(updateCartItem.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(deleteCartItem.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(deleteCartItem.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(deleteCartItem.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(updateShippingCountry.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(updateShippingCountry.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(updateShippingCountry.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(selectShipping.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(selectShipping.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(selectShipping.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(setCoupon.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(setCoupon.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(setCoupon.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(removeCoupon.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(removeCoupon.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(removeCoupon.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(createIntent.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(createIntent.fulfilled, (state, action) => {
			state.stripe = {
				intentId: action.payload.paymentIntentId,
				clientSecret: action.payload.clientSecret
			}
			state.loading = false;
		});
		builder.addCase(createIntent.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(destroyCart.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(destroyCart.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(destroyCart.rejected, (state) => {
			state.loading = false;
		});
	},
})

// Action creators are generated for each case reducer function
export const {
	toggleCartDrawer,
	openCartDrawer,
	closeCartDrawer,
	setCustomerData,
	destroyIntent
} = cartSlice.actions

export default cartSlice.reducer

export const callCartData = async (url: string, payload = {}, method: 'GET'|'POST'|'DELETE'): Promise<Cart> => {
	try {
		const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL + '/wp-json/cocart' + url, {
			method: method,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': ''
			},
			...(method === "POST" && {body: JSON.stringify(payload)})
		});
		if (!response.ok) {
			throw new Error('Failed to add cart item');
		}
		return await response.json();
	} catch (error) {
		console.log(error)
		throw error;
	}
}