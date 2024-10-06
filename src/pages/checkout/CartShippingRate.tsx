import {useFormContext} from "react-hook-form";
import {useTranslation} from "next-i18next";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {
	CircularProgress,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent
} from "@mui/material";
import {selectShipping} from "../../redux/cartSlice";
import PriceFormat from "../../components/PriceFormat";
import {LocalShippingSharp, StorefrontSharp} from "@mui/icons-material";

const CartShippingRate = () => {
	const { formState: { errors } } = useFormContext();
	const { t } = useTranslation('common');
	const { cart, loading } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>()
	const shipping = cart?.shipping?.packages.default
	const shippingRates = shipping?.rates ?? {}
	const hasFreeShipping = Object.values(shippingRates).find(r => r.method_id === 'free_shipping')
	const selectedRate = shipping?.chosen_method

	const handleSelectShipping = (e: SelectChangeEvent<string>) => {
		dispatch(selectShipping({ key: e.target.value }))
	}

	return selectedRate ? (
		<FormControl fullWidth sx={{margin: '20px 0'}}>
			<InputLabel>{t('checkout.shipping')}</InputLabel>
			<Select
				value={selectedRate}
				onChange={handleSelectShipping}
				variant="outlined"
				label={t('checkout.shipping')}
				sx={{
					'& .MuiSelect-select': {
						paddingLeft: '8px'
					}
				}}

				startAdornment={loading ? <CircularProgress size={16} /> : <SelectStartAdornment methodId={selectedRate} />}
			>
				{Object.values(shippingRates).filter(r => !hasFreeShipping || r.cost === '0').map((method) => (
					<MenuItem key={method.key} value={method.key}>
						{method.label}
						{Number(method.cost) > 0 && (
							<> (<PriceFormat value={Number(method.cost) / 100} />)</>
						)}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>
				{errors?.shipping_method?.message as string ?? ''}
			</FormHelperText>
		</FormControl>
	) : null
}

const SelectStartAdornment = ({methodId}: { methodId?: string }) => methodId === 'local_pickup' ?
	<StorefrontSharp/> : <LocalShippingSharp/>

export default CartShippingRate