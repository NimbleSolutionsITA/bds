import Link from "next/link";
import Image from "next/image";
import logo from "../../images/bottega-di-sguardi-logo.png";
import {IconButton} from "@mui/material";
import React from "react";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";

const Logo = (props: IconButtonProps) => (
	<IconButton
		component={Link}
		href="/"
		sx={{
			margin: '20px',
			'&:hover': {
				backgroundColor: 'inherit'
			},
			...props.sx
		}}
	>
		<Image
			src={logo}
			alt="Logo Bottega di Sguardi"
			style={{ width: '80px', height: 'auto' }}
		/>
	</IconButton>
)

export default Logo