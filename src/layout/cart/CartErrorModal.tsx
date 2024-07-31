import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {resetCartError} from "../../redux/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";

const CartErrorModal = () => {
	const dispatch = useDispatch();
	const { error } = useSelector((state: RootState) => state.cart);
	const handleClose = () => {
		dispatch(resetCartError());
	};

	return (
		<Dialog
			open={!!error}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				CART ERROR
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<div  dangerouslySetInnerHTML={{__html: error?.message ?? "" }} />
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} autoFocus>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CartErrorModal;