import {useTranslation} from "next-i18next";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {FormControl, TextField} from "@mui/material";
import {setCustomerNote} from "../../redux/cartSlice";

const CartNote = () => {
	const { t } = useTranslation('common');
	const dispatch = useDispatch<AppDispatch>()
	const { customerNote } = useSelector((state: RootState) => state.cart);
	return (
		<FormControl fullWidth sx={{margin: '20px 0'}}>
			<TextField
				variant="outlined"
				label={t('checkout.customer-notes')}
				fullWidth
				multiline
				rows={4}
				value={customerNote}
				onChange={(e) => dispatch(setCustomerNote(e.target.value))}
			/>
		</FormControl>
	)
}

export default CartNote