import {Color} from "../../types/woocommerce";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {SearchParams} from "./ProductsGrid";
import {closestColor, palette} from "../../utils/utils";
import {Divider} from "@mui/material";
import ExpansionPanel from "../../components/ExpansionPanel";
import FilterChip from "./FilterChip";

type ColorPanelProps = {
	colors: Color[]
	params: string | string[] | undefined,
	setSearchParams: Dispatch<SetStateAction<SearchParams>>,
}
const ColorPanel = ({colors, params, setSearchParams}: ColorPanelProps) => {
	const [selectedColors, setSelectedColors] = useState<string[]>([])
	let groupedColors: { [color: string]: string[] } = {};

	for (let color of colors) {
		let closest = closestColor(color.code).slug;
		if (!groupedColors[closest]) {
			groupedColors[closest] = [];
		}
		groupedColors[closest].push(color.slug);
	}

	const paletteColors = Object.keys(palette).map((key: string): Color => ({
		name: palette[key].label,
		slug: key,
		code: palette[key].color
	}));

	useEffect(() => {
		if (!params || params.length === 0) {
			setSelectedColors([])
		}
	}, [params]);


	return (
		<>
			<Divider light sx={{margin: '5px 0'}} />
			<ExpansionPanel title="Colori">
				<div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '10px 0'}}>
					{paletteColors.map(color => (
						<FilterChip
							key={color.slug}
							tag={color}
							onClick={async () => {
								let updatedColors = selectedColors
								if (selectedColors.includes(color.slug)) {
									updatedColors = selectedColors.filter(v => v !== color.slug)
									setSelectedColors(updatedColors)
								}
								else {
									updatedColors = [...selectedColors, color.slug]
									setSelectedColors(updatedColors)
								}
								setSearchParams(params => ({
									...params,
									colors: updatedColors.map(color => groupedColors[color])
										.flat()
										.join(',')
								}))

							}}
							isActive={selectedColors.includes(color.slug)}
							color={color.code}
						/>
					))}
				</div>
			</ExpansionPanel>
		</>
	)
}

export default ColorPanel