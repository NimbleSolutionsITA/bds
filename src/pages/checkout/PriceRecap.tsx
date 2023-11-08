import {ReactNode} from "react";
import {Box, Divider, Typography} from "@mui/material";
import Loading from "../../components/Loading";
import PriceFormat from "../../components/PriceFormat";
import {Trans} from "react-i18next";
import {useTranslation} from "next-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

const PriceRecap = ({ isLoading }: { isLoading: boolean }) => {
	const {t} = useTranslation('common');
	const { cart, loading } = useSelector((state: RootState) => state.cart);
	const subtotal= (Number(cart?.totals?.subtotal) + Number(cart?.totals?.subtotal_tax)) / 100
	const shipping = (Number(cart?.totals?.shipping_total) + Number(cart?.totals?.shipping_tax)) / 100
	const discount = Number(cart?.totals?.discount_total) / 100
	const discountTax = Number(cart?.totals?.discount_tax) / 100
	const total= Number(cart?.totals?.total) / 100
	const totalTax= Number(cart?.totals?.total_tax) / 100

	return (
		<>
			<SplitField label={t('subtotal')} value={subtotal} isLoading={loading || isLoading} />
			<SplitField label={t('checkout.shipping')} value={shipping} isLoading={loading || isLoading} />
			{discount > 0 && (
				<SplitField label={t('discount')} value={-(discount + discountTax)} isLoading={loading || isLoading} />
			)}
			<Divider sx={{margin: {xs: '2px 0', md: '5px 0'}}} />
			<SplitField label={t('total')} value={total} labelWight={500} isLoading={loading || isLoading} large />
			<div style={{fontWeight: 300, color: '#333333', fontSize: '11px', marginTop: '-8px'}}>
				(<Trans i18nKey="checkout.vat-included" components={[<PriceFormat key={0} value={totalTax} />]} />)
			</div>
		</>
	)
}

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
export default PriceRecap;