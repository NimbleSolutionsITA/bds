import {IconButton, InputAdornment, TextField} from "@mui/material";
import {Close} from '@mui/icons-material';
import {ChangeEvent, useState} from "react"; // import the clear icon

type NameFieldProps = {
	onChange: (name?: string) => void
}
const NameField = ({onChange}: NameFieldProps) => {
	const [value, setValue] = useState("");

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
		onChange(event.target.value);
	};

	const handleClear = () => {
		setValue("");
		onChange("");
	};
	return <TextField
		placeholder="Cerca per nome"
		onChange={handleChange}
		value={value}
		InputProps={{
			endAdornment: value ? (
				<InputAdornment position="end">
					<IconButton size="small" onClick={handleClear} sx={{color: 'rgba(255,255,255,.43)'}}>
						<Close fontSize="small"  />
					</IconButton>
				</InputAdornment>
			) : null,
		}}
		sx={{
			width: {
				xs: '100%',
				md: 190
			},
			'& .MuiInputBase-input': {
				padding: '7.5px',
				color: '#fff',
			},
			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: 'rgba(255,255,255,0.42) !important'
			}
		}}
	/>
}

export default NameField