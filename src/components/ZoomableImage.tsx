import React, { useState, useRef } from 'react';
import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import Image from "next/image";
import placeholder from "../images/placeholder.jpg";

interface ZoomProps {
	img: string;

	ratio?: number;
	zoomScale?: number;
	transitionTime?: number;
}

const Zoom: React.FC<ZoomProps> = ({ img, zoomScale = 3.0, transitionTime = 0.1, ratio = 16/9 }) => {
	const [zoom, setZoom] = useState<boolean>(false);
	const [mouseXY, setMouseXY] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
	const [image, setImage] = useState<string>(img);

	const imageRef = useRef<HTMLDivElement>(null);

	const handleMouseOver = () => setZoom(true);

	const handleMouseOut = () => setZoom(false);

	const handleMouseMovement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const { left: offsetLeft, top: offsetTop, width, height } = e.currentTarget.getBoundingClientRect();
		const x = ((e.pageX - offsetLeft) / width) * 100;
		const y = ((e.pageY - offsetTop) / height) * 100;
		setMouseXY({ x, y });
	};

	const transform = {
		transformOrigin: `${mouseXY.x}% ${mouseXY.y}%`,
		scale: zoom ? zoomScale : 1.0,
	};

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				position: 'relative',
				paddingTop: {
					xs: `calc(100% / ${ratio})`,
					md: `calc(100% / ${ratio})`,
				}
		}}
			onMouseEnter={handleMouseOver}
			onMouseLeave={handleMouseOut}
			onMouseMove={handleMouseMovement}
			ref={imageRef}
		>

			<motion.div
				style={{
					width: '100%',
					height: '100%',
					position: 'absolute',
					left: 0,
					top: 0,
				}}
				animate={transform}
				transition={{ duration: transitionTime, ease: 'easeOut' }}
			>
				<Image
					src={image}
					unoptimized
					fill
					alt="product gallery image"
					style={{objectFit: 'cover', objectPosition: 'center center'}}
					onError={() => setImage(placeholder.src)}
				/>
			</motion.div>
		</Box>
	);
};

export default Zoom;
