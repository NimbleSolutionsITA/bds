import {SvgIcon} from "@mui/material";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";
import React from "react";

export default function PayPal(props: SvgIconProps & {selected: boolean}) {
	return (
		<SvgIcon viewBox="0 0 38 38" aria-labelledby="paypal" {...props}>
			<title>paypal-fill</title>
			<rect fill={props.selected ? "#000" : "#eee"} y="7" width="38" height="24" rx="5"/>
			<path fill={props.selected ? "#fff" : "#000"} d="M10.42,16a1.88,1.88,0,0,0-1.5-.53H6.85a.28.28,0,0,0-.28.24L5.73,21a.18.18,0,0,0,.17.2h1A.28.28,0,0,0,7.17,21l.23-1.44a.28.28,0,0,1,.28-.24h.65a2.12,2.12,0,0,0,2.35-2A1.58,1.58,0,0,0,10.42,16ZM9.15,17.39c-.11.74-.68.74-1.22.74H7.62l.21-1.39A.18.18,0,0,1,8,16.59h.15c.37,0,.72,0,.9.22A.68.68,0,0,1,9.15,17.39Zm5.94,0h-1a.16.16,0,0,0-.17.15l0,.28-.07-.1a1.37,1.37,0,0,0-1.16-.42,2.27,2.27,0,0,0-2.21,2,1.91,1.91,0,0,0,.37,1.53,1.53,1.53,0,0,0,1.24.51,1.89,1.89,0,0,0,1.37-.57l0,.27a.17.17,0,0,0,.17.2h.89a.28.28,0,0,0,.28-.24l.53-3.41A.17.17,0,0,0,15.09,17.36ZM13.71,19.3a1.11,1.11,0,0,1-1.12.95.82.82,0,0,1-.66-.27.86.86,0,0,1-.16-.7,1.12,1.12,0,0,1,1.11-1,.83.83,0,0,1,.66.28A.86.86,0,0,1,13.71,19.3Zm6.64-1.94h-1a.28.28,0,0,0-.24.13l-1.37,2-.58-1.95a.3.3,0,0,0-.28-.21h-1a.18.18,0,0,0-.17.23l1.1,3.24-1,1.46a.17.17,0,0,0,.14.27h1a.29.29,0,0,0,.24-.12l3.3-4.81A.17.17,0,0,0,20.35,17.36ZM25.14,16a1.88,1.88,0,0,0-1.5-.53H21.57a.28.28,0,0,0-.28.24L20.46,21a.17.17,0,0,0,.17.2h1.06a.19.19,0,0,0,.19-.17l.24-1.51a.28.28,0,0,1,.28-.24h.66a2.13,2.13,0,0,0,2.35-2A1.61,1.61,0,0,0,25.14,16Zm-1.26,1.42c-.12.74-.68.74-1.23.74h-.31l.22-1.39a.16.16,0,0,1,.17-.15h.14c.37,0,.73,0,.91.22A.68.68,0,0,1,23.88,17.39Zm5.93,0h-1a.17.17,0,0,0-.17.15l0,.28-.07-.1a1.39,1.39,0,0,0-1.17-.42,2.29,2.29,0,0,0-2.21,2,1.91,1.91,0,0,0,.37,1.53,1.54,1.54,0,0,0,1.25.51,1.89,1.89,0,0,0,1.37-.57l0,.27a.17.17,0,0,0,.17.2h.89a.28.28,0,0,0,.28-.24L30,17.56A.18.18,0,0,0,29.81,17.36ZM28.43,19.3a1.09,1.09,0,0,1-1.11.95.83.83,0,0,1-.67-.27.85.85,0,0,1-.15-.7,1.11,1.11,0,0,1,1.1-1,.8.8,0,0,1,.83,1Zm3.67-3.86h-1a.18.18,0,0,0-.17.14L30.13,21a.17.17,0,0,0,.17.2h.85a.28.28,0,0,0,.28-.24l.84-5.33A.18.18,0,0,0,32.1,15.44Z"/>
		</SvgIcon>
	);
}