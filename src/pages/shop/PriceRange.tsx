import {Slider} from "@mui/material";

type PriceRangeProps = {
	onChange: (priceRange: number|number[]) => void
	price: any
}
const PriceRange = ({onChange, price}: PriceRangeProps) => {
	const value = price ?? [0, 3000]
	return (
		<div style={{width: '100%', paddingRight: '10px'}}>
			<Slider
				value={value}
				color="secondary"
				name="price_range"
				valueLabelFormat={(value) => value+'€'}
				valueLabelDisplay="auto"
				size={'small'}
				defaultValue={[0, 3000]}
				marks={[
					{ value: 0, label: '0€' },
					{ value: 500, label: null },
					{ value: 1000, label: '1.000€' },
					{ value: 1500, label: null },
					{ value: 2000, label: '2.000€' },
					{ value: 2500, label: null },
					{ value: 3000, label: '3.000€' },

				]}
				step={10}
				min={0}
				max={3000}
				onChange={(_, value) => onChange(value)}
				sx={{
					'& .MuiSlider-markLabel': {
						fontSize: '12px',
						color: 'rgba(255,255,255,0.42)',
					},
					'& .MuiSlider-mark': {
						height: 10,
					}
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
		</div>
	)
}

export default PriceRange