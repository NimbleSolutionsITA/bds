import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { Cart, Totals} from "../types/cart-type";
import {NEXT_API_ENDPOINT, WORDPRESS_SITE_URL} from "../utils/endpoints";
import {RootState} from "./store";
import {BillingData, InvoiceData, ShippingData} from "../types/woocommerce";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

type CartState = {
	nonce?: string
	cart: Cart
	cartDrawerOpen: boolean
	loading: boolean
	stripe?: {
		intentId: string
		clientSecret: string
	}
	customer:{
		billing: BillingData
		shipping: ShippingData
		invoice: InvoiceData,
		customerNote: string
	}
}

const defaultAddressValues = {
	first_name: '',
	last_name: '',
	address_1: '',
	address_2: '',
	company: '',
	city: '',
	state: '',
	postcode: ''
}

const initialState: CartState = {
	loading: false,
	cartDrawerOpen: false,
	cart: {
		items: [],
		totals: {
			subtotal: '0',
			subtotal_tax: '0',
		} as Totals,
		customer: {
			shipping_address: {
				shipping_first_name: "",
				shipping_last_name: "",
				shipping_company: "",
				shipping_country: "IT",
				shipping_address_1: "",
				shipping_address_2: "",
				shipping_postcode: "",
				shipping_city: "",
				shipping_state: ""
			},
			billing_address: {
				billing_first_name: "",
				billing_last_name: "",
				billing_company: "",
				billing_country: "IT",
				billing_address_1: "",
				billing_address_2: "",
				billing_postcode: "",
				billing_city: "",
				billing_state: "",
				billing_phone: "",
				billing_email: "",
			}
		}
	},
	customer: {
		customerNote: '',
		billing: {
			email: '',
			phone: '',
			country: 'IT',
			...defaultAddressValues
		},
		shipping: {
			country: 'IT',
			...defaultAddressValues
		},
		invoice: {
			vat: '',
			tax: '',
			sdi: '',
			billingChoice: 'invoice' as const,
			invoiceType: 'private' as const
		},
	}
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
		quantity: payload.quantity.toString()
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
}

export const setCoupon = createAsyncThunk('cart/setCoupon', async (payload: SetCouponPayload, thunkAPI) => {
	const { cart: { customer }} = thunkAPI?.getState() as RootState
	/*const email = customer?.billing.email
	if (!email) {
		throw new Error('Email required')
	}
	const response = await fetch(WORDPRESS_SITE_URL + '/wp-json/nimble/v1/check-coupon-usage?code=' + payload.code + '&email=' + customer?.billing.email)
	const { check } = await response.json()
	if (!check) {
		throw new Error('Coupon not valid for email')
	}*/
	await callCartData('/v1/get-cart/coupon', {coupon: payload.code}, "POST")
	return await callCartData('/v2/cart', {}, "GET")
});

type RemoveCouponPayload = {
	code: string
}

export const removeCoupon = createAsyncThunk('cart/removeCoupon', async (payload: RemoveCouponPayload, thunkAPI) => {
	await callCartData('/v1/get-cart/coupon?coupon=' + payload.code, {}, "DELETE");
	return await callCartData('/v2/cart', {}, "GET")
});

export const initCheckout = createAsyncThunk('cart/initCheckout', async (payload, thunkAPI) => {
	const cart = await initCartData()
	const total = cart.totals?.total;
	if (!total) {
		throw new Error('Cart not found');
	}
	return { cart }
});

export const initStripePayment = createAsyncThunk('cart/initStripePayment', async (payload, thunkAPI) => {
	const { cart: { stripe, cart }} = thunkAPI?.getState() as RootState
	const total = cart.totals?.total;
	if (!total) {
		throw new Error('Cart not found');
	}
	let paymentIntent = {
		paymentIntentId: stripe?.intentId,
		clientSecret: stripe?.clientSecret,
		error: null
	}
	if (paymentIntent.paymentIntentId || paymentIntent.clientSecret) {
		await fetch(NEXT_API_ENDPOINT + '/order/stripe-intent', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ cart, paymentIntentId: paymentIntent.paymentIntentId })
		}).then((r) => r.json());
	}
	else {
		paymentIntent = await fetch(NEXT_API_ENDPOINT + '/order/stripe-intent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ cart })
		}).then((r) => r.json());
		if (paymentIntent.error) {
			throw new Error(paymentIntent.error);
		}
	}
	return { cart, paymentIntent}
});

export const initCart = createAsyncThunk('cart/initCart', async (payload, thunkAPI) => {
	return await initCartData()
});

export const destroyCart = createAsyncThunk('cart/destroy', async (arg, thunkAPI) => {
	await callCartData('/v2/cart/clear', {}, "POST");
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
			state.customer = { ...state.customer, ...action.payload}
		},
		setCustomerNote: (state, action) => {
			state.customer.customerNote = action.payload
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
		builder.addCase(initCheckout.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(initCheckout.fulfilled, (state, action) => {
			state.cart = action.payload.cart
			state.loading = false;
		});
		builder.addCase(initCheckout.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(initStripePayment.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(initStripePayment.fulfilled, (state, action) => {
			state.cart = action.payload.cart
			state.stripe = {
				intentId: action.payload.paymentIntent.paymentIntentId ?? '',
				clientSecret: action.payload.paymentIntent.clientSecret ?? ''
			}
			state.loading = false;
		});
		builder.addCase(initStripePayment.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(initCart.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(initCart.fulfilled, (state, action) => {
			state.cart = action.payload
			state.loading = false;
		});
		builder.addCase(initCart.rejected, (state) => {
			state.loading = false;
		});
		builder.addCase(destroyCart.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(destroyCart.fulfilled, (state, action) => {
			state.cart = action.payload
			state.customer = initialState.customer
			state.stripe = undefined
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
	setCustomerNote,
	destroyIntent
} = cartSlice.actions

export default cartSlice.reducer

const callCartData = async (url: string, payload = {}, method: 'GET' | 'POST' | 'DELETE', params?: {[key: string]: string}): Promise<Cart> => {
	// get cart key from local storage
	const cartKey = localStorage.getItem('cart_key');
	let urlParams = params;
	if (cartKey) {
		urlParams = {
			...params,
			cart_key: cartKey
		}
	}

	const getAxiosParams = (p?: {[key: string]: string}):  AxiosRequestConfig<{}> => ({
		method: method,
		url: WORDPRESS_SITE_URL + '/wp-json/cocart' + url + (p ? '?' + new URLSearchParams(p).toString() : ''),
		withCredentials: true,
		headers: {
			Accept: 'application/json',
			...(payload && method === 'POST' ? {'Content-Type': 'application/json'} : {})
		},
		...(payload && method === 'POST' ? {data: payload} : {}),
		responseEncoding: 'utf8',
		responseType: 'json'
	})

	let response: AxiosResponse<Cart>

	try {
		response = await axios(getAxiosParams(urlParams));
		if (!!response.data?.customer?.billing_address?.billing_email) {
			localStorage.removeItem('cart_key')
		} else if (!!response.data.cart_key) {
			localStorage.setItem('cart_key', response.data.cart_key as string)
		}
	} catch (error) {
		response = await axios(getAxiosParams(params));
		localStorage.removeItem('cart_key');
	}

	return response.data;
};

const initCartData = async () => {
	let cart = await callCartData('/v2/cart', {}, "GET")
	if (cart.coupons?.length && cart.coupons.length > 0) {
		await callCartData(
			'/v1/get-cart/coupon?coupon=',
			{},
			"DELETE",
			{coupon: cart.coupons[0].coupon}
		);
		cart = await callCartData('/v2/cart', {}, "GET")
	}
	return cart
}