import {ReactNode} from "react";
import {Box, Divider, Typography} from "@mui/material";
import Loading from "../../components/Loading";
import PriceFormat from "../../components/PriceFormat";

type PriceRecapProps = {
	shipping: number
	discount: number
	subtotal: number
	total: number
	totalTax: number
	isLoading: boolean
}
const PriceRecap = ({shipping, discount, subtotal, total, totalTax, isLoading}: PriceRecapProps) => {
	return (
		<>
			<SplitField label="Subtotale" value={subtotal} isLoading={isLoading} />
			<SplitField label="Spedizione" value={shipping} isLoading={isLoading} />
			{discount > 0 && (
				<SplitField label="Sconto" value={discount} isLoading={isLoading} />
			)}
			<Divider sx={{margin: {xs: '2px 0', md: '5px 0'}}} />
			<SplitField label="Totale" value={total} labelWight={500} isLoading={isLoading} large />
			<div style={{fontWeight: 300, color: '#333333', fontSize: '11px', marginTop: '-8px'}}>
				(inclusi <PriceFormat value={totalTax} /> IVA)
			</div>
		</>
	)
}

const SplitField = ({label, value, isLoading, labelWeight = 300, disabled = false, large = false}: {[key: string]: string|number|boolean|ReactNode, value: string | number}) => (
	<Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
		<Typography component="div" sx={{margin: {xs: '2px 0', md: '5px 0'}, fontWeight: labelWeight as number, fontSize: large ? '16px' : undefined}}>
			{label}
		</Typography>
		<Typography component="div" sx={{fontWeight: 500, margin: {xs: '2px 0', md: '5px 0'}, color: disabled ? '#909090' : '#000', fontSize: large ? '18px' : undefined}}>
			{isLoading ? <Loading fontSize="16px" /> : <PriceFormat value={value} />}
		</Typography>
	</Box>
)
export default PriceRecap;