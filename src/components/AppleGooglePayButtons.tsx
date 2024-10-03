import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import axios from "axios";
import {AddItemToCartPayload, getCoCartAxiosParams} from "../redux/cartSlice";
import {Cart} from "../types/cart-type";
import {ShippingData} from "../redux/layoutSlice";
import {InvoiceData} from "../types/woocommerce";
import GooglePayButton from "./GooglePayButton";
import ApplePayButton from "./ApplePayButton";
import {Grid2} from "@mui/material";
import useAuth from "../utils/useAuth";

type GooglePayButtonProps = {
	item?: AddItemToCartPayload;
	shipping: ShippingData
	customerNote?: string
	invoice?: InvoiceData
	hideGooglePay?: boolean
	hideApplePay?: boolean
}

export type PaymentButtonProps = {
	cart: Cart;
	askForShipping: boolean;
	shipping: ShippingData
	customerNote?: string
	invoice?: InvoiceData
}

const AppleGooglePayButtons = ({item, hideApplePay, hideGooglePay, ...props}: GooglePayButtonProps) => {
	const { cart } = useSelector((state: RootState) => state.cart);
	const [checkoutCart, setCheckoutCart] = useState<Cart>();

	useEffect(() => {
		const setItemCheckoutCart = async () => {
			if (!item) {
				setCheckoutCart(cart)
				return
			}
			const { cart_key } = await callCart(undefined, `/v2/cart/add-item`, 'POST', undefined, item);
			await callCart(cart_key, '/v2/cart/update', "POST", { country: "IT" }, {namespace: 'update-customer'});

			setCheckoutCart(await callCart(cart_key))
		}
		setItemCheckoutCart().then(r => r)
	}, [cart, item]);

	return checkoutCart && (
		<Grid2 container direction="column">
			{!hideGooglePay && <GooglePayButton cart={checkoutCart} askForShipping={!!item} {...props} />}
			{!hideApplePay && <ApplePayButton cart={checkoutCart} askForShipping={!!item} {...props} />}
		</Grid2>
	)
}

export const callCart = async (
	cartKey?: string, url = "/v2/cart",
	method: 'GET' | 'POST' | 'DELETE' = "GET",
	params?: {[key: string]: any},
	payload?: {[key: string]: any},
	singleItemMode = true
): Promise<Cart> => {
	const response = await axios(getCoCartAxiosParams(url, method, params, payload, cartKey, singleItemMode));
	if (!response.data) {
		throw new Error("No data returned from CoCart");
	}
	return response.data;
}

export default AppleGooglePayButtons