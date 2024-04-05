import {Container, IconButton, SwipeableDrawer} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeLogInDrawer, openLogInDrawer} from "../../redux/layoutSlice";
import {RootState} from "../../redux/store";
import {CloseSharp} from "@mui/icons-material";
import LogInForm from "../../pages/my-area/LoginForm";
import useAuth from "../../utils/useAuth";

const LogInDrawer = () => {
	const { logInDrawerOpen } = useSelector((state: RootState) => state.layout);
	const dispatch = useDispatch()
	const { loggedIn } = useAuth();
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
			open={logInDrawerOpen && !loggedIn}
			onClose={() => dispatch(closeLogInDrawer())}
			onOpen={() => dispatch(openLogInDrawer())}
		>
			<Container sx={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
				<IconButton onClick={() => dispatch(closeLogInDrawer())} sx={{position: 'absolute', right: '20px', top: '2px', padding: '4px'}}>
					<CloseSharp />
				</IconButton>
				<LogInForm />
			</Container>
		</SwipeableDrawer>
	)
}

export default LogInDrawer