import useAuth from "../../utils/useAuth";
import {FormProvider, useForm} from "react-hook-form";
import {Button, CircularProgress, Container} from "@mui/material";
import Loading from "../../components/Loading";
import React from "react";
import { useTranslation } from "react-i18next";
import {LoggedCustomer} from "../../types/woocommerce";
import InvoiceForm from "../../components/InvoiceForm";

export default function InvoiceFormTab() {
	const { customer, updateCustomer, isUpdating: loading } = useAuth();
	const onValid = (data: any) => {
		updateCustomer({
			meta_data: [
				{ key: 'vat', value: data.invoice.vat },
				{ key: 'tax', value: data.invoice.tax },
				{ key: 'sdi', value: data.invoice.sdi },
				{ key: 'billing_choice', value: data.invoice.billingChoice },
				{ key: 'invoice_type', value: data.invoice.invoiceType}
			]
		})
	}
	return customer ? <Form customer={customer} onValid={onValid} loading={loading} /> : <Loading />
}

function Form({customer, onValid, loading}: {customer: LoggedCustomer, onValid: any, loading: boolean}) {
	const { t } = useTranslation('common')
	const profileForm = useForm(
		{
			defaultValues: {
				invoice: {
					vat: getCustomerMetaData('vat', '', customer),
					tax: getCustomerMetaData('tax', '', customer),
					sdi: getCustomerMetaData('sdi',   '', customer),
					billingChoice: getCustomerMetaData('billing_choice', 'invoice', customer),
					invoiceType: getCustomerMetaData('invoice_type', 'private', customer)
				}
			}
		}
	)
	return (
		<Container maxWidth="xs">
			<FormProvider {...profileForm}>
				<InvoiceForm />
			</FormProvider>
			<Button
				endIcon={loading ? <CircularProgress size="20px" /> : undefined}
				sx={{mt: '20px'}} fullWidth type="submit" disabled={loading}
				onClick={profileForm.handleSubmit(onValid)}
			>
				{t('save')}
			</Button>
		</Container>
	);
}

const getCustomerMetaData = (key: string, fallback: any, customer?: LoggedCustomer) => {
	return customer?.meta_data.find(({key: k}) => k === key)?.value ?? fallback
}