import React, {useEffect, useRef, useState} from "react";
import {motion, useAnimation, useDragControls, useScroll} from "framer-motion";
import Bullet from "./Bullet";
import {IconButton} from "@mui/material";

const SLIDES = 3
const GAP = 20

// @ts-ignore
const translateXForElement = (element) => {
	const transform = element.style.transform;

	if (!transform || transform.indexOf('translateX(') < 0) {
		return 0;
	}

	const extractTranslateX = transform.match(/translateX\((-?\d+)/);

	return extractTranslateX && extractTranslateX.length === 2
		? parseInt(extractTranslateX[1], 10)
		: 0;
}

const Slider = ({children}: {children: React.ReactNode[]}) => {
	const ref = useRef(null);
	const [constraint, setConstraint] = useState(0);
	const animation = useAnimation()

	useEffect(() => {
		const calcConstraint = () => {
			// @ts-ignore
			setConstraint(ref?.current?.scrollWidth - ref?.current?.offsetWidth);
		};
		calcConstraint()
		window.addEventListener("resize", calcConstraint);

		return () => window.removeEventListener("resize", calcConstraint);
	}, []);

	const goToSlide = (index: number) => {
		// @ts-ignore
		const slideWidth = (ref?.current?.offsetWidth - GAP * (SLIDES - 1)) / SLIDES
		animation.start({ x: -(index * (slideWidth+GAP)) })
	}

	return (
		<motion.div style={{overflow: 'hidden'}}>
			<motion.div 
				ref={ref}
				drag="x"
				dragConstraints={{ right: 0, left: -constraint }}
				dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
				dragElastic={0}
				key={constraint}
				style={{display: 'flex', gap: GAP}}
				animate={animation}
				onDragTransitionEnd={() => {
					const xPos = translateXForElement(ref.current);
					// @ts-ignore
					const slideWidth = (ref.current.offsetWidth - GAP * (SLIDES - 1)) / SLIDES + GAP
					const targetX = -Math.abs(Math.round(xPos / (slideWidth)) * slideWidth)
					animation.start({ x: targetX, transition: { type: "spring" } });
				}}
			>
				{[...children, ...children.slice(0,SLIDES)].map((slide, index) => (
					<div
						key={index}
						style={{ flexShrink: 0,  width: 'calc((100% - '+GAP+'px * ('+SLIDES+' - 1)) / '+SLIDES+')' }}
					>
						{slide}
					</div>
				))}
			</motion.div>
			<div style={{display: 'flex', width: '100%', justifyContent: 'center', padding: '20px 0'}}>
				{children.map((slide, index) => (
					<Bullet isGrey key={index} onClick={() => goToSlide(index)} width="10px" />
				))}
			</div>
		</motion.div>
	)
}

export default Slider