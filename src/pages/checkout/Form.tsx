import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Control, Controller, DeepRequired, ErrorOption, FieldErrorsImpl, FieldPath, GlobalError} from "react-hook-form";
import {Country} from "../../types/woocommerce";
import {Inputs} from "./CheckoutGrid";
import HelperText from "../../components/HelperText";

type FormProps = {
	control: Control<Inputs, any>
	errors: Partial<FieldErrorsImpl<DeepRequired<Inputs>>> & {root?: Record<string, GlobalError> & GlobalError}
	isShipping?: boolean
	countries: Country[]
	country: string
	setError: (name: (FieldPath<Inputs> | `root.${string}` | "root"), error: ErrorOption, options?: {shouldFocus: boolean}) => void
}
const Form = ({control, errors, isShipping, countries, country, setError}: FormProps) => {
	const type: 'billing' | 'shipping' = isShipping ? 'shipping' : 'billing';
	const hideState = country === '' || countries.find(c => c.code === country)?.states?.length === 0
	return (
		<Grid container spacing={2} paddingY={2}>
			<TextInput
				control={control}
				error={errors[type]?.first_name?.message ?? ''}
				type={type}
				name="first_name"
				label="First Name"
				setError={setError}
			/>
			<TextInput
				control={control}
				error={errors[type]?.last_name?.message ?? ''}
				type={type}
				name="last_name"
				label="Last Name"
				setError={setError}
			/>
			<TextInput
				control={control}
				error={errors[type]?.company?.message ?? ''}
				type={type}
				name="company"
				label="Company (facoltativo)"
				optional
				md={12}
				setError={setError}
			/>
			<Grid item xs={12} md={hideState ? 12 : 6}>
				<Controller
					control={control}
					name={`${type}.country`}
					rules={{
						required: 'Country is required',
					}}
					render={({ field }) => (
						<FormControl fullWidth>
							<InputLabel>Country</InputLabel>
							<Select
								{...field}
								onChange={(e) => {
									field.onChange(e)
									setError(field.name, {})
								}}
								variant="outlined"
								label="Country"
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
							required: 'State is required',
						}}
						render={({field}) => (
							<FormControl fullWidth>
								<InputLabel>State</InputLabel>
								<Select
									{...field}
									onChange={(e) => {
										field.onChange(e)
										setError(field.name, {})
									}}
									variant="outlined"
									label="State"
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
				label="Address"
				md={12}
				setError={setError}
			/>
			<TextInput
				control={control}
				error={errors[type]?.city?.message ?? ''}
				type={type}
				name="city"
				label="City"
				setError={setError}
			/>
			<TextInput
				control={control}
				error={errors[type]?.postcode?.message ?? ''}
				type={type}
				name="postcode"
				label="Postal code"
				setError={setError}
			/>
			{type === 'billing' && (
				<TextInput
					control={control}
					error={errors.billing?.phone?.message ?? ''}
					type={type}
					name="phone"
					label="Phone number"
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

const TextInput = ({control, error, type, name, label, optional, md = 6, setError}: TextInputProps) => (
	<Grid item xs={12} md={md}>
		<Controller
			control={control}
			name={`${type}.${name}` as keyof Inputs}
			rules={optional ? {} : {
				required: `${label} is required`,
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


export default Form