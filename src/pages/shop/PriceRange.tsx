import {Slider} from "@mui/material";
import Box from "@mui/material/Box";

type PriceRangeProps = {
	onChange: (priceRange: number|number[]) => void
}
const PriceRange = ({onChange}: PriceRangeProps) => {
	const spanStyle = {
		fontSize: '10px',
		color: 'rgba(255,255,255,0.42)',
		fontWeight: 500,
		position: 'absolute',
		top: '32px'
	}
	return (
		<Box sx={{position: 'relative', width: {xs: '100%', md: 'auto'}}}>
			<Box sx={{...spanStyle, left: '-5px'}}>0€</Box>
			<Box sx={{...spanStyle, right: '-10px'}}>3000€</Box>
			<Slider
				color="secondary"
				name="price_range"
				valueLabelFormat={(value) => value+'€'}
				valueLabelDisplay="auto"
				size={'small'}
				defaultValue={[0, 3000]}
				step={10}
				min={0}
				max={3000}
				onChange={(_, value) => onChange(value)}
				sx={{
					width: {
						xs: '100%',
						md: 190
					},
				}}
				slotProps={{
					thumb: {
						style: {
							borderRadius: 0,
							width: 7,
							height: 14,
						}
					},
					rail: {
						style: {
							width: '100%',
							borderRadius: 0
						}
					}
				}}
			/>
		</Box>
	)
}

export default PriceRange