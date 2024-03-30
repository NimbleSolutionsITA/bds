import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import React from "react";
import {Button, CircularProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {NEXT_API_ENDPOINT} from "../../utils/endpoints";
import {useTranslation} from "next-i18next";

const PaymentStripe = () => {
	const [loading, setLoading] = React.useState(false);
	const { customer, cart, stripe: stripeIntent } = useSelector((state: RootState) => state.cart);
	const stripe = useStripe();
	const elements = useElements();
	const { t } = useTranslation('common')

	const handleSubmit = async (event: any) => {
		// We don't want to let default form submission happen here,
		// which would refresh the page.
		event.preventDefault();
		setLoading(true)

		if (!stripe || !elements || !stripeIntent?.intentId) {
			// Stripe.js hasn't yet loaded.
			return;
		}

		const response = await fetch(NEXT_API_ENDPOINT + '/order/stripe-intent', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ cart, customer, paymentIntentId: stripeIntent.intentId })
		}).then((r) => r.json())

		if (!response.success) {
			console.log(response.error)
			return;
		}

		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/checkout/stripe-completed?email=${customer?.billing?.email}`,
			}
		});

		if (result.error) {
			// Show error to your customer (for example, payment details incomplete)
			await fetch(NEXT_API_ENDPOINT + '/order/stripe-intent-update', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ intentId: stripeIntent.intentId })
			}).then((r) => r.json())
			console.log(result.error.message);
		}
		setLoading(false)
	};
	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement
				id="payment-element"
				options={{
					layout: {
						type: 'accordion',
						radios: true,
						spacedAccordionItems: true,
						defaultCollapsed: false,
					},
					defaultValues: {
						billingDetails: {
							name: `${customer?.billing.first_name} ${customer?.billing.last_name}`,
							email: customer?.billing.email,
							phone: customer?.billing.phone,
							address: {
								line1: customer?.billing.address_1,
								city: customer?.billing.city,
								state: customer?.billing.state,
								postal_code: customer?.billing.postcode,
								country: customer?.billing.country,
							},
						}
					},
				}}
			/>
			<Button
				disabled={loading}
				endIcon={loading && <CircularProgress size={24} />}
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				sx={{marginTop: 2, marginBottom: 2}}
			>
				{t('checkout.pay-now')}
			</Button>
		</form>
	)
}

export default PaymentStripe;