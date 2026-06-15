import React from "react";
import {resetCartError} from "../../redux/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {useTranslation} from "next-i18next";
import {getCartErrorMessage} from "../../utils/cartErrors";
import ErrorDialog from "../../components/ErrorDialog";

const CartErrorModal = () => {
	const dispatch = useDispatch();
	const { t } = useTranslation('common');
	const { error } = useSelector((state: RootState) => state.cart);

	return (
		<ErrorDialog
			open={!!error}
			title={t('cart.errors.title')}
			message={getCartErrorMessage(error, t)}
			onClose={() => dispatch(resetCartError())}
		/>
	);
}

export default CartErrorModal;
