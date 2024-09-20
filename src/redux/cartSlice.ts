import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { Cart } from "../types/cart-type";
import {WORDPRESS_SITE_URL} from "../utils/endpoints";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {gtagAddToCart} from "../utils/utils";

type CoCartError = {error: string, message: string}

type CartState = {
	error: CoCartError|null
	cart?: Cart
	cartDrawerOpen: boolean
	loading: boolean
	customerNote: string
}

const initialState: CartState = {
	error: null,
	loading: false,
	cartDrawerOpen: false,
	customerNote: ""
}

export const fetchCartData = createAsyncThunk('cart/fetchData', async (params, thunkAPI) => {
	try {
		return await callCartData('/v2/cart', "GET")
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});


export type AddItemToCartPayload = {
	id: string
	quantity: string
	variation?: { [key: string]: string }
	item_data?: object
}

export const addCartItem = createAsyncThunk('cart/addItem', async (payload: AddItemToCartPayload, thunkAPI) => {
	try {
		const cart = await callCartData('/v2/cart/add-item', "POST", payload);
		const item = cart.items.find((item) => item.id === Number(payload.id))
		if (item) {
			const productId = item.meta?.product_type === 'variation' ? item.meta.variation.parent_id : item.id
			const variantId = item.meta?.product_type === 'variation' ? item.id : ''
			gtagAddToCart(item, productId, variantId)
		}

		return cart
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});

type UpdateItemInCartPayload = {
	key: string
	quantity: number
}

export const updateCartItem = createAsyncThunk('cart/updateItem', async (payload: UpdateItemInCartPayload, thunkAPI) => {
	try {
		return await callCartData('/v2/cart/item/' + payload.key, "POST", {
			item_key: payload.key,
			quantity: payload.quantity.toString()
		});
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});

type DeleteItemFromCartPayload = {
	key: string
}

export const deleteCartItem = createAsyncThunk('cart/deleteItem', async (payload: DeleteItemFromCartPayload, thunkAPI) => {
	try {
		return await callCartData('/v2/cart/item/' + payload.key, "DELETE");
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});

type UpdateCartCustomer = {
	first_name?: string,
	last_name?: string,
	email?: string,
	phone?: string,
	company?: string,
	address_1?: string,
	address_2?: string,
	city?: string,
	state?: string,
	country?: string,
	postcode?: string,
	s_first_name?: string,
	s_last_name?: string,
	s_address_1?: string,
	s_city?: string,
	s_state?: string,
	s_postcode?: string,
	s_country?: string,
	s_company?: string,
	ship_to_different_address?: boolean
}

export const updateCartCustomer = createAsyncThunk('cart/updateCartCustomer', async (payload: UpdateCartCustomer, thunkAPI) => {
	try {
		return await callCartData('/v2/cart/update', "POST", payload, {namespace: 'update-customer'});
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});

type SelectShippingPayload = {
	key: string
}

export const selectShipping = createAsyncThunk('cart/selectShipping', async (payload: SelectShippingPayload, thunkAPI) => {
	try {
		await callCartData('/v1/shipping-methods', "POST", payload);
		return await callCartData('/v2/cart', "GET")
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});

type SetCouponPayload = {
	code: string
}

export const setCoupon = createAsyncThunk('cart/setCoupon', async (payload: SetCouponPayload, thunkAPI) => {
	try {
		await callCartData('/v2/cart/apply-coupon', "POST", {code: payload.code})
		return await callCartData('/v2/cart', "GET")
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});

type RemoveCouponPayload = {
	code: string
}

export const removeCoupon = createAsyncThunk('cart/removeCoupon', async (payload: RemoveCouponPayload, thunkAPI) => {
	try {
		await callCartData(`/v2/cart/coupons`, "DELETE");
		return await callCartData('/v2/cart', "GET")
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});

export const initCart = createAsyncThunk('cart/initCart', async (payload, thunkAPI) => {
	try {
		return await initCartData()
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
});

export const destroyCart = createAsyncThunk('cart/destroy', async (arg, thunkAPI) => {
	try {
		await callCartData('/v2/cart/clear', "POST");
		return await callCartData('/v2/cart', "GET")
	} catch (error: any) {
		return thunkAPI.rejectWithValue({
			error: error?.response?.data?.code ?? error?.code ?? 'generic_error',
			message: error?.response?.data?.message ?? error?.message ?? 'generic error',
		})
	}
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
		resetCartError: (state) => {
			state.error = null
		},
		setCustomerNote: (state, action) => {
			state.customerNote = action.payload
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
		builder.addCase(fetchCartData.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
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
		builder.addCase(addCartItem.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
		builder.addCase(updateCartCustomer.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(updateCartCustomer.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(updateCartCustomer.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
		builder.addCase(updateCartItem.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(updateCartItem.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(updateCartItem.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
		builder.addCase(deleteCartItem.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(deleteCartItem.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(deleteCartItem.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
		builder.addCase(selectShipping.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(selectShipping.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(selectShipping.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
		builder.addCase(setCoupon.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(setCoupon.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(setCoupon.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
		builder.addCase(removeCoupon.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(removeCoupon.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(removeCoupon.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
		builder.addCase(initCart.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(initCart.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(initCart.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
		builder.addCase(destroyCart.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(destroyCart.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(destroyCart.rejected, (state, {payload}) => {
			state.error = payload as CoCartError
			state.loading = false;
		});
	},
})

// Action creators are generated for each case reducer function
export const {
	toggleCartDrawer,
	openCartDrawer,
	closeCartDrawer,
	resetCartError,
	setCustomerNote
} = cartSlice.actions

export default cartSlice.reducer

const callCartData = async (url: string, method: 'GET' | 'POST' | 'DELETE', payload?: {[key: string]: any}, params?: {[key: string]: any} ): Promise<Cart> => {
	// get cart key from local storage
	const cartKey = localStorage.getItem('cart_key') ?? undefined;

	const getAxiosParams = (cartKey?: string):  AxiosRequestConfig<{}> => {
		const p = {
			...(cartKey ? { cart_key: cartKey } : {}),
			...params
		}
		const urlParams = new URLSearchParams(p);
		return {
			method: method,
			url: WORDPRESS_SITE_URL + '/wp-json/cocart' + url + (Object.keys(p).length > 0 ? '?' + urlParams.toString() : ''),
			withCredentials: true,
			headers: {
				Accept: 'application/json',
				...(payload ? {'Content-Type': 'application/json'} : {})
			},
			...(payload ? {data: payload} : {}),
			responseEncoding: 'utf8',
			responseType: 'json'
		}
	}

	let response: AxiosResponse<Cart>

	try {
		response = await axios(getAxiosParams(cartKey));
		if (!!response.data?.customer?.billing_address?.billing_email) {
			localStorage.removeItem('cart_key')
		} else if (!!response.data.cart_key) {
			localStorage.setItem('cart_key', response.data.cart_key as string)
		}
	} catch (error) {
		response = await axios(getAxiosParams());
		localStorage.removeItem('cart_key');
	}

	return response.data;
};

const initCartData = async () => {
	let cart = await callCartData('/v2/cart', "GET")
	if (cart.coupons?.length && cart.coupons.length > 0) {
		await callCartData(
			`/v2/cart/coupons`,
			"DELETE",
		);
		cart = await callCartData('/v2/cart', "GET")
	}
	return cart
}