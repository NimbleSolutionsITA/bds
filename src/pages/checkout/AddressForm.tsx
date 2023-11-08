import {SyntheticEvent, Dispatch, SetStateAction} from "react";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import {Tabs, Tab, TextField, Switch, FormControlLabel} from "@mui/material";
import Form from "./Form";
import {Country} from "../../types/woocommerce";
import {Inputs} from "./CheckoutGrid";
import HelperText from "../../components/HelperText";
import MotionPanel from "../../components/MotionPanel";
import {useTranslation} from "next-i18next";

type AddressFormProps = {
	countries: Country[]
	isLoading: boolean
	tab: number
	setTab: Dispatch<SetStateAction<number>>
}
const AddressForm = ({isLoading, countries, tab, setTab}: AddressFormProps) => {
	const { control, formState: { errors }, setError } = useFormContext<Inputs>();
	const handleChange = (event: SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};
	const { t } = useTranslation('common');
	const hasShipping = useWatch({name: 'has_shipping', control});
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
						countries={countries}
					/>
				</MotionPanel>
				{hasShipping && (
					<MotionPanel active={tab === 1}>
						<Form
							isShipping
							countries={countries}
						/>
					</MotionPanel>
				)}
			</div>
		</div>
	)
}
export default AddressForm;