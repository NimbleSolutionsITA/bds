import {Category, Color, ProductTag} from "../types/woocommerce";
import {Avatar, Chip as MuiChip, SxProps, Theme} from "@mui/material";
import React from "react";

type FilterChipProps = {
	onClick?: () => void
	tag: ProductTag | Color | Category | {name: string}
	isActive?: boolean,
	color?: string
	avatar?: string
	size?: 'small' | 'medium'
	sxMobile?: SxProps<Theme> | undefined
}
const Chip = ({onClick, tag, isActive, color, avatar, size = 'small', sxMobile}: FilterChipProps) => (
	<MuiChip
		label={<span dangerouslySetInnerHTML={{__html: tag.name}} />}
		color="primary"
		onClick={onClick}
		clickable
		size={size}
		variant={isActive ? "filled" : "outlined"}
		sx={(theme) => ({
			borderRadius: 0,
			paddingLeft: color ? '5px' : 0,
			'&.MuiChip-filled': {
				backgroundColor: 'primary',
			},
			[theme.breakpoints.down('sm')]: sxMobile
		})}
		avatar={avatar ? (
			<Avatar alt="Natacha" src={avatar} />
			) : (
			<ColorBox color={color} />
		)}
	/>
)

const ColorBox = ({color}: {color?: string}) => (
	<div style={{height: color ? 8 : 0, width: color ? 30 : 0, backgroundColor: color}} />
)

export default Chip