import {MenuItem} from "../types/settings";
import {Button} from "@mui/material";
import Link from "./Link";
import {getRelativePath} from "../utils/utils";
import HtmlBlock from "./HtmlBlock";
import React from "react";

const NavButton = ({nav , handleClick}: {nav: MenuItem, handleClick: (nav: MenuItem) => void}) => (
	<Button
		key={nav.id}
		variant="text"
		sx={{color: 'black', minWidth: 0}}
		onClick={() => handleClick(nav)}
		component={Link}
		href={getRelativePath(nav.url)}
	>
		<HtmlBlock html={nav.title} />
	</Button>
)

export default NavButton