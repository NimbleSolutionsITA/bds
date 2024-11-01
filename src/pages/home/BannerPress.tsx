import {Press} from "../../../pages";
import {Box, Container, Grid2, Typography} from "@mui/material";

const BannerPress = ({background, quotes, title}: Press) => (
	<Box sx={{
		backgroundImage: `url(${background})`,
		backgroundSize: "cover",
		backgroundPosition: "center center",
		paddingY: "100px",
		position: "relative",
	}}>
		<Box sx={{
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			background: "rgba(87,78,70,0.5)",
			mixBlendMode: "darken"
		}}/>
		<Container maxWidth="lg" sx={{color: "#FFFFFF", position: "relative"}}>
			<Typography sx={{textAlign: "center", marginBottom: "120px"}} variant="h1" component="h2">{title}</Typography>
			<Grid2 container spacing={3}>
				{quotes.map(({body, author}, i) => (
					<Grid2 key={i} size={{xs: 12, md: 4}}>
						<span style={{fontFamily: "serif", fontSize: "100px", lineHeight: "30px", letterSpacing: -10}}>&#8220;</span>
						<Typography variant="body1">{body}</Typography>
						<Typography sx={{marginTop: "24px"}} variant="body2">
							-<br />
							{author}
						</Typography>
					</Grid2>
				))}
			</Grid2>
		</Container>
	</Box>
)

export default BannerPress;