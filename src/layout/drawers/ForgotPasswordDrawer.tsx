import {Container, IconButton, SwipeableDrawer} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {
	closeForgotPasswordDrawer,
	openForgotPasswordDrawer,
} from "../../redux/layoutSlice";
import {RootState} from "../../redux/store";
import {CloseSharp} from "@mui/icons-material";
import SendPasswordResetEmailForm from "../../pages/my-area/SetPasswordResetEmailForm";

const ForgotPasswordDrawer = () => {
	const { forgotPasswordDrawerOpen } = useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch()
	return (
		<SwipeableDrawer
			anchor="right"
			PaperProps={{
				sx: {
					padding: '20px 0',
					height: 'auto',
					top: '200px',
					right: {
						xs: 0,
						md: '24px'
					},
					width: '400px',
					maxWidth: '100%',
					backgroundColor: '#f1f1f1',
				}
			}}
			open={forgotPasswordDrawerOpen}
			onClose={() => dispatch(closeForgotPasswordDrawer())}
			onOpen={() => dispatch(openForgotPasswordDrawer())}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
				<IconButton onClick={() => dispatch(closeForgotPasswordDrawer())} sx={{position: 'absolute', right: '20px', top: '2px', padding: '4px'}}>
					<CloseSharp />
				</IconButton>
				<SendPasswordResetEmailForm />
			</Container>
		</SwipeableDrawer>
	)
}

export default ForgotPasswordDrawer