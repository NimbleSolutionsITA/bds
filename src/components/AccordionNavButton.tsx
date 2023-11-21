import {WooProductCategory} from "../types/woocommerce";
import {MenuItem} from "../types/settings";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavButton from "./NavButton";
import {LIQUIDES_IMAGINAIRES_SUB_PATH, NEXT_SITE_URL} from "../utils/endpoints";
import {LIQUIDES_IMAGINAIRES_CATEGORY} from "../utils/utils";
import React from "react";

type AccordionNavButtonProps = {
	title: string
	items: WooProductCategory[]
	handleClick: (nav: MenuItem) => void
	path: string
}
const AccordionNavButton = ({title, items, handleClick, path}: AccordionNavButtonProps) => (
	<Accordion
		elevation={0}
		sx={{
			width: '100%',
			'&.MuiAccordion-root.MuiPaper-root': {
				border: 'none',
				top: 0,
				height: 'auto',
				'&.Mui-expanded': {
					margin: 0
				}
			},
			'&:before': {
				display: 'none'
			},
		}}
	>
		<AccordionSummary
			expandIcon={<ExpandMoreIcon />}
			sx={{
				padding: '0 8px',
				fontWeight: 500,
				height: '40px',
				minHeight: '40px',
				textTransform: 'uppercase',
				'& .MuiAccordionSummary-content': {
					margin: 0,
					'&.Mui-expanded': {
						margin: 0
					}
				},
				'&.MuiAccordionSummary-root.Mui-expanded': {
					minHeight: '40px',
					height: '40px',
				},
			}}
		>
			{title}
		</AccordionSummary>
		<AccordionDetails sx={{display: 'flex', flexDirection: 'column', alignItems: 'start', padding: 0}}>
			{items.map(category => (
				<NavButton
					key={category.id}
					nav={{
						id: category.id,
						title: category.name,
						url: NEXT_SITE_URL + '/' + (category.parent && [LIQUIDES_IMAGINAIRES_CATEGORY.it, LIQUIDES_IMAGINAIRES_CATEGORY.en].includes(category.parent) ? LIQUIDES_IMAGINAIRES_SUB_PATH : path) + '/' + category.slug,
						child_items: []
					}}
					handleClick={handleClick}
				/>
			))}
		</AccordionDetails>
	</Accordion>
)

export default AccordionNavButton