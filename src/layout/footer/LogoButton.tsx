import {IconButtonProps} from "@mui/material/IconButton/IconButton";
import {useRouter} from "next/router";
import {IconButton} from "@mui/material";
import Image from "next/image";
import logo from "../../images/bottega-di-sguardi-logo.png";
import React from "react";

const LogoButton = (props: IconButtonProps) => {
	const router = useRouter()
	return (
		<IconButton onClick={() => router.push('/')} {...props}>
			<Image
				src={logo}
				alt="Logo Bottega di Sguardi"
				style={{ width: '150px', height: 'auto' }}
			/>
		</IconButton>
	)
}

export default LogoButton;