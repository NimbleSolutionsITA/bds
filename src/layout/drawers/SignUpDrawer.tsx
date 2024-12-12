import {Container, IconButton, SwipeableDrawer} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeSignUpDrawer, openSignUpDrawer} from "../../redux/layoutSlice";
import {RootState} from "../../redux/store";
import {CloseSharp} from "@mui/icons-material";
import SignUpForm from "../../pages/my-area/SignUpForm";

const SignUpDrawer = () => {
	const { signUpDrawerOpen } = useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch()
	return (
		<SwipeableDrawer
			anchor="right"
			sx={{zIndex: 1300}}
			PaperProps={{
				sx: {
					padding: '20px 0',
					height: 'auto',
					top: {
						xs: 0,
						md: '10%'
					},
					right: {
						xs: 0,
						md: '24px'
					},
					width: '400px',
					maxWidth: '100%',
					backgroundColor: '#f1f1f1',
				}
			}}
			open={signUpDrawerOpen}
			onClose={() => dispatch(closeSignUpDrawer())}
			onOpen={() => dispatch(openSignUpDrawer())}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
				<IconButton onClick={() => dispatch(closeSignUpDrawer())} sx={{position: 'absolute', right: '20px', top: '2px', padding: '4px'}}>
					<CloseSharp />
				</IconButton>
				<SignUpForm />
			</Container>
		</SwipeableDrawer>
	)
}

export default SignUpDrawer