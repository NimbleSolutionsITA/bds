import {InputAdornment, TextField} from "@mui/material";
import {Close, SearchSharp} from '@mui/icons-material';
import {ChangeEvent} from "react"; // import the clear icon

type NameFieldProps = {
	onChange: (name?: string) => void
	value: string
	disabled?: boolean
}
const NameField = ({onChange, value, disabled}: NameFieldProps) => {

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	const handleClear = () => {
		onChange("");
	};

	return <TextField
		value={value}
		placeholder="Cerca per nome"
		onChange={handleChange}
		size="small"
		variant="filled"
		color="primary"
		disabled={disabled}
		InputProps={{
			endAdornment: (
				<InputAdornment position="end" onClick={() =>  value && handleClear()}>
					{value ? <Close  />: <SearchSharp />}
				</InputAdornment>
			)
		}}
		sx={{
			opacity: disabled ? 0.5 : 1,
			transition: 'opacity 0.3s ease-in-out',
			fontSize: '10px',
			borderRadius: 0,
			paddingRight: '12px',
			'& .MuiInputBase-root.Mui-focused': {
				backgroundColor: 'rgba(255,255,255,.15)',
			},
			'& .MuiInputBase-input': {
				padding: '18px 10px',
				'&::placeholder': {
					textOverflow: 'ellipsis !important',
					opacity: 1,
				},
			},
			'& .MuiInputBase-input.Mui-disabled': {
				color: 'rgba(255,255,255,.43)',
				WebkitTextFillColor: 'rgba(255,255,255,.43)',
			},
			'& .MuiInputBase-colorPrimary::before': {
				display: 'none !important',
			},
			'& .MuiInputBase-colorPrimary::after': {
				display: 'none !important',
			}
		}}
	/>
}

export default NameField