import {sanitize} from "../utils/utils";
import React from "react";
import {Box, SxProps, Theme} from "@mui/material";

type HtmlBlockProps = {
	html: string
	sx?:  SxProps<Theme> | undefined
}
const HtmlBlock = ({html, sx}: HtmlBlockProps) => {
  return (
	  <Box
		  dangerouslySetInnerHTML={{__html: sanitize(html)}}
		  sx={sx}
	  />
  );
};

export default HtmlBlock;