import {CartItem} from "../../redux/cartSlice";
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
	Select,
	TextField,
	Typography,
} from "@mui/material";
import {Control, Controller, FieldErrors} from "react-hook-form";
import {ShippingMethod} from "../../types/woocommerce";
import {CheckoutCartItem, Inputs} from "./CheckoutGrid";
import Link from "next/link";
import PriceFormat from "../../components/PriceFormat";
import {LocalShippingSharp, StorefrontSharp} from "@mui/icons-material";
import Payments from "../../components/Payments";
import PriceRecap from "./PriceRecap";
import HelperText from "../../components/HelperText";
import Minus from "../../layout/cart/Minus";
import Plus from "../../layout/cart/Plus";
import {useTranslation} from "next-i18next";

type RecapProps = {
	control: Control<Inputs>
	setCoupon: () => void
	shippingMethods?: ShippingMethod[]
	shippingMethod?: ShippingMethod
	subtotal: number
	prices: {
		total: number
		totalTax: number
		shipping: number
		shippingTax: number
		discount: number
		discountTax: number
		cartTax: number
	}
	items: (CheckoutCartItem | CartItem)[]
	isLoading: boolean
	errors: FieldErrors<Inputs>
	recapAction: () => void
	checkoutStep: number
}
const Recap = ({shippingMethods, control, setCoupon, shippingMethod, subtotal, items, prices, isLoading, errors, recapAction, checkoutStep}: RecapProps) => {
	const { t } = useTranslation('common');
	console.log(t('shipping.line1'))
	return (
		<Box sx={{padding: {xs: '0 0 20px', md: '30px 0 20px'}, width: '100%', display: 'flex', flexDirection: 'column'}}>
			<div style={{padding: '30px 0 20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px'}}>
				{items.map((item) => (
					<Box key={(item.variation_id ?? 0) + item.product_id} sx={{
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
								src={item.image}
								alt={item.name}
								fill
								style={{objectFit: 'contain'}}

							/>
						</div>
						<div style={{width: 'calc(45% - 20px)', margin: '0 10px', display: 'flex', flexDirection: 'column'}}>
							<Typography sx={{fontSize: '15px', fontWeight: 500, lineHeight: '16px'}}>
								<Link href={'/products'+item.slug}>{item.name}</Link>
							</Typography>
							<Typography sx={{fontSize: '12px', lineHeight: '16px', marginBottom: '8px'}}>
								{item.category}
							</Typography>
							<div style={{flexGrow: 1}} />
							{item.attributes.map((attribute) => (
								<Typography sx={{fontSize: '12px', lineHeight: '16px'}} key={attribute.id}>
									{t('attributes.'+attribute.id).toUpperCase()}: {attribute.name}
								</Typography>
							))}
							<Typography sx={{fontSize: '12px', lineHeight: '16px'}}>
								{/* eslint-disable-next-line react/jsx-no-undef */}
								{t('quantity').toUpperCase()}: <Minus item={item} disabled={isLoading || checkoutStep > 2} />{item.qty}<Plus disabled={isLoading || checkoutStep > 2} item={item} />
							</Typography>
						</div>
						<Typography component="div" sx={{width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 500}}>
							<PriceFormat value={Number(item.price) * item.qty} />
						</Typography>
					</Box>
				))}
			</div>
			<Divider sx={{margin: '5px 0'}} />
			<Grid container spacing={1} sx={{padding: '20px 0', alignItems: 'center', marginBottom: errors.coupon_code ? '7px' : 0}}>
				<Grid item xs={7}>
					<Controller
						control={control}
						name="coupon_code"
						render={({ field }) => (
							<TextField
								{...field}
								disabled={isLoading || checkoutStep > 2}
								fullWidth
								variant="outlined"
								label={t('checkout.coupon-code')}
								helperText={<HelperText message={errors.coupon_code?.message} absolute />}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={5}>
					<Button
						fullWidth
						onClick={setCoupon}
						disabled={isLoading || checkoutStep > 2}
						endIcon={isLoading && <CircularProgress size={16} />}
					>
						{t('checkout.apply').toUpperCase()}
					</Button>
				</Grid>
			</Grid>
			<Divider sx={{margin: '5px 0'}} />
			<Controller
				control={control}
				name="shipping_method"
				render={({ field }) => (
					<FormControl fullWidth sx={{margin: '20px 0'}}>
						<InputLabel>{t('checkout.shipping')}</InputLabel>
						<Select
							{...field}
							onChange={(e) => field.onChange(e.target.value)}
							disabled={isLoading || checkoutStep > 2}
							variant="outlined"
							label={t('checkout.shipping')}
							sx={{
								'& .MuiSelect-select': {
									paddingLeft: '8px'
								}
							}}
							startAdornment={isLoading ? <CircularProgress size={16} /> : <SelectStartAdornment methodId={shippingMethod?.methodId} />}

						>
							{shippingMethods?.map((method) => (
								<MenuItem key={method.methodId} value={method.methodId}>
									{method.title}
									{parseFloat(method.cost) > 0 && (
										<> (<PriceFormat value={parseFloat(method.cost)} />)</>
									)}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>
							{errors?.shipping_method?.message ?? ''}
						</FormHelperText>
					</FormControl>
				)}
			/>
			<Hidden smDown>
				<Divider sx={{margin: '5px 0'}} />
				<PriceRecap
					subtotal={subtotal}
					cartTax={prices.cartTax}
					shipping={prices.shipping}
					discount={prices.discount}
					discountTax={prices.discountTax}
					total={prices.total}
					totalTax={prices.totalTax}
					isLoading={isLoading}
				/>
				<Divider sx={{margin: '10px 0 20px'}} />
				<Button
					fullWidth
					onClick={recapAction}
					disabled={isLoading || checkoutStep > 4}
					startIcon={(isLoading || checkoutStep === 4.5) && <CircularProgress size={16} />}
				>
					{(checkoutStep === 3 || checkoutStep === 4.5) ? t('checkout.pay-now') : t('checkout.go-to-payment')}
				</Button>
				<Payments />
			</Hidden>
		</Box>
	)
}

const SelectStartAdornment = ({methodId}: {methodId?: string}) => methodId === 'local_pickup' ?
	<StorefrontSharp /> : <LocalShippingSharp />

export default Recap