import Link from "next/link";
import Image from "next/image";
import logo from "../../images/bottega-di-sguardi-logo.png";
import {IconButton} from "@mui/material";
import React from "react";

const Logo = () => (
	<IconButton
		component={Link}
		href="/"
		sx={{
			margin: '20px',
			'&:hover': {
				backgroundColor: 'inherit'
			}
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