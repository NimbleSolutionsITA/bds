import {Button, Container, IconButton, SwipeableDrawer, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {closeCartDrawer, openCartDrawer} from "../../redux/cartSlice";
import {CloseOutlined} from "@mui/icons-material";
import CartItem from "./CartItem";

const CartDrawer = () => {
	const { cartDrawerOpen, items } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch()
	const totalItems = items.reduce((previousValue, currentValue) => previousValue + currentValue.qty, 0)
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
						La tua shopping bag ({totalItems} {totalItems === 1 ? 'articolo' : 'articoli'})
					</Typography>
					<IconButton size="small" onClick={() => dispatch(closeCartDrawer())}>
						<CloseOutlined fontSize="small" />
					</IconButton>
				</div>
				{items.map((item) => (
					<CartItem key={item.id} item={item} />
				))}
				{items.length > 0 && (
					<>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '30px'}}>
							<Typography variant="h6">Subtotale</Typography>
							<Typography variant="h6">{items.reduce((previousValue, currentValue) => previousValue + (currentValue.price * currentValue.qty), 0)} €</Typography>
						</div>
						<Button>VAI AL CHECKOUT</Button>
					</>
				)}
			</Container>
		</SwipeableDrawer>
    )
}
export default CartDrawer