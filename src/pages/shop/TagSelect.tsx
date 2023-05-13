import {Box, Chip, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {Category, ProductTag} from "../../types/woocommerce";
import {useState} from "react";

type TagSelectProps = {
	tags: ProductTag[] | Category[]
	onChange: (tags: string[]) => void,
	placeholder?: string,
	single?: boolean
}

const TagSelect = ({ tags, onChange, placeholder, single }: TagSelectProps) => {
	const [values, setValues] = useState<string[]>([]);
	const handleChange = (event: SelectChangeEvent<typeof values>) => {
		const {
			target: { value },
		} = event;
		const newValue = typeof value === 'string' ? value.split(',') : value
		setValues(newValue);
		onChange(newValue);
	};
	return (
		<Select
			multiple={!single}
			value={values}
			onChange={handleChange}
			displayEmpty
			renderValue={(selected) => (
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
					{selected.length > 0 ? selected.map((value) => (
						<Chip
							key={value}
							size="small"
							color="secondary"
							sx={{
								backgroundColor: 'rgba(0,0,0,0.2)',
								color: '#fff',
								fontSize: '10px',
								fontWeight: 500,
								borderRadius: 0,
								height: '20px'
							}}
							label={<span dangerouslySetInnerHTML={{__html: tags.find(t => t.slug === value)?.name ?? ''}} />}
						/>
					)) : <span style={{color: 'rgba(255,255,255,0.43)'}}>{placeholder}</span>}
				</Box>
			)}
			size="small"
			MenuProps={{
				sx: {
					'& .MuiMenu-paper': {
						backgroundColor: '#708477',
						borderBottom: '2px solid rgba(255,255,255,0.42) !important',
						borderLeft: '2px solid rgba(255,255,255,0.42) !important',
						borderRight: '2px solid rgba(255,255,255,0.42) !important',
						borderTop: 'none',
						marginTop: '-2px',
						color: 'rgba(255,255,255,0.8)',
						boxShadow: 'none',
					}
				}
			}}
			sx={{
				minWidth: {
					xs: '100%',
					md: 100
				},
				color: 'rgba(255,255,255,0.42)',
				'& .MuiSelect-outlined': {
					paddingTop: '7.5px',
					paddingBottom: '7.5px',
					color: '#fff',
				},
				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: 'rgba(255,255,255,0.42) !important'
				},
				'& .MuiSelect-icon': {
					color: 'rgba(255,255,255,0.42)',
				},
		}}
		>
			{tags.map((tag) => (
				<MenuItem key={tag.id} value={tag.slug}>
					<span dangerouslySetInnerHTML={{__html: tag.name}} />
				</MenuItem>
			))}
		</Select>
	)
}

export default TagSelect