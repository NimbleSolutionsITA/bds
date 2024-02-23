import {
	Box,
	Divider,
	Grid,
	Hidden,
	Typography
} from "@mui/material";
import Logo from "./Logo";
import Image from "next/image";
import Link from "next/link";
import PriceFormat from "../../components/PriceFormat";
import {getCartItemPrice, getIsEU} from "../../utils/utils";
import PriceRecap from "./PriceRecap";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {useTranslation} from "next-i18next";

type PROPS = {
	children: React.ReactNode

}
const FinalStepContainer = ({ children }: PROPS) => (
	<Grid container sx={{height: '100vh', position: 'relative', flexDirection: { xs: 'column-reverse' }}}>
		<Grid item xs={12} md={7} sx={{display: 'flex', alignItems: {xs: 'center', md: 'flex-end'}, flexDirection: 'column'}}>
			<div
				style={{
					padding: '0 24px',
					width: '550px',
					maxWidth: '100%',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column'
				}}
			>
				<Logo sx={{margin: '10px'}} />
				<Hidden mdUp>
					<ItemRecap />
					<Divider sx={{margin: '5px 0'}} />
					<PriceRecap isLoading={false} />
					<Divider sx={{margin: '5px 0'}} />
				</Hidden>
				<div style={{width: '100%'}}>
					{ children }
				</div>
			</div>
		</Grid>
		<Grid item xs={12} md={5}
		      sx={{
			      backgroundColor: 'rgba(0,0,0,0.1)',
			      borderRight: '2px solid rgba(0,0,0,0.4)',
			      display: { xs: 'none', md: 'flex'},
			      alignItems: 'flex-start',
			      flexDirection: 'column'
		      }}
		>
			<Box sx={{width: '100%', padding: '0 24px', maxWidth: '400px', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
				<Box sx={{padding: {xs: '0 0 20px', md: '30px 0 20px'}, width: '100%', display: 'flex', flexDirection: 'column'}}>
					<ItemRecap />
					<Divider sx={{margin: '5px 0'}} />
					<PriceRecap isLoading={false} />
				</Box>
			</Box>
		</Grid>
	</Grid>
)

const ItemRecap = () => {
	const {cart} = useSelector((state: RootState) => state.cart);
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
							{t('quantity').toUpperCase()}: {item.quantity.value}
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

export default FinalStepContainer;