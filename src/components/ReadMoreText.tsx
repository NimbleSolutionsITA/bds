import React, {useEffect, useRef, useState} from "react";
import { Typography, Box, Button, Collapse } from "@mui/material";
import {sanitize} from "../utils/utils";
import {useTranslation} from "next-i18next";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ReadMoreProps {
	text: string;
}

const ReadMoreText: React.FC<ReadMoreProps> = ({ text }) => {
	const [expanded, setExpanded] = useState(false);
	const [isExpandable, setIsExpandable] = useState(false);
	const { t } = useTranslation();
	const textRef = useRef<HTMLDivElement>(null);

	const handleToggle = () => setExpanded((prev) => !prev);

	useEffect(() => {
		const checkTextLength = () => {
			if (textRef.current) {
				// Create a hidden div to measure the text height
				const tempDiv = document.createElement("div");
				tempDiv.style.position = "absolute";
				tempDiv.style.visibility = "hidden";
				tempDiv.style.width = "100%";
				tempDiv.style.fontSize = "1rem"; // Match the font size you use for the collapsed text
				tempDiv.style.lineHeight = "1.5"; // Match the line height for your text
				tempDiv.style.display = "block";
				tempDiv.innerHTML = sanitize(text);

				document.body.appendChild(tempDiv);
				const textHeight = tempDiv.clientHeight;
				const collapseHeight = parseFloat("4.5em") * parseFloat(window.getComputedStyle(document.documentElement).fontSize); // Convert em to pixels
				document.body.removeChild(tempDiv);
				console.log(textHeight, collapseHeight);

				// If the text height exceeds the collapse height, mark it as expandable
				setIsExpandable(textHeight > collapseHeight);
			}
		};

		checkTextLength();
	}, [text]);

	return (
		<Box sx={{ width: "100%" }}>
			{/* Collapsible Text */}
			<Collapse in={expanded} collapsedSize="4.5em" timeout="auto">
				<Typography
					ref={textRef}
					component="div"
					sx={{
						overflow: "hidden",
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: expanded ? "none" : 3,
					}}
					dangerouslySetInnerHTML={{ __html: sanitize(text) }}
				/>
			</Collapse>

			{/* Toggle Button */}
			{isExpandable && !expanded && (
				<Button endIcon={<ExpandMoreIcon />} variant="text" onClick={handleToggle} sx={{ fontWeight: 300, textTransform: "capitalize" }}>
					{t("read-more")}
				</Button>
			)}
		</Box>
	);
};

export default ReadMoreText;
