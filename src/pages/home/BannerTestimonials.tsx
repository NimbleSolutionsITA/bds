import {Review} from "../../../pages/api/google-places";
import {Box, Container, Divider, Typography} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import _ from "lodash";
import {ArrowBackIosSharp, ArrowForwardIosSharp} from "@mui/icons-material";

type BannerTestimonialsProps = {
	reviews: Array<Review>
}

const BannerTestimonials = ({reviews}: BannerTestimonialsProps) => {
	return (
		<div style={{
			backgroundColor: '#F4F4F4',
			textAlign: 'center',
			padding: '20px 0'
		}}>
			<Typography variant="h1" sx={{
				padding: '0 24px 14px',
			}}>
				Testimonials
			</Typography>
			<Divider />
			<Container
				maxWidth="md"
				sx={{
					padding: '24px',
					display: 'flex',
					alignItems: 'center',
					height: {
						xs: '350px',
						md: '250px'
					}
				}}
			>
				<Carousel
					animation="slide"
					navButtonsAlwaysVisible={true}
					indicators={false}
					NextIcon={<ArrowForwardIosSharp color="disabled" sx={{fontSize: '60px', display: {xs:'none', md: 'block'}}} />}
					PrevIcon={<ArrowBackIosSharp color="disabled" sx={{fontSize: '60px', display: {xs:'none', md: 'block'}}} />}
					navButtonsProps={{
						style: {
							backgroundColor: 'transparent',
						}
					}}
					sx={{
						width: '100%',
						margin: '0 auto'
					}}
				>
					{reviews.map((review) => (
						<Box sx={{width: '100%', height: '100%', padding: {xs: 0, md: '20px 120px'}}} key={review.text}>
							<Typography sx={{fontSize: '18px', fontWeight: 500, paddingBottom: '10px'}}>
								{_.startCase(_.toLower(review.author_name))}
							</Typography>
							<Typography>{review.text}</Typography>
						</Box>
					))}
				</Carousel>
			</Container>
		</div>
	)
}

export default BannerTestimonials