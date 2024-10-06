import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {getCartItemPrice, getIsEU} from "../../utils/utils";
import {useTranslation} from "next-i18next";
import {Box, Typography} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Minus from "../../layout/cart/Minus";
import Plus from "../../layout/cart/Plus";
import PriceFormat from "../../components/PriceFormat";

const CartRecap = () => {
	const { cart } = useSelector((state: RootState) => state.cart);
	const isEU = getIsEU(cart?.customer)
	const { t } = useTranslation('common');
	return (
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
					<div
						style={{width: 'calc(45% - 20px)', margin: '0 10px', display: 'flex', flexDirection: 'column'}}>
						<Typography sx={{fontSize: '15px', fontWeight: 500, lineHeight: '16px'}}>
							<Link href={'/products/' + item.slug}>{item.name}</Link>
						</Typography>
						<Typography sx={{fontSize: '12px', lineHeight: '16px', marginBottom: '8px'}}>
							{item.cart_item_data.category}
						</Typography>
						<div style={{flexGrow: 1}}/>
						{Object.keys(item.meta.variation).filter(v => v !== 'parent_id').map((v) => (
							<Typography sx={{fontSize: '12px', lineHeight: '16px', textWrap: 'nowrap'}} key={v}>
								{v.toUpperCase()}: {item.meta.variation[v]}
							</Typography>
						))}
						<Typography sx={{fontSize: '12px', lineHeight: '16px'}}>
							{/* eslint-disable-next-line react/jsx-no-undef */}
							{t('quantity').toUpperCase()}: <Minus item={item} />{item.quantity.value}<Plus  item={item}/>
						</Typography>
					</div>
					<Typography component="div" sx={{
						width: '25%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						fontWeight: 500
					}}>
						<PriceFormat value={getCartItemPrice(item, isEU)}/>
					</Typography>
				</Box>
			))}
		</div>
	)
}

export default CartRecap