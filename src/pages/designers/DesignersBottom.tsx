import {Container, Divider} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import React from "react";

type DesignersBottomProps = {
	bottomText: string
}
const DesignersBottom = ({bottomText}: DesignersBottomProps) => (
	<Container>
		<Divider sx={{marginBottom: '40px'}} />
		<HtmlBlock html={bottomText} />
	</Container>
)

export default DesignersBottom