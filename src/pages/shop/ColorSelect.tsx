import {Color} from "../../types/woocommerce";
import {Autocomplete, Box, Chip, FormControl, TextField} from "@mui/material";
import React from "react";

type ColorSelectProps = {
	colors: Color[]
	onClick: (color: string) => void
}
const ColorSelect = ({colors, onClick}: ColorSelectProps) => {
	const [selectedColors, setSelectedColors] = React.useState<Color[]>([]);
	return (
		<Box sx={{
			display: 'flex',
			alignItems: 'center',
			gap: '10px',
			width: {xs: '100%', md: 'auto'},
			flexDirection: {xs: 'column', md: 'row'}}}
		>
			<FormControl sx={{width: {xs: '100%', md: 'auto'}}}>
				<Autocomplete
					color="primary"
					multiple
					id="color-select"
					options={colors}
					getOptionLabel={(option) => option.name}
					componentsProps={{
						paper: {
							sx: {
								backgroundColor: '#708477',
								borderBottom: '2px solid rgba(255,255,255,0.42) !important',
								borderLeft: '2px solid rgba(255,255,255,0.42) !important',
								borderRight: '2px solid rgba(255,255,255,0.42) !important',
								borderTop: 'none',
								marginTop: '-2px'
							}
						}
					}}
					renderOption={(props, option) => (
						<li {...props} style={{color: 'rgba(255,255,255,0.8)', fontWeight: 300}}>
							<Box
								sx={{
									width: 30,
									height: 15,
									backgroundColor: option.code,
									marginRight: 1
								}}
							/>
							{option.name}
						</li>
					)}
					renderInput={(params) => (
						<TextField
							{...params}
							placeholder="Seleziona i colori"
						/>
					)}
					value={selectedColors}
					onChange={(event, newValue) => {
						setSelectedColors(newValue);
						onClick(newValue.map((color: Color) => color.slug).join(','));
					}}
					sx={{
						width: {
							xs: '100%',
							md: 190
						},
						'& .MuiAutocomplete-inputRoot': {
							paddingTop: 0,
							paddingBottom: 0,
							color: '#fff',
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: 'rgba(255,255,255,0.42) !important'
							}
						},
						'& .MuiAutocomplete-endAdornment': {
							'& .MuiSvgIcon-root': {
								color: 'rgba(255,255,255,0.42)',
							}
						},
				}}
					renderTags={() => null}
				/>
			</FormControl>
			<Box sx={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
				{selectedColors.map((option) => (
					<Chip
						aria-label={option.name}
						key={option.slug}
						variant="outlined"
						sx={{
							backgroundColor: option.code,
							opacity: .5,
							height: '15px',
							width: '30px',
							borderRadius: 0,
						}}
						onClick={() => {
							const newValue = selectedColors.filter((color: Color) => color.slug !== option.slug);
							setSelectedColors(newValue);
							onClick(newValue.map((color: Color) => color.slug).join(','));
						}}
					/>
				))}
			</Box>
		</Box>
	)
}

export default ColorSelect