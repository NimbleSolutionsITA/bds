import {SyntheticEvent, Dispatch, SetStateAction} from "react";
import {Control, Controller, ErrorOption, FieldErrors, FieldPath} from "react-hook-form";
import {Tabs, Tab, TextField, Switch, FormControlLabel} from "@mui/material";
import Form from "./Form";
import {Country} from "../../types/woocommerce";
import {Inputs} from "./CheckoutGrid";
import HelperText from "../../components/HelperText";
import MotionPanel from "../../components/MotionPanel";
import {useTranslation} from "next-i18next";

type AddressFormProps = {
	control: Control<Inputs>
	errors: FieldErrors<Inputs>
	countries: Country[]
	billingCountry: string
	shippingCountry: string
	hasShipping: boolean
	isLoading: boolean
	setError: (name: (FieldPath<Inputs> | `root.${string}` | "root"), error: ErrorOption, options?: {shouldFocus: boolean}) => void
	tab: number
	setTab: Dispatch<SetStateAction<number>>
}
const AddressForm = ({isLoading, control, errors, countries, shippingCountry, billingCountry, hasShipping, setError, tab, setTab}: AddressFormProps) => {
	const handleChange = (event: SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};
	const { t } = useTranslation('common');
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
						disabled={isLoading}
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
						<Switch checked={hasShipping} {...field} />
					)} label={t('checkout.different-address')} />
				)}
			/>
			<Tabs
				value={hasShipping ? tab : 0}
				onChange={handleChange}
				variant="fullWidth"

			>
				<Tab label={hasShipping ? t('checkout.billing') : t('checkout.billing-shipping')} />
				{hasShipping && <Tab label={t('checkout.shipping')} />}
			</Tabs>
			<div style={{position: 'relative'}}>
				<MotionPanel active={!hasShipping || tab === 0}>
					<Form
						control={control}
						errors={errors}
						countries={countries}
						country={billingCountry}
						setError={setError}
					/>
				</MotionPanel>
				{hasShipping && (
					<MotionPanel active={tab === 1}>
						<Form
							isShipping
							control={control}
							errors={errors}
							countries={countries}
							country={shippingCountry}
							setError={setError}
						/>
					</MotionPanel>
				)}
			</div>
		</div>
	)
}
export default AddressForm;