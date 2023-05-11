import {Review} from "../../../pages/api/google-places";
import {Container, Divider, IconButton, Typography} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import _ from "lodash";
import ThinArrowRight from "../../icons/ThinArrowRight";
import ThinArrowLeft from "../../icons/ThinArrowLeft";

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
			<Carousel
				animation="slide"
				navButtonsAlwaysVisible={true}
				indicators={false}
				NextIcon={<ThinArrowRight sx={{fontSize: '60px'}} />}
				PrevIcon={<ThinArrowLeft sx={{fontSize: '60px'}} />}
				navButtonsProps={{
					style: {
						backgroundColor: 'transparent',
					}
				}}
				sx={{
					maxWidth: '1024px',
					margin: '0 auto'
				}}
			>
				{reviews.map((review, index) => (
					<Container
						key={index}
						maxWidth="sm"
						sx={{
							padding: '24px'
						}}
					>
						<Typography sx={{fontSize: '18px', fontWeight: 500, paddingBottom: '10px'}}>
							{_.startCase(_.toLower(review.author_name))}
						</Typography>
						<Typography>{review.text}</Typography>
					</Container>
				))}
			</Carousel>
		</div>
	)
}

export default BannerTestimonials