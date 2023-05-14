import {Category, Color, ProductTag} from "../../types/woocommerce";
import {Chip} from "@mui/material";
import React from "react";

type FilterChipProps = {
	onClick: () => void
	tag: ProductTag | Color | Category
	isActive: boolean,
	color?: string
}
const FilterChip = ({onClick, tag, isActive, color}: FilterChipProps) => (
	<Chip
		label={<span dangerouslySetInnerHTML={{__html: tag.name}} />}
		color="secondary"
		onClick={onClick}
		clickable
		size="small"
		variant={isActive ? "filled" : "outlined"}
		sx={{
			borderRadius: 0,
			paddingLeft: color ? '5px' : 0,
			'&.MuiChip-filled': {
				backgroundColor: 'rgba(255,255,255,0.8)',
			}
		}}
		avatar={<ColorBox color={color} />}
	/>
)

const ColorBox = ({color}: {color?: string}) => (
	<div style={{height: color ? 8 : 0, width: color ? 30 : 0, backgroundColor: color}} />
)

export default FilterChip