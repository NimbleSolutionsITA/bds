import { PayPalButtons } from "@paypal/react-paypal-js";
import Loading from "../../components/Loading";
import {OrderResponseBody} from "@paypal/paypal-js";

type PaypalButtonProps = {
	setPaid: (payPal: OrderResponseBody) => void
	setError: () => void
	orderTotal?: string
}

const PaypalButton = ({ setPaid, orderTotal, setError }: PaypalButtonProps) => orderTotal ? (
	<div style={{padding: '20px', border: '1px solid rgba(0,0,0,0.1)'}}>
		<PayPalButtons
			createOrder={(data, actions) => {
				return actions.order.create({
					purchase_units: [{
						amount: {
							value: orderTotal || '0',
						},
					}],
				});
			}}
			onApprove={(data, actions) => {
				// This function captures the funds from the transaction.
				return actions.order?.capture().then((payPal) => setPaid(payPal)) ?? Promise.reject();
			}}
			onError={() => setError()}
		/>
	</div>
) : <Loading />
export default PaypalButton;