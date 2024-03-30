
import {Controller, FormProvider, useForm} from "react-hook-form";
import {Button, CircularProgress, Container, TextField} from "@mui/material";
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
type FormContainerProps<T extends LoggedCustomer['billing']|LoggedCustomer['shipping']> = AddressesFormProps & {address: T, onValid: any, loading: boolean}
function AddressesForm({type, countries}: AddressesFormProps) {
	const { customer, updateCustomer, isUpdating: loading } = useAuth();
	const onValid = (data: any) => {
		let { ...customerData } = data
		if (type === 'billing') {
			customerData.billing.email = customer?.email
		}
		updateCustomer(customerData)
	}
	return customer ?
		<FormContainer loading={loading} address={customer[type]} type={type} onValid={onValid} countries={countries} /> :
		<Loading />
}

function FormContainer<T extends LoggedCustomer['billing']|LoggedCustomer['shipping']>({address, countries, type, onValid, loading}: FormContainerProps<T>) {
	const { t } = useTranslation('common')
	const defaultValues = {
		[type]: address
	}
	const methods = useForm<{ billing: LoggedCustomer['billing'], shipping: LoggedCustomer['shipping']}>(
		{ defaultValues }
	)
	return (
		<Container maxWidth="sm" sx={{paddingBottom: '40px'}}>
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
		</Container>
	);
}

export function BillingForm({countries}: FormProps) {
	return <AddressesForm type="billing" countries={countries} />
}

export function ShippingForm({countries}: FormProps) {
	return <AddressesForm type="shipping" countries={countries} />
}