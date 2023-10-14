import React, {useEffect, useState} from "react";
import {HomeProps} from "../../../pages";
import {Button, Grid, Typography} from "@mui/material";
import HtmlBlock from "../../components/HtmlBlock";
import Carousel from 'react-material-ui-carousel';
import {motion} from "framer-motion";
import {ArrowBackIosSharp, ArrowForwardIosSharp} from "@mui/icons-material";
import {useTranslation} from "next-i18next";
import Link from "next/link";
import {DESIGNERS_SUB_PATH} from "../../utils/endpoints";
import {calculateImageDarkness} from "../../utils/utils";

type BannerDesignersProps = {
	designers: HomeProps['page']['designers']
}

const BannerDesigners = ({designers}: BannerDesignersProps) => {
	const [activeSlide, setActiveSlide] = useState(0);
	// const [fontColor, setFontColor] = useState('#fff'); // Default to white
	const contentVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};
	const { t } = useTranslation('common');

	/*useEffect(() => {
		designers.slider?.forEach((designer, index) => {
			calculateImageDarkness(designer.image, (imageDarkness: number) => {
				if (imageDarkness <= 0.5) {
					setFontColor('#fff'); // Use white font color for dark images
				} else {
					setFontColor('#000'); // Use black font color for light images
				}
			});
		});
	}, [designers.slider]);*/

	return (
		<Grid container>
			<Grid item xs={12} md={8}>
				<Carousel
					animation="slide"
					autoPlay={false}
					indicators={false}
					navButtonsProps={{
						style: {
							background: 'none',
							color: '#000',
						}
					}}
					NextIcon={<ArrowForwardIosSharp sx={{fontSize: '40px'}} />}
					PrevIcon={<ArrowBackIosSharp sx={{fontSize: '40px'}} />}
					onChange={(next) => setActiveSlide(next as number)}
				>
					{designers.slider?.map((designer, index) => (
						<div
							key={designer.id}
							style={{
								width: '100%',
								height: '70vh',
								backgroundColor: 'black',
								backgroundImage: `url(${designer.image})`,
								backgroundSize: 'cover',
							}}
						>
							<motion.div
								variants={contentVariants}
								initial='hidden'
								animate={activeSlide === index ? 'visible' : 'hidden'}
								transition={{ duration: 0.5 }}
								style={{
									width: '100%',
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									textAlign: 'center'
								}}
							>
								<HtmlBlock
									html={designer.name}
									sx={{
										padding: '20px 80px',
										fontWeight: 500,
										color: '#fff', //fontColor,
										fontSize: '30px',
									}}
								/>
								<Button component={Link} href={`${DESIGNERS_SUB_PATH}/${designer.slug}`}>
									{t('explore-section')}
								</Button>
							</motion.div>
						</div>
					))}
				</Carousel>
			</Grid>
			<Grid item xs={12} md={4}>
				<HtmlBlock
					sx={{
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'end',
						padding: '5% 10%'
					}}
					html={designers.body}
				/>
			</Grid>
		</Grid>
	)
}

export default BannerDesigners;