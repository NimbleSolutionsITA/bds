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
	ErrorOption,
	FieldPath,
	useFormContext,
	useWatch
} from "react-hook-form";
import {Inputs} from "../pages/checkout/CheckoutGrid";
import HelperText from "../components/HelperText";
import {useTranslation} from "next-i18next";

const InvoiceForm = () => {
	const { control, formState: { errors }, setError, watch } = useFormContext<Inputs>();
	const { t } = useTranslation('common')
	const invoiceType = watch('invoice.invoiceType')
	return (
		<Grid container spacing={2} paddingY={2}>
			<SelectInput
				control={control}
				error={errors.invoice?.billingChoice?.message}
				name="billingChoice"
				setError={setError}
				options={['invoice', 'receipt']}
			/>
			<SelectInput
				control={control}
				error={errors.invoice?.invoiceType?.message}
				name="invoiceType"
				setError={setError}
				options={['private', 'company', 'freelance']}
			/>
			{invoiceType !== 'private' && (
				<TextInput
					control={control}
					error={errors.invoice?.vat?.message ?? ''}
					name="vat"
					label={t('form.vat')}
					md={12}
					setError={setError}
					optional
				/>
			)}
			<TextInput
				control={control}
				error={errors.invoice?.tax?.message ?? ''}
				name="tax"
				label={t('form.tax')}
				md={12}
				setError={setError}
				optional
			/>
			{invoiceType !== 'private' && (
				<TextInput
					control={control}
					error={errors.invoice?.sdi?.message ?? ''}
					name="sdi"
					label={t('form.sdi')}
					md={12}
					setError={setError}
					optional
				/>
			)}
		</Grid>
	)
}

type TextInputProps = {
	control: Control<Inputs, any>
	error?: string
	name: string
	label: string
	md?: number
	optional?: boolean
	setError: (name: (FieldPath<Inputs> | `root.${string}` | "root"), error: ErrorOption, options?: {shouldFocus: boolean}) => void
}

const TextInput = ({control, error, name, label, optional, md = 6, setError}: TextInputProps) => {
	const { t } = useTranslation('common')
	return (
		<Grid item xs={12} md={md}>
			<Controller
				control={control}
				name={`invoice.${name}` as keyof Inputs}
				rules={optional ? {} : {
					required: t('validation.required', {field: label}),
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
						label={label}
						helperText={<HelperText message={error} />}
					/>
				)}
			/>
		</Grid>
	)
}

type SelectInputProps = {
	control: Control<Inputs, any>
	error?: string
	name: keyof Inputs['invoice']
	setError: (name: (FieldPath<Inputs> | `root.${string}` | "root"), error: ErrorOption, options?: {shouldFocus: boolean}) => void
	options: string[]
}
const SelectInput = ({options, name, control, setError, error}: SelectInputProps) => {
	const { t } = useTranslation('common')
	return (
		<Grid item xs={12} md={6}>
			<Controller
				control={control}
				name={`invoice.${name}`}
				render={({ field }) => (
					<FormControl fullWidth>
						<InputLabel>{t(`form.${name}`)}</InputLabel>
						<Select
							{...field}
							onChange={(e) => {
								field.onChange(e.target.value)
								setError(field.name, {})
							}}
							variant="outlined"
							label={t(`form.${name}`)}
						>
							{options.map((choice) => (
								<MenuItem key={choice} value={choice}>
									{t(`${name}.${choice}`)}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>
							<HelperText message={error} />
						</FormHelperText>
					</FormControl>
				)}
			/>
		</Grid>
	)
}

export default InvoiceForm