import {ReactNode, SyntheticEvent, useState} from "react"
import {Accordion, AccordionSummary, AccordionDetails} from "@mui/material"
import {ExpandMore, Add, Remove} from '@mui/icons-material';

type ExpansionPanelProps = {
	children: ReactNode
	title: ReactNode | string
	plusMinus?: boolean
	color?: 'primary' | 'secondary'
	fontSize?: string | number
}

const ExpansionPanel = ({children ,title, plusMinus, color = "primary", fontSize}: ExpansionPanelProps) => {
	const [expanded, setExpanded] = useState<boolean | string>(false)

	const handleChange = (panel: boolean | string) => (event: SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false)
	}

	const expandIcon = () => {
		if (plusMinus) return expanded ? <Remove color={color} /> : <Add color={color} />
		return <ExpandMore color={color} />
	}

	return (
		<Accordion
			square
			color="secondary"
			elevation={0}
			expanded={expanded === 'panel1'}
			onChange={handleChange('panel1')}
			sx={{
				backgroundColor: 'transparent',
				marginTop: {xs: '10px', md: 0},
				marginBottom: 0,
				textTransform: 'uppercase',
				'&.Mui-expanded': {
					marginBottom: 0,
					marginTop: {xs: '10px', md: 0},
					'&:first-of-type': {
						marginTop: {xs: '10px', md: 0},
					}
				},
				'&::before': {
					display: 'none',
				},
			}}
		>
			<AccordionSummary
				id="panel1bh-header"
				expandIcon={expandIcon()}
				aria-controls="panel1bh-content"
				sx={{
					padding: 0,
					minHeight: '25px',
					fontSize,
					color,
					fontWeight: 500,
					'&.Mui-expanded': {
						minHeight: '25px',
					},
					'& .MuiAccordionSummary-content': {
						margin: '0',
						'&.Mui-expanded': {
							margin: '0',
						},
					},
					'& .MuiAccordionSummary-expandIcon': {
						padding: '5px',
						marginRight: '-8px',
					}
				}}
			>
				{title}
			</AccordionSummary>
			<AccordionDetails style={{ display: 'block', padding: 0, overflowY: 'auto', maxHeight: '220px', paddingBottom: '10px'}}>
				{children}
			</AccordionDetails>
		</Accordion>
	)
}

export default ExpansionPanel