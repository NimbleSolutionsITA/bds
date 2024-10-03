import {Button, Container, IconButton, SwipeableDrawer, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {closeCartDrawer, openCartDrawer} from "../../redux/cartSlice";
import {CloseOutlined} from "@mui/icons-material";
import CartItem from "./CartItem";
import Link from "next/link";
import PriceFormat from "../../components/PriceFormat";
import React from "react";
import {ShippingClass, WooProductCategory} from "../../types/woocommerce";
import {BaseLayoutProps} from "../../types/settings";
import Chip from "../../components/Chip";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import {
	CHECKOUT_SUB_PATH,
} from "../../utils/endpoints";
import {Item} from "../../types/cart-type";
import {EYEWEAR_CATEGORY, FRAGRANCES_CATEGORY} from "../../utils/utils";

type CartDrawerProps = {
	shipping: ShippingClass[]
	categories: BaseLayoutProps['categories']
}

const CartDrawer = ({categories}: CartDrawerProps) => {
	const { cartDrawerOpen, cart, loading } = useSelector((state: RootState) => state.cart);
	const isEU = !!cart?.customer?.shipping_address?.shipping_country && cart?.customer?.shipping_address?.shipping_country !== 'IT'
	const dispatch = useDispatch()
	const totalItems = cart?.item_count ?? 0
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
							<CartItem
								key={item.item_key}
								item={{
									...item,
									price: (isEU && item.cart_item_data.priceEU) ? (item.cart_item_data.priceEU + '00') : item.price}
							}
								loading={loading}
							/>
						))}
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '30px'}}>
							<Typography variant="h6" sx={{textTransform: 'capitalize'}}>{t('subtotal')}</Typography>
							<Typography variant="h6">
								<PriceFormat value={getSubtotal(cart.items, isEU)} decimalScale={0} />
							</Typography>
						</div>
						<Button component={Link} onClick={() => dispatch(closeCartDrawer())} href={`/${CHECKOUT_SUB_PATH}`} disabled={loading}>
							{t('cart.cta')}
						</Button>
					</>
				) : (
					<>
						<Typography variant="h4" sx={{textAlign: 'center'}}>
							{t('cart.empty.title')}
						</Typography>
						<Typography sx={{textAlign: 'center'}}>
							{t('cart.empty.subtitle')}
						</Typography>
						{categories.filter(c => [FRAGRANCES_CATEGORY.it, FRAGRANCES_CATEGORY.en, EYEWEAR_CATEGORY.it, EYEWEAR_CATEGORY.en].includes(c.id)).map((category) => <CategoryChips key={category.slug} category={category} />)}
					</>
				)}
			</Container>
		</SwipeableDrawer>
    )
}

const getItemPrice = (item: any, isEU: boolean) => {
	return isEU && item.cart_item_data.priceEU ?
		item.cart_item_data.priceEU + '00' :
		item.price
}

const getSubtotal = (items: Item[], isEU: boolean) => {
	return  items.reduce((acc, item) => {
		const price = getItemPrice(item, isEU)
		return (Number(price) * item.quantity.value) / 100

	}, 0)
}

type CategoryChipsProps = {
	category: WooProductCategory
}

const CategoryChips = ({category}: CategoryChipsProps) => {
	const router = useRouter()
	const dispatch = useDispatch()
	return (
		<div style={{marginTop: '40px', textAlign: 'center'}}>
			<Typography variant="h4">{category.name}</Typography>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0', justifyContent: 'center'}}>
				{category.child_items?.map((prodCategory) => (
					<Chip
						key={prodCategory.slug}
						tag={{name: prodCategory.name}}
						onClick={() => {
							dispatch(closeCartDrawer())
							router.push(`${category.slug}/${prodCategory.slug}`)
						}}
					/>
				))}
			</div>
		</div>
	)
}
export default CartDrawer