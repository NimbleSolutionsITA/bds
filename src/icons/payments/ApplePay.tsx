import {SvgIcon} from "@mui/material";
import {SvgIconProps} from "@mui/material/SvgIcon/SvgIcon";
import React from "react";

export default function ApplePay(props: SvgIconProps & {selected: boolean}) {
	return (
		<SvgIcon viewBox="0 0 38 38" aria-labelledby="paypal" {...props}>
			<title>applepay-fill</title>
			<rect fill={props.selected ? "#000" : "#eee"} y="7" width="38" height="24" rx="5"/>
			<path fill={props.selected ? "#fff" : "#000"} d="M11.66,15.47a1.39,1.39,0,0,1-1.14.54,1.64,1.64,0,0,1,.41-1.18,1.69,1.69,0,0,1,1.13-.58,1.72,1.72,0,0,1-.4,1.22m.39.63c-.63,0-1.16.36-1.46.36s-.76-.34-1.26-.33a1.85,1.85,0,0,0-1.58.95,4,4,0,0,0,.48,3.85c.32.47.71,1,1.21,1s.67-.31,1.25-.31.75.31,1.26.3.85-.47,1.17-.94a4,4,0,0,0,.53-1.08,1.7,1.7,0,0,1-1-1.55,1.74,1.74,0,0,1,.82-1.45,1.78,1.78,0,0,0-1.4-.76m3.63-1.31v7h1.1V19.42h1.51a2.23,2.23,0,0,0,2.35-2.32,2.2,2.2,0,0,0-2.31-2.31Zm1.1.92H18a1.32,1.32,0,0,1,1.49,1.4,1.32,1.32,0,0,1-1.5,1.4H16.78Zm5.86,6.18a1.79,1.79,0,0,0,1.61-.9h0v.84h1v-3.5c0-1-.81-1.68-2.07-1.68a1.84,1.84,0,0,0-2,1.58h1a1,1,0,0,1,1-.72c.67,0,1,.31,1,.89v.39l-1.37.08c-1.27.08-2,.6-2,1.5A1.55,1.55,0,0,0,22.64,21.89Zm.3-.84c-.59,0-1-.28-1-.71s.36-.7,1-.74l1.22-.08v.4A1.19,1.19,0,0,1,22.94,21.05Zm3.7,2.7c1.07,0,1.57-.41,2-1.64l1.92-5.39H29.46l-1.29,4.16h0l-1.29-4.16H25.71l1.86,5.13-.1.31a.88.88,0,0,1-.92.74l-.32,0v.84A2.63,2.63,0,0,0,26.64,23.75Z"/>
		</SvgIcon>
	);
}