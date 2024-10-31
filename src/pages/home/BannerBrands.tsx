import {HomeProps} from "../../../pages";
import {Box, Button, Grid, Typography} from "@mui/material";
import {AcfAdvancedLink, AcfImage} from "../../types/woocommerce";
import React from "react";
import Link from "../../components/Link";
import Image from "next/image";

const BannerBrands = ({isActive, left, center, title, right}: {
	isActive: boolean
	title: string
	left: {
		title: string
		photo: AcfImage
		link: AcfAdvancedLink
	},
	center: {
		title: string
		photo: AcfImage
		link: AcfAdvancedLink
	},
	right: {
		title: string
		photo: AcfImage
		link: AcfAdvancedLink
	}
}) => isActive ? (
	<div>
		{title && (
			<Typography variant="h1" component="div" sx={{margin: '20px 0 30px', textAlign: 'center'}}>
				{title}
			</Typography>
		)}
		<Grid container sx={{minHeight: '60vh', alignItems: 'end'}}>
			<Brand {...left} />
			<Brand {...center} />
			<Brand {...right} />
		</Grid>
	</div>
) : null

const Brand = ({title, photo, link}: {
	title: string
	photo: AcfImage
	link: AcfAdvancedLink
}) => (
	<Grid item xs={12} md={4} sx={{
		cursor: 'pointer',
		position: 'relative',
		overflow: 'hidden',
		":hover": {
			".brand-cta": {
				transform: 'translateY(0)',
				opacity: 1,
				transition: 'transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0.09s'
			},
			'img': {
				transform: 'scale(1.05)'
			}
		}
	}}>
		<Box
			component={Link}
			href={link.url}
			sx={{
				textDecoration: 'none',
				width: '100%',
				height: '100%',
			}}
		>
			<Box
				sx={{
					width: '100%',
					minHeight: {
						xs: '150vw',
						md: '50vw'
					},
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: 2,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					alignItems: 'center',
				}}
			>
				<span />
				<Typography
					sx={{
						color: 'white',
						fontSize: '30px',
						textTransform: 'uppercase',
						fontFamily: "Ogg Roman",
						fontWeight: 900
					}}
				>
					{title}
				</Typography>
				<Typography
					className="brand-cta"
					sx={{
						fontSize: '20px',
						marginBottom: '20px',
						fontWeight: 'bold',
						color: 'white',
						opacity: 0,
						transform: "translateY(calc(100% + 50px))",
						transition: 'transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) 0s',
					}}
				>
					{link.title} {">"}
				</Typography>
			</Box>
		</Box>
		<Box
			sx={{
				width: '100%',
				paddingBottom: {
					xs: '150vw',
					md: '50vw'
				},
				position: 'absolute',
				top: 0,
				left: 0,
				zIndex: 20,
				backgroundColor: "black",
				opacity: 0.2
			}}
		/>
		<Box
			sx={{
				width: '100%',
				minHeight: {
					xs: '150vw',
					md: '50vw'
				},
			}}
		>
			<Image
				src={photo.url}
				alt={photo.title}
				fill
				style={{
					objectFit: 'cover',
					objectPosition: 'center center',
					transition: 'transform 2s ease'
				}}
			/>
		</Box>
	</Grid>
)

export default BannerBrands;