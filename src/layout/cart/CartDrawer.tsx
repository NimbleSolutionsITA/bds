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
	FRAGRANCES_SUB_PATH,
	LIQUIDES_IMAGINAIRES_SUB_PATH,
	PROFUMUM_ROMA_SUB_PATH
} from "../../utils/endpoints";

type CartDrawerProps = {
	shipping: ShippingClass[]
	categories: BaseLayoutProps['categories']
}

const CartDrawer = ({shipping, categories}: CartDrawerProps) => {
	const { cartDrawerOpen, items } = useSelector((state: RootState) => state.cart);{}
	const dispatch = useDispatch()
	const totalItems = items.reduce((previousValue, currentValue) => previousValue + currentValue.qty, 0)
	const subtotal = items.reduce((previousValue, currentValue) => previousValue + (currentValue.price * currentValue.qty), 0)
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
				{items.length > 0 ? (
					<>
						{items.map((item) => (
							<CartItem key={item.variation_id??''+item.product_id} item={item} />
						))}
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '30px'}}>
							<Typography variant="h6" sx={{textTransform: 'capitalize'}}>{t('subtotal')}</Typography>
							<Typography variant="h6">
								<PriceFormat value={subtotal} decimalScale={0} />
							</Typography>
						</div>
						<Button component={Link} href={`/${CHECKOUT_SUB_PATH}`}>{t('cart.cta')}</Button>
						{cartDrawerOpen && (
							<div style={{marginTop: '10px'}}>
								<StripePaymentButton  items={items} shipping={shipping} />
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