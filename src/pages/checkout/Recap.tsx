import Image from "next/image";
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	FormHelperText,
	Grid,
	Hidden,
	InputLabel,
	MenuItem,
	Select, SelectChangeEvent,
	TextField,
	Typography, useMediaQuery, useTheme,
} from "@mui/material";
import {useFormContext} from "react-hook-form";
import {Step as StepType, Step} from "./CheckoutGrid";
import Link from "next/link";
import PriceFormat from "../../components/PriceFormat";
import {LocalShippingSharp, StorefrontSharp} from "@mui/icons-material";
import Payments from "../../components/Payments";
import PriceRecap from "./PriceRecap";
import Minus from "../../layout/cart/Minus";
import Plus from "../../layout/cart/Plus";
import {useTranslation} from "next-i18next";
import {BaseSyntheticEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {removeCoupon, selectShipping, setCoupon, setCustomerNote} from "../../redux/cartSlice";
import {getCartItemPrice, getIsEU} from "../../utils/utils";
import {useRouter} from "next/router";

type RecapProps = {
	isLoading: boolean
	checkoutStep: Step
	setCheckoutStep: Dispatch<SetStateAction<StepType>>
	updateOrder: (e?: (BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
}
const Recap = ({isLoading, checkoutStep, setCheckoutStep, updateOrder}: RecapProps) => {
	const { formState: { errors } } = useFormContext();
	const { t } = useTranslation('common');
	const { cart, customerNote, loading } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>()
	const canEditData = !isLoading && ['RECAP', 'PAYMENT_STRIPE', 'PAYMENT_PAYPAL'].includes(checkoutStep);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const isEU = getIsEU(cart?.customer)
	const shipping = cart?.shipping?.packages.default
	const shippingRates = shipping?.rates ?? {}
	const hasFreeShipping = Object.values(shippingRates).find(r => r.method_id === 'free_shipping')
	const selectedRate = shipping?.chosen_method
	const hasCoupons = cart.coupons && cart.coupons.length > 0;
	const [couponCode, setCouponCode] = useState(cart.coupons && cart.coupons.length > 0 ? cart.coupons[0].coupon : '');
	const router = useRouter()

	const handleContinue = async () => {
		switch (checkoutStep) {
			case 'ADDRESS':
				await updateOrder()
				if (isMobile)
					setCheckoutStep('RECAP')
				break
			case 'RECAP':
				setCheckoutStep('PAYMENT_STRIPE')
				break;
			case 'PAYMENT_STRIPE':
				await router.push('/checkout/stripe')
				break;
			case 'PAYMENT_PAYPAL':
				await router.push('/checkout/paypal')
				break;

		}
	}

	const handleSetCoupon = () => {
		hasCoupons ?
			dispatch(removeCoupon({
				code: couponCode
			})) :
			dispatch(setCoupon({
				code: couponCode
			}))

	}
	const handleSelectShipping = (e: SelectChangeEvent<string>) => {
		dispatch(selectShipping({
			key: e.target.value
		}))
	}

	return (
		<Box sx={{padding: {xs: '0 0 20px', md: '30px 0 20px'}, width: '100%', display: 'flex', flexDirection: 'column'}}>
			<div style={{padding: '30px 0 20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px'}}>
				{cart?.items?.map((item) => (
					<Box key={item.item_key} sx={{
						display: 'flex',
						height: '100%',
						minHeight: '90px'
					}}>
						<div style={{
							width: '30%',
							height: '100%',
							minHeight: '90px',
							display: 'flex',
							alignItems: 'center',
							position: 'relative',
							backgroundColor: '#fff'
						}}>
							<Image
								src={item.featured_image}
								alt={item.name}
								fill
								style={{objectFit: 'contain'}}

							/>
						</div>
						<div style={{width: 'calc(45% - 20px)', margin: '0 10px', display: 'flex', flexDirection: 'column'}}>
							<Typography sx={{fontSize: '15px', fontWeight: 500, lineHeight: '16px'}}>
								<Link href={'/products/'+item.slug}>{item.name}</Link>
							</Typography>
							<Typography sx={{fontSize: '12px', lineHeight: '16px', marginBottom: '8px'}}>
								{item.cart_item_data.category}
							</Typography>
							<div style={{flexGrow: 1}} />
							{Object.keys(item.meta.variation).filter(v => v !== 'parent_id').map((v) => (
								<Typography sx={{fontSize: '12px', lineHeight: '16px', textWrap: 'nowrap'}} key={v}>
									{v.toUpperCase()}: {item.meta.variation[v]}
								</Typography>
							))}
							<Typography sx={{fontSize: '12px', lineHeight: '16px'}}>
								{/* eslint-disable-next-line react/jsx-no-undef */}
								{t('quantity').toUpperCase()}: <Minus item={item} disabled={!canEditData} />{item.quantity.value}<Plus disabled={!canEditData} item={item} />
							</Typography>
						</div>
						<Typography component="div" sx={{width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 500}}>
							<PriceFormat value={getCartItemPrice(item, isEU)} />
						</Typography>
					</Box>
				))}
			</div>
			<Divider sx={{margin: '5px 0'}} />
			<Grid container spacing={1} sx={{padding: '20px 0', alignItems: 'center', marginBottom: errors.coupon_code ? '7px' : 0}}>
				<Grid item xs={7}>
					<TextField
						disabled={!canEditData || hasCoupons}
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value)}
						fullWidth
						variant="outlined"
						label={t('checkout.coupon-code')}
					/>
				</Grid>
				<Grid item xs={5}>
					<Button
						fullWidth
						onClick={handleSetCoupon}
						disabled={!canEditData || isLoading || loading}
						endIcon={(isLoading || loading) && <CircularProgress size={16} />}
					>
						{t(hasCoupons ? 'checkout.remove' : 'checkout.apply').toUpperCase()}
					</Button>
				</Grid>
			</Grid>
			<Divider sx={{margin: '5px 0'}} />
			{shippingRates && (
				<FormControl fullWidth sx={{margin: '20px 0'}}>
					<InputLabel>{t('checkout.shipping')}</InputLabel>
					<Select
						value={selectedRate}
						onChange={handleSelectShipping}
						disabled={!canEditData}
						variant="outlined"
						label={t('checkout.shipping')}
						sx={{
							'& .MuiSelect-select': {
								paddingLeft: '8px'
							}
						}}

						startAdornment={isLoading ? <CircularProgress size={16} /> : <SelectStartAdornment methodId={selectedRate} />}
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
			)}
			<Divider sx={{margin: '5px 0'}} />
			<FormControl fullWidth sx={{margin: '20px 0'}}>
				<TextField
					variant="outlined"
					label={t('checkout.customer-notes')}
					fullWidth
					multiline
					rows={4}
					value={customerNote}
					onChange={(e) => dispatch(setCustomerNote(e.target.value))}
					disabled={!canEditData}
				/>
			</FormControl>
			<Hidden smDown>
				<Divider sx={{margin: '5px 0'}} />
				<PriceRecap isLoading={isLoading} />
				<Divider sx={{margin: '10px 0 20px'}} />
				<Button
					fullWidth
					onClick={handleContinue}
					disabled={isLoading}
					startIcon={(isLoading) && <CircularProgress size={16} />}
				>
					{checkoutStep !== 'ADDRESS' ? t('checkout.pay-now') : t('checkout.go-to-payment')}
				</Button>
				<Payments />
			</Hidden>
		</Box>
	)
}

const SelectStartAdornment = ({methodId}: {methodId?: string}) => methodId === 'local_pickup' ?
	<StorefrontSharp /> : <LocalShippingSharp />

export default Recap