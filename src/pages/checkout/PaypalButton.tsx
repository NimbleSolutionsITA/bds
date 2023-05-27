import { PayPalButtons } from "@paypal/react-paypal-js";

type PaypalButtonProps = {
	setPaid: (transaction_id: number) => void
	setError: () => void
	orderTotal: string
}

const PaypalButton = ({ setPaid, orderTotal, setError }: PaypalButtonProps) => (
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
				// @ts-ignore
				return actions.order.capture().then((payPal) => setPaid(payPal.id));
			}}
			onError={(err) => setError()}
		/>
	</div>
)
export default PaypalButton;