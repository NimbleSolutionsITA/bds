import {Button, Container, IconButton, SwipeableDrawer, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {closeCartDrawer, openCartDrawer} from "../../redux/cartSlice";
import {CloseOutlined} from "@mui/icons-material";
import CartItem from "./CartItem";
import Link from "next/link";
import PriceFormat from "../../components/PriceFormat";
import StripePaymentButton from "../../components/StripePaymentButton";
import React from "react";
import {Category, ShippingClass} from "../../types/woocommerce";
import {BaseLayoutProps} from "../../types/settings";
import Chip from "../../components/Chip";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import {
	CHECKOUT_SUB_PATH,
	DESIGNERS_SUB_PATH,
	LIQUIDES_IMAGINAIRES_SUB_PATH,
	PROFUMUM_ROMA_SUB_PATH
} from "../../utils/endpoints";

type CartDrawerProps = {
	shipping: ShippingClass[]
	categories: BaseLayoutProps['categories']
}

const CartDrawer = ({shipping, categories}: CartDrawerProps) => {
	const { cartDrawerOpen, cart, loading } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch()
	const totalItems = cart?.item_count ?? 0
	const subtotal = (Number(cart?.totals?.subtotal ?? 0) + Number(cart?.totals?.subtotal_tax ?? 0)) / 100
	const { t } = useTranslation('common')
	return (
		<SwipeableDrawer
			open={cartDrawerOpen}
			onOpen={() => dispatch(openCartDrawer())}
			onClose={() => dispatch(closeCartDrawer())}
			elevation={0}
			anchor="right"
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
			PaperProps={{
				sx: {
					width: '400px',
					maxWidth: '100%',
					backgroundColor: '#e1e1e1',
				}
			}}
			BackdropProps={{
				sx: {
					backgroundColor: 'transparent'
				}
			}}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative'}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px'}}>
					<Typography variant="h6">
						{t('cart.title')} ({totalItems} {totalItems === 1 ? t('product') : t('products')})
					</Typography>
					<IconButton size="small" onClick={() => dispatch(closeCartDrawer())}>
						<CloseOutlined fontSize="small" />
					</IconButton>
				</div>
				{cart && cart.items && cart.items.length > 0 ? (
					<>
						{cart.items.map((item) => (
							<CartItem key={item.item_key} item={item} loading={loading} />
						))}
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '30px'}}>
							<Typography variant="h6" sx={{textTransform: 'capitalize'}}>{t('subtotal')}</Typography>
							<Typography variant="h6">
								<PriceFormat value={subtotal} decimalScale={0} />
							</Typography>
						</div>
						<Button component={Link} href={`/${CHECKOUT_SUB_PATH}`} disabled={loading}>
							{t('cart.cta')}
						</Button>
						{cartDrawerOpen && (
							<div style={{marginTop: '10px', pointerEvents: loading ? 'none' : 'auto'}}>
								<StripePaymentButton
									items={cart.items.map(item => ({
										product_id: item.meta.product_type === 'variation' ? item.meta.variation.parent_id : item.id,
										variation_id: item.meta.product_type === 'variation' ? item.id : undefined,
										name: item.name,
										price: Number(item.price) / 100,
										priceEU: Number(item.cart_item_data.priceEU ?? '0'),
										qty: item.quantity.value
									}))}
									shipping={shipping}
									isCart
								/>
							</div>
						)}
					</>
				) : (
					<>
						<Typography variant="h4" sx={{textAlign: 'center'}}>
							{t('cart.empty.title')}
						</Typography>
						<Typography sx={{textAlign: 'center'}}>
							{t('cart.empty.subtitle')}
						</Typography>
						<CategoryChips title="Designers" categories={categories.designers} path={`/${DESIGNERS_SUB_PATH}`} />
						<CategoryChips title="Liquides Imaginaries" categories={categories.fragrances.liquides} path={`/${LIQUIDES_IMAGINAIRES_SUB_PATH}`} />
						<CategoryChips title="Profumum Roma" categories={categories.fragrances.profumum} path={`/${PROFUMUM_ROMA_SUB_PATH}`} />
					</>
				)}
			</Container>
		</SwipeableDrawer>
    )
}

type CategoryChipsProps = {
	categories: Category[]
	title: string
	path: string
}

const CategoryChips = ({categories, title, path}: CategoryChipsProps) => {
	const router = useRouter()
	const dispatch = useDispatch()
	return (
		<div style={{marginTop: '40px', textAlign: 'center'}}>
			<Typography variant="h4">{title}</Typography>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0', justifyContent: 'center'}}>
				{categories.map((category) => (
					<Chip
						key={category.slug}
						tag={{name: category.name}}
						onClick={() => {
							dispatch(closeCartDrawer())
							router.push(`${path}/${category.slug}`)
						}}
					/>
				))}
			</div>
		</div>
	)
}
export default CartDrawer