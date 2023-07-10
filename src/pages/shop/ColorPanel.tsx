import {Color} from "../../types/woocommerce";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {closestColor, palette} from "../../utils/utils";
import {Divider} from "@mui/material";
import ExpansionPanel from "../../components/ExpansionPanel";
import {SearchParams} from "./ShopLayout";
import Chip from "../../components/Chip";
import {useTranslation} from "next-i18next";

type ColorPanelProps = {
	colors: Color[]
	params: string | string[] | undefined,
	setSearchParams: Dispatch<SetStateAction<SearchParams>>,
	type: 'colore' | 'lente' | 'montatura' | 'modello'
}
const ColorPanel = ({colors, params, setSearchParams, type}: ColorPanelProps) => {
	const [selectedColors, setSelectedColors] = useState<string[]>([])
	let groupedColors: { [color: string]: string[] } = {};

	for (let color of colors) {
		let closest = closestColor(color.code).slug;
		if (!groupedColors[closest]) {
			groupedColors[closest] = [];
		}
		groupedColors[closest].push(color.slug);
	}

	const availableColors = Object.keys(groupedColors)

	const paletteColors = Object.keys(palette).map((key: string): Color => ({
		name: palette[key].label,
		slug: key,
		code: palette[key].color
	})).filter(color => availableColors.includes(color.slug))
	const {t} = useTranslation()

	useEffect(() => {
		if (!params || params.length === 0) {
			setSelectedColors([])
		}
	}, [params]);


	return (
		<>
			<Divider light sx={{margin: '5px 0'}} />
			<ExpansionPanel title={t(type)} fontSize="12px">
				<div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '10px 0'}}>
					{paletteColors.map(color => (
						<Chip
							key={color.slug}
							tag={{...color, name: t('filter-colors.'+color.slug)}}
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
									[type === 'colore' ? 'colors' : type]: updatedColors.map(color => groupedColors[color])
										.flat()
										.filter(v => v)
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