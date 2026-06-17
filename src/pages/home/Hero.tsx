import FullPageSlider from "../../components/FullPageSlider";
import React, { useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import Link from "../../components/Link";
import { HeroProps } from "../../../pages";
import { useTranslation } from "next-i18next";

type HeroWithCallbackProps = HeroProps & {
	onLoadComplete?: () => void;
};

const Hero = ({ images, video, buttonVariant, buttonColor, onLoadComplete }: HeroWithCallbackProps) => {
	const { t } = useTranslation('common');
	const videoRef = useRef<HTMLVideoElement>(null);

	// Run once: if video, wait until it can play
	useEffect(() => {
		if (video && videoRef.current) {
			const handleCanPlay = () => {
				onLoadComplete?.();
			};
			const vid = videoRef.current;
			vid.addEventListener('canplaythrough', handleCanPlay, { once: true });
			return () => {
				vid.removeEventListener('canplaythrough', handleCanPlay);
			};
		}
	}, [video, onLoadComplete]);

	return (
		// Altezza FISSA + overflow:hidden: il Carousel, prima dell'hydration, impila
		// tutte le slide in verticale (ognuna ~100vh) facendo gonfiare il contenitore
		// a migliaia di px; poi collassa a una slide e la barra CTA (absolute bottom:10%)
		// salta su -> e' il culprit CLS 0.155. Con height fissa il box resta stabile
		// gia in SSR e l'overflow nasconde lo stacking, quindi la CTA non si muove mai.
		// minHeight non bastava perche' le slide impilate superano il "floor".
		<Box position="relative" sx={{ height: { xs: 'calc(100vh - 101px)', md: 'calc(100vh - 160px)' }, overflow: 'hidden' }}>
			{video ? (
				<video
					ref={videoRef}
					style={{ width: '100%', height: '100%', objectFit: "cover" }}
					preload="auto"
					autoPlay
					muted
					loop
				>
					<source src={video} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			) : (
				<FullPageSlider images={images} onLoadComplete={onLoadComplete} />
			)}
			<Box
				position="absolute"
				bottom="10%"
				width="100%"
				display="flex"
				justifyContent="center"
				gap={{ xs: '10px', md: "50px" }}
				padding="20px"
				zIndex={1}
			>
				<Button color={buttonColor} variant={buttonVariant} component={Link} href="/occhiali-da-sole">
					{t("sunglasses_long")}
				</Button>
				<Button color={buttonColor} variant={buttonVariant} component={Link} href="/occhiali-da-vista">
					{t("optical_long")}
				</Button>
			</Box>
		</Box>
	);
};

export default Hero;
