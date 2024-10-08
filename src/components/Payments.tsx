import AmericanExpress from "../icons/AmericanExpress";
import ApplePay from "../icons/ApplePay";
import GooglePay from "../icons/GooglePay";
import Maestro from "../icons/Maestro";
import Mastercard from "../icons/Mastercard";
import PayPal from "../icons/PayPal";
import Visa from "../icons/Visa";
import React from "react";

const Payments = ({mt = '14px', hidePaypal}: {mt?: string|number, hidePaypal?: boolean}) => {
	const paymentIconStyle = {fontSize: '40px', marginTop: '6px', marginRight: '6px', height: '25px'}
	return (
		<div style={{display: 'flex', marginTop: mt, justifyContent: 'center', flexWrap: 'wrap', width: '100%'}}>
			<AmericanExpress sx={paymentIconStyle} />
			<ApplePay sx={paymentIconStyle} />
			<GooglePay sx={paymentIconStyle} />
			<Maestro sx={paymentIconStyle} />
			<Mastercard sx={paymentIconStyle} />
			{!hidePaypal && <PayPal sx={paymentIconStyle} />}
			<Visa sx={paymentIconStyle} />
		</div>
	)
}

export default Payments;