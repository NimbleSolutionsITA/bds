import PayPalCheckout from "./PayPalCheckout";
import CartAddressRecap from "./CartAddressRecap";


const Payment = () => {
	return (
		<div style={{width: '100%', position: 'relative'}}>
			<CartAddressRecap />
			<PayPalCheckout />
		</div>
	)
}

export default Payment;