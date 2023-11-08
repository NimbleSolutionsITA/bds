import {useDispatch} from "react-redux";
import {Box, IconButton, Typography} from "@mui/material";
import {DeleteOutlineSharp} from "@mui/icons-material";
import {closeCartDrawer, deleteCartItem} from "../../redux/cartSlice";
import Image from "next/image";
import Minus from "./Minus";
import Plus from "./Plus";
import PriceFormat from "../../components/PriceFormat";
import {useTranslation} from "next-i18next";
import Link from "../../components/Link";
import {Item} from "../../types/cart-type";
import {AppDispatch} from "../../redux/store";

type CartItemProps = {
	item: Item
	loading?: boolean
}
const CartItem = ({item, loading}: CartItemProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const { t } = useTranslation('common')
	console.log(item)
	return (
		<Box sx={{
			border: '1px solid #fff',
			display: 'flex',
			minHeight: '94px',
		}}>
			<div style={{
				width: '25%',
				height: '100%',
				backgroundColor: '#fff',
				display: 'flex',
				alignItems: 'center',
				position: 'relative',
				borderRight: '1px solid #fff',
				opacity: loading ? 0.5 : 1
			}}>
				<Link onClick={() => dispatch(closeCartDrawer())} href={'/products/'+item.slug}>
					<Image
						src={item.featured_image}
						alt={item.name}
						fill
						style={{objectFit: 'contain'}}

					/>
				</Link>
			</div>
			<div style={{width: '75%', padding: '10px', position: 'relative'}}>
				<Typography sx={{fontWeight: 500, lineHeight: '16px', marginBottom: '8px'}}>
					<Link onClick={() => dispatch(closeCartDrawer())} href={'/products/'+item.slug}>
						{item.cart_item_data.category} - {item.name}
					</Link>
					<br />
					<PriceFormat value={Number(item.price) / 100} decimalScale={0} />
				</Typography>
				{Object.keys(item.meta.variation).filter(v => v !== 'parent_id').map(attr => (
					<Typography sx={{fontSize: '12px', lineHeight: '16px'}} key={attr}>
						{attr}: {item.meta.variation[attr]}
					</Typography>
				))}
				<Typography sx={{fontSize: '12px', lineHeight: '16px'}}>
					{t('quantity').toUpperCase()}: <Minus disabled={loading} item={item} />{item.quantity.value}<Plus disabled={loading} item={item} />
				</Typography>
				<IconButton
					size="small"
					onClick={() => dispatch(deleteCartItem({key: item.item_key}))}
					sx={{position: 'absolute', bottom: '5px', right: '5px'}}
					disabled={loading}
				>
					<DeleteOutlineSharp fontSize="small" />
				</IconButton>
			</div>
		</Box>
	)
}

export default CartItem