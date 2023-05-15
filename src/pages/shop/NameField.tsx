import {IconButton, InputAdornment, TextField} from "@mui/material";
import {Close} from '@mui/icons-material';
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
		color="secondary"
		disabled={disabled}
		InputProps={{
			endAdornment: value ? (
				<InputAdornment position="end">
					<IconButton color="secondary" size="small" onClick={handleClear}>
						<Close fontSize="small"  />
					</IconButton>
				</InputAdornment>
			) : null,
		}}
		sx={{
			opacity: disabled ? 0.5 : 1,
			transition: 'opacity 0.3s ease-in-out',
			fontSize: '10px',
			borderRadius: 0,
			'& .MuiInputBase-root.Mui-focused': {
				backgroundColor: 'rgba(255,255,255,.15)',
			},
			'& .MuiInputBase-input': {
				padding: '7.5px',
				color: '#fff',
				'&::placeholder': {
					textOverflow: 'ellipsis !important',
					color: '#fff',
					opacity: 1,
				},
			},
			'& .MuiInputBase-input.Mui-disabled': {
				color: 'rgba(255,255,255,.43)',
				WebkitTextFillColor: 'rgba(255,255,255,.43)',
			},
			'& .MuiInputBase-colorSecondary::before': {
				display: 'none !important',
			},
			'& .MuiInputBase-colorSecondary::after': {
				display: 'none !important',
			}
		}}
	/>
}

export default NameField