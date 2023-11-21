import { ElementType } from "react";
import { sanitize } from "../utils/utils";
import { Box, SxProps, Theme } from "@mui/material";

type HtmlBlockProps = {
	html: string;
	sx?: SxProps<Theme> | undefined;
	component?: ElementType;
};

const HtmlBlock = ({ html, sx, component }: HtmlBlockProps) => {
	const Component = component ?? 'div';

	return (
		<Box
			component={Component}
			className="html-block"
			dangerouslySetInnerHTML={{ __html: sanitize(html) }}
			sx={sx}
		/>
	);
};

export default HtmlBlock;
