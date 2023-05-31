import {useDispatch} from "react-redux";
import {CartItem, CartItem as CartItemType, updateCartItem} from "../../redux/cartSlice";
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
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import {AddCircleOutlineSharp, RemoveCircleOutlineSharp} from '@mui/icons-material';
import {Control, Controller, FieldErrors} from "react-hook-form";
import {ShippingMethod} from "../../types/woocommerce";
import {CheckoutCartItem, Inputs} from "./CheckoutGrid";
import Link from "next/link";
import {ReactNode} from "react";
import PriceFormat from "../../components/PriceFormat";
import {LocalShippingSharp, StorefrontSharp} from "@mui/icons-material";
import Payments from "../../components/Payments";
import Loading from "../../components/Loading";
import PriceRecap from "./PriceRecap";
import HelperText from "../../components/HelperText";

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
									{attribute.id.toString().replace("pa_", "").toUpperCase()}: {attribute.name}
								</Typography>
							))}
							<Typography sx={{fontSize: '12px', lineHeight: '16px'}}>
								QUANTITÀ: <Minus item={item} disabled={isLoading || checkoutStep > 2} />{item.qty}<Plus disabled={isLoading || checkoutStep > 2} item={item} />
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
								label="Coupon code"
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
						APPLICA
					</Button>
				</Grid>
			</Grid>
			<Divider sx={{margin: '5px 0'}} />
			<Controller
				control={control}
				name="shipping_method"
				render={({ field }) => (
					<FormControl fullWidth sx={{margin: '20px 0'}}>
						<InputLabel>Spedizione</InputLabel>
						<Select
							{...field}
							disabled={isLoading || checkoutStep > 2}
							variant="outlined"
							label="Spedizione"
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
					{(checkoutStep === 3 || checkoutStep === 4.5) ? 'PAGA ORA' : 'VAI AL PAGAMENTO'}
				</Button>
				<Payments />
			</Hidden>
		</Box>
	)
}

type CartButtonProps = {
	item: CartItemType
	disabled?: boolean
}

const Plus = ({item, disabled}:CartButtonProps) => {
	const dispatch = useDispatch()
	return (
		<IconButton
			disabled={item.stock_quantity <= item.qty || disabled}
			size="small"
			onClick={() => dispatch(updateCartItem({
				product_id: item.product_id,
				variation_id: item.variation_id,
				qty: item.qty + 1
			}))}
		>
			<AddCircleOutlineSharp sx={{fontSize: '16px'}} />
		</IconButton>
	)
}
const Minus = ({item, disabled}: CartButtonProps) => {
	const dispatch = useDispatch()
	return (
		<IconButton
			size="small"
			disabled={item.qty <= 1 || disabled}
			onClick={() => dispatch(updateCartItem({
				product_id: item.product_id,
				variation_id: item.variation_id,
				qty: item.qty - 1
			}))}
		>
			<RemoveCircleOutlineSharp sx={{fontSize: '16px'}} />
		</IconButton>
	)
}

const SelectStartAdornment = ({methodId}: {methodId?: string}) => methodId === 'local_pickup' ?
	<StorefrontSharp /> : <LocalShippingSharp />

export default Recap