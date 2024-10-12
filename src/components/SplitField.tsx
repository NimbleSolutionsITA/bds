import {ReactNode} from "react";
import {Box, Typography} from "@mui/material";
import Loading from "./Loading";
import PriceFormat from "./PriceFormat";

const SplitField = ({label, value, isLoading, labelWeight = 300, disabled = false, large = false}: {[key: string]: string|number|boolean|ReactNode, value: string | number}) => (
	<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
		<Typography component="div" sx={{margin: {xs: '2px 0', md: '5px 0'}, textTransform: 'capitalize', fontWeight: labelWeight as number, fontSize: large ? '16px' : undefined}}>
			{label}
		</Typography>
		<Typography component="div" sx={{fontWeight: 500, margin: {xs: '2px 0', md: '5px 0'}, color: disabled ? '#909090' : '#000', fontSize: large ? '18px' : undefined}}>
			{isLoading ? <Loading fontSize="16px" /> : <PriceFormat value={value} />}
		</Typography>
	</Box>
)

export default SplitField;