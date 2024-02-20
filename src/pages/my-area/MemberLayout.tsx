import {Box, Button, Container} from "@mui/material";
import Link from "../../components/Link";

type MemberLayoutProps = {
	children: React.ReactNode
}
const MemberLayout = ({children}: MemberLayoutProps) => {
	const sideMenu = [
		{ label: 'Profile', href: '/my-area/profile' },
		{ label: 'Addresses', href: '/my-area/addresses' },
		{ label: 'Orders', href: '/my-area/orders' },
	]
	return (
		<Container sx={{display: 'flex'}}>
			<Box sx={{width: '250px', display: 'flex', flexDirection: 'column'}}>
				{sideMenu.map(item => (
					<Box key={item.label} sx={{padding: '10px 0'}}>
						<Link href={item.href}>
							{item.label}
						</Link>
					</Box>
				))}
			</Box>
			<Box sx={{flexGrow: 1}}>
				{children}
			</Box>
		</Container>
	)
}

export default MemberLayout