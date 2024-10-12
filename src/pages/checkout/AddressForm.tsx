import {ReactNode, SyntheticEvent} from "react";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import {Tabs, Tab, TextField, Switch, FormControlLabel} from "@mui/material";
import {FormFields} from "./CheckoutGrid";
import HelperText from "../../components/HelperText";
import {useTranslation} from "next-i18next";
import CustomerAddressForm from "../../components/CustomerAddressForm";
import usePayPalCheckout from "../../components/PayPalCheckoutProvider";

const AddressForm = () => {
	const { shipping: { countries }} = usePayPalCheckout()
	const { control, formState: { errors }, setError, watch, setValue,  } = useFormContext<FormFields>();
	const tab = watch('addressTab')
	const handleChange = (event: SyntheticEvent, newValue: number) => {
		setValue('addressTab', newValue);
	};
	const { t } = useTranslation('common');
	const hasShipping = useWatch({name: 'has_shipping', control});
	const tabs = hasShipping ? [0, 1] : [0]

	return (
		<div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
			<Controller
				control={control}
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
							setError(field.name, {})
						}}
						fullWidth
						variant="outlined"
						label="Email"
						helperText={<HelperText message={errors.billing?.email?.message} />}
					/>
				)}
			/>
			<Controller
				control={control}
				name="has_shipping"
				render={({ field }) => (
					<FormControlLabel sx={{marginTop: '10px', marginRight: 'auto'}} labelPlacement="start" control={(
						<Switch checked={!!hasShipping} {...field} />
					)} label={t('checkout.different-address')} />
				)}
			/>
			<Tabs
				value={hasShipping ? tab : 0}
				onChange={handleChange}
				variant="fullWidth"
			>
				{tabs.map((index) => (
					<Tab
						key={index}
						label={t(`checkout.${index === 0 ? 'billing' : 'shipping'}`)}
						id={`address-tab-${index}`}
						aria-controls={`address-tabpanel-${index}`}
					/>
				))}
			</Tabs>
			<div style={{position: 'relative'}}>
				{tabs.map((index) => (
					<CustomTabPanel key={index} value={tab} index={index}>
						<CustomerAddressForm countries={countries} isShipping={index === 1} />
					</CustomTabPanel>
				))}
			</div>
		</div>
	)
}

interface TabPanelProps {
	children?: ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`address-tabpanel-${index}`}
			aria-labelledby={`address-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</div>
	);
}

export default AddressForm;