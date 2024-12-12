import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {useState} from "react";
import {useTranslation} from "next-i18next";
import {removeCoupon, setCoupon} from "../../redux/cartSlice";
import {Button, CircularProgress, Grid2 as Grid, TextField} from "@mui/material";
import {useFormContext} from "react-hook-form";
import usePayPalCheckout from "../../components/PayPalCheckoutProvider";

const CartCoupon = () => {
	const { cart, loading } = useSelector((state: RootState) => state.cart);
	const {formState: { errors }} = useFormContext()
	const hasCoupons = cart?.coupons && cart?.coupons.length > 0;
	const dispatch = useDispatch<AppDispatch>()
	const [couponCode, setCouponCode] = useState(cart?.coupons && cart?.coupons.length > 0 ? cart?.coupons[0].coupon : '');
	const { t } = useTranslation('common');
	const {isPaying} = usePayPalCheckout()

	const handleSetCoupon = () => {
		hasCoupons ?
			dispatch(removeCoupon({ code: couponCode })) :
			dispatch(setCoupon({code: couponCode }))
	}

	return (
		<Grid container spacing={1} sx={{padding: '20px 0', alignItems: 'center', marginBottom: errors.coupon_code ? '7px' : 0}}>
			<Grid size={{xs: 7}}>
				<TextField
					disabled={hasCoupons}
					value={couponCode}
					onChange={(e) => setCouponCode(e.target.value)}
					fullWidth
					variant="outlined"
					label={t('checkout.coupon-code')}
				/>
			</Grid>
			<Grid size={{xs: 5}}>
				<Button
					fullWidth
					onClick={handleSetCoupon}
					disabled={loading || isPaying}
					endIcon={(loading|| isPaying) && <CircularProgress size={16} />}
				>
					{t(hasCoupons ? 'checkout.remove' : 'checkout.apply').toUpperCase()}
				</Button>
			</Grid>
			<Grid size={{xs: 12}}>
				<span style={{fontStyle: "italic", color: "#333333", fontSize: "12px"}}>{t("newsletter.subtitle")}</span>
			</Grid>
		</Grid>
	)
}

export default CartCoupon