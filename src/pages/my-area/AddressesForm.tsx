
import useMyArea from "./useMyArea";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {Button, Container, TextField} from "@mui/material";
import Loading from "../../components/Loading";
import {useTranslation} from "next-i18next";
import React from "react";
import {Country, LoggedCustomer} from "../../types/woocommerce";
import HelperText from "../../components/HelperText";
import CustomerAddressForm from "../../components/CustomerAddressForm";

type FormProps = { countries: Country[]}
type AddressesFormProps = FormProps & {type: 'billing'|'shipping'}
type FormContainerProps<T extends LoggedCustomer['billing']|LoggedCustomer['shipping']> = AddressesFormProps & {address: T, onValid: any}
function AddressesForm({type, countries}: AddressesFormProps) {
	const { customer, updateCustomer } = useMyArea();
	const onValid = (data: any) => {
		const { ...customerData } = data
		updateCustomer(customerData)
	}
	return customer ?
		<FormContainer address={customer[type]} type={type} onValid={onValid} countries={countries} /> :
		<Loading />
}

function FormContainer<T extends LoggedCustomer['billing']|LoggedCustomer['shipping']>({address, countries, type, onValid}: FormContainerProps<T>) {
	const { t } = useTranslation('common')
	const defaultValues = {
		[type]: address
	}
	const methods = useForm<{ billing: LoggedCustomer['billing'], shipping: LoggedCustomer['shipping']}>(
		{ defaultValues }
	)
	return (
		<Container maxWidth="sm" sx={{paddingBottom: '40px'}}>
			{type === 'billing' && (
				<Controller
					control={methods.control}
					name="billing.email"
					rules={{
						required: t('validation.emailRequired'),
						pattern: {value: /\S+@\S+\.\S+/, message: t('validation.emailValid')}
					}}
					render={({ field }) => (
						<TextField
							{...field}
							onChange={(e) => {
								field.onChange(e)
								methods.setError(field.name, {})
							}}
							fullWidth
							variant="outlined"
							label="Email"
							helperText={<HelperText message={methods.formState.errors.billing?.email?.message} />}
						/>
					)}
				/>
			)}
			<FormProvider {...methods}>
				<CustomerAddressForm
					isShipping={type === 'shipping'}
					countries={countries}
				/>
			</FormProvider>
			<Button fullWidth onClick={methods.handleSubmit(onValid)}>Save</Button>
		</Container>
	);
}

export function BillingForm({countries}: FormProps) {
	return <AddressesForm type="billing" countries={countries} />
}

export function ShippingForm({countries}: FormProps) {
	return <AddressesForm type="shipping" countries={countries} />
}