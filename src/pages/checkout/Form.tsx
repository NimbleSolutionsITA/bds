import {
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from "@mui/material";
import {
	Control,
	Controller,
	DeepRequired,
	ErrorOption,
	FieldErrorsImpl,
	FieldPath,
	GlobalError, useFormContext,
	useWatch
} from "react-hook-form";
import {Country} from "../../types/woocommerce";
import {Inputs} from "./CheckoutGrid";
import HelperText from "../../components/HelperText";
import {useTranslation} from "next-i18next";

type FormProps = {
	isShipping?: boolean
	countries: Country[]
}
const Form = ({isShipping, countries}: FormProps) => {
	const { control, formState: { errors }, setError } = useFormContext<Inputs>();
	const type: 'billing' | 'shipping' = isShipping ? 'shipping' : 'billing';
	const country = useWatch({name: `${type}.country`, control})
	const hideState = country === '' || countries.find(c => c.code === country)?.states?.length === 0
	const { t } = useTranslation('common')
	return (
		<Grid container spacing={2} paddingY={2}>
			<TextInput
				control={control}
				error={errors[type]?.first_name?.message ?? ''}
				type={type}
				name="first_name"
				label={t('form.name')}
				setError={setError}
			/>
			<TextInput
				control={control}
				error={errors[type]?.last_name?.message ?? ''}
				type={type}
				name="last_name"
				label={t('form.lastname')}
				setError={setError}
			/>
			<TextInput
				control={control}
				error={errors[type]?.company?.message ?? ''}
				type={type}
				name="company"
				label={t('form.company')}
				optional
				md={12}
				setError={setError}
			/>
			<Grid item xs={12} md={hideState ? 12 : 6}>
				<Controller
					control={control}
					name={`${type}.country`}
					rules={{
						required: t('form.required', {field: t('form.country')}),
					}}
					render={({ field }) => (
						<FormControl fullWidth>
							<InputLabel>{t('form.country')}</InputLabel>
							<Select
								{...field}
								onChange={(e) => {
									field.onChange(e.target.value)
									setError(field.name, {})
								}}
								variant="outlined"
								label={t('form.country')}
							>
								{countries.map((country) => (
									<MenuItem key={country.code} value={country.code}>
										{country.name}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>
								<HelperText message={errors[type]?.country?.message} />
							</FormHelperText>
						</FormControl>
					)}
				/>
			</Grid>
			{!hideState && (
				<Grid item xs={12} md={6}>
					<Controller
						control={control}
						name={`${type}.state`}
						rules={{
							required: t('validation.required', {context: 'female', field: t('form.state')}),
						}}
						render={({field}) => (
							<FormControl fullWidth>
								<InputLabel>{t('form.state')}</InputLabel>
								<Select
									{...field}
									onChange={(e) => {
										field.onChange(e.target.value)
										setError(field.name, {})
									}}
									variant="outlined"
									label={t('form.state')}
								>
									{countries.find(c => c.code === country)?.states?.map((state) => (
										<MenuItem key={state.code} value={state.code}>
											{state.name}
										</MenuItem>
									))}
								</Select>
								<FormHelperText>
									<HelperText message={errors[type]?.state?.message} />
								</FormHelperText>
							</FormControl>
						)}
					/>
				</Grid>
			)}
			<TextInput
				control={control}
				error={errors[type]?.address_1?.message ?? ''}
				type={type}
				name="address_1"
				label={t('form.address')}
				md={12}
				setError={setError}
			/>
			<TextInput
				control={control}
				error={errors[type]?.city?.message ?? ''}
				type={type}
				name="city"
				label={t('form.city')}
				setError={setError}
			/>
			<TextInput
				control={control}
				error={errors[type]?.postcode?.message ?? ''}
				type={type}
				name="postcode"
				label={t('form.zip')}
				setError={setError}
			/>
			{type === 'billing' && (
				<TextInput
					control={control}
					error={errors.billing?.phone?.message ?? ''}
					type={type}
					name="phone"
					label={t('form.phone')}
					md={12}
					setError={setError}
				/>
			)}
		</Grid>
	)
}

type TextInputProps = {
	control: Control<Inputs, any>
	error: string
	type: keyof Inputs
	name: string
	label: string
	md?: number
	optional?: boolean
	setError: (name: (FieldPath<Inputs> | `root.${string}` | "root"), error: ErrorOption, options?: {shouldFocus: boolean}) => void
}

const TextInput = ({control, error, type, name, label, optional, md = 6, setError}: TextInputProps) => {
	const { t } = useTranslation('common')
	return (
		<Grid item xs={12} md={md}>
			<Controller
				control={control}
				name={`${type}.${name}` as keyof Inputs}
				rules={optional ? {} : {
					required: t('validation.required', {field: label}),
				}}
				render={({ field }) => (
					<TextField
						{...field}
						onChange={(e) => {
							field.onChange(e.target.value)
							setError(field.name, {})
						}}
						fullWidth
						variant="outlined"
						label={label}
						helperText={<HelperText message={error} />}
					/>
				)}
			/>
		</Grid>
	)
}


export default Form