import {NumericFormat} from "react-number-format";

type PriceFormatProps = {
	value: number | string,
	prefix?: string
}
const PriceFormat = ({value, prefix}: PriceFormatProps) => (
	<NumericFormat
		value={value}
		displayType={'text'}
		thousandSeparator={'.'}
		decimalSeparator={','}
		fixedDecimalScale
		prefix={prefix}
		suffix={' €'}
		decimalScale={2}
	/>
)

export default PriceFormat