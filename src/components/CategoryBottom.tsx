import {Container, Divider} from "@mui/material";
import HtmlBlock from "../components/HtmlBlock";
import React from "react";

type DesignersBottomProps = {
	bottomText: string
}
const CategoryBottom = ({bottomText}: DesignersBottomProps) => (
	<Container sx={{ visibility: "hidden", height: 0, overflow: "hidden" }}>
		<Divider sx={{marginBottom: '40px'}} />
		<HtmlBlock html={bottomText} />
	</Container>
)

export default CategoryBottom