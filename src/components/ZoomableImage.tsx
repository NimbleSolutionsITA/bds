import React, { useState, useRef } from 'react';
import { Box } from '@mui/system';
import { motion } from 'framer-motion';

interface ZoomProps {
	img: string;
	zoomScale: number;
	height: number;
	width: number;
	transitionTime?: number;
}

const Zoom: React.FC<ZoomProps> = ({ img, zoomScale, height, width, transitionTime = 0.1 }) => {
	const [zoom, setZoom] = useState<boolean>(false);
	const [mouseXY, setMouseXY] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

	const imageRef = useRef<HTMLDivElement>(null);

	const handleMouseOver = () => setZoom(true);

	const handleMouseOut = () => setZoom(false);

	const handleMouseMovement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const { left: offsetLeft, top: offsetTop } = e.currentTarget.getBoundingClientRect();
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
			sx={{ width: `${width}px`, height: `${height}px`, overflow: 'hidden', position: 'relative' }}
			onMouseEnter={handleMouseOver}
			onMouseLeave={handleMouseOut}
			onMouseMove={handleMouseMovement}
			ref={imageRef}
		>
			<motion.div
				style={{
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: 'auto 100%',
					backgroundImage: `url('${img}')`,
					width: '100%',
					height: '100%',
					position: 'absolute',
					left: 0,
					top: 0,
				}}
				animate={transform}
				transition={{ duration: transitionTime, ease: 'easeOut' }}
			/>
		</Box>
	);
};

export default Zoom;
