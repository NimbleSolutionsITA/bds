
import {Controller, FormProvider, useForm} from "react-hook-form";
import {Button, CircularProgress, Container, FormControlLabel, Switch, TextField} from "@mui/material";
import Loading from "../../components/Loading";
import {useTranslation} from "next-i18next";
import React from "react";
import {Country, LoggedCustomer} from "../../types/woocommerce";
import HelperText from "../../components/HelperText";
import CustomerAddressForm from "../../components/CustomerAddressForm";
import useAuth from "../../utils/useAuth";
import loading from "../../components/Loading";

type FormProps = { countries: Country[]}
type AddressesFormProps = FormProps & {type: 'billing'|'shipping'}
type FormContainerProps<T extends LoggedCustomer['billing']|LoggedCustomer['shipping']> = AddressesFormProps & {address: T, onValid: any, loading: boolean, hasShipping?: boolean}
function AddressesForm({type, countries}: AddressesFormProps) {
	const { customer, updateCustomer, isUpdating: loading } = useAuth();
	const hasShipping = type === 'shipping' && !!customer?.meta_data.find(({key}) => key === 'has_shipping');
	const onValid = (data: any) => {
		let { has_shipping, ...customerData } = data
		if (type === 'billing') {
			customerData.billing.email = customer?.email
		}
		else {
			customerData.meta_data = [
				{ key: 'has_shipping', value: has_shipping }
			]
		}
		updateCustomer(customerData)
	}
	return customer ?
		<FormContainer loading={loading} hasShipping={hasShipping} address={customer[type]} type={type} onValid={onValid} countries={countries} /> :
		<Loading />
}

function FormContainer<T extends LoggedCustomer['billing']|LoggedCustomer['shipping']>({address, countries, type, onValid, loading, hasShipping}: FormContainerProps<T>) {
	const { t } = useTranslation('common')
	const defaultValues = {
		[type]: address,
		has_shipping: hasShipping
	}
	const methods = useForm<{ billing: LoggedCustomer['billing'], shipping: LoggedCustomer['shipping'], has_shipping: boolean}>(
		{ defaultValues }
	)
	const has_sipping = methods.watch('has_shipping');
	return (
		<Container maxWidth="sm" sx={{paddingBottom: '40px'}}>
			{type === 'shipping' && (
				<Controller
					control={methods.control}
					name="has_shipping"
					render={({ field }) => (
						<FormControlLabel sx={{marginTop: '10px', marginRight: 'auto'}} labelPlacement="start" control={(
							<Switch checked={has_sipping} {...field} />
						)} label={t('checkout.different-address')} />
					)}
				/>
			)}
			{(type === 'billing' || has_sipping) && (
				<>
					<FormProvider {...methods}>
						<CustomerAddressForm
							isShipping={type === 'shipping'}
							countries={countries}
						/>
					</FormProvider>
					<Button
						endIcon={loading ? <CircularProgress size="20px" /> : undefined}
						sx={{mt: '20px'}} fullWidth type="submit" disabled={loading}
						onClick={methods.handleSubmit(onValid)}
					>
						{t('save')}
					</Button>
				</>
			)}
		</Container>
	);
}

export function BillingForm({countries}: FormProps) {
	return <AddressesForm type="billing" countries={countries} />
}

export function ShippingForm({countries}: FormProps) {
	return <AddressesForm type="shipping" countries={countries} />
}