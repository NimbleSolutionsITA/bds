import { Grid, Typography, Container} from "@mui/material";
import {StorePageProps} from "../../../pages/negozi-ottica-firenze";
import Image from "next/image";
import HtmlBlock from "../../components/HtmlBlock";

type SliderWithTextProps = {
	staff: StorePageProps['acf']['staff']
}
const StaffBanner = ({staff}: SliderWithTextProps) => {
	return (
		<div style={{backgroundColor: 'rgba(0,0,0,.1)', textAlign: 'center', paddingBottom: '20px'}}>
			<Container>
				<Grid
					container
					spacing={5}
					sx={{
						marginTop: '40px'
					}}
				>
					{staff.map((staffMember) => (
						<Grid key={staffMember.name} item xs={12} sm={6} lg={3} sx={{display: 'flex', flexDirection: 'column'}}>
							<div style={{width: '100%', height: '400px', position: 'relative'}}>
								<Image
									src={staffMember.photo}
									alt={staffMember.name}
									fill
									style={{objectFit: 'cover', objectPosition: 'center center'}}
								/>
							</div>
							<Typography sx={{fontWeight: 500, padding: '20px 0 0', textAlign: 'center'}}>
								{staffMember.name}
							</Typography>
							<HtmlBlock html={staffMember.bio} component={Typography} sx={{fontSize: '12px', textAlign: 'left'}} />
						</Grid>
					))}
				</Grid>
			</Container>
		</div>
	);
}



export default StaffBanner;
