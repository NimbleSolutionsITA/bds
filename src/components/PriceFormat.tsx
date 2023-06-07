import {NumericFormat} from "react-number-format";

type PriceFormatProps = {
	value: number | string,
	prefix?: string
	decimalScale?: number
}
const PriceFormat = ({value, prefix, decimalScale = 2}: PriceFormatProps) => (
	<NumericFormat
		value={value}
		displayType={'text'}
		thousandSeparator={'.'}
		decimalSeparator={','}
		fixedDecimalScale
		prefix={prefix}
		suffix={' €'}
		decimalScale={decimalScale}
	/>
)

export default PriceFormat