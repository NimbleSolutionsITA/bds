import React, {useEffect, useRef, useState} from "react";
import {motion, useAnimation} from "framer-motion";
import {Button} from "@mui/material";

type SliderProps = {
	children: React.ReactNode[]
	gap?: number
	slides?: number
}

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

const Slider = ({children, slides = 3, gap = 10}: SliderProps) => {
	const ref = useRef(null);
	const [constraint, setConstraint] = useState(0);
	const [activeSlide, setActiveSlide] = useState(0);
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
		setActiveSlide(index)
		// @ts-ignore
		const slideWidth = (ref?.current?.offsetWidth - gap * (slides - 1)) / slides
		return animation.start({ x: -(index * (slideWidth+gap)) })
	}

	return (
		<motion.div style={{overflow: 'hidden'}}>
			<motion.div 
				ref={ref}
				drag="x"
				dragConstraints={{ right: 0, left: -constraint }}
				dragTransition={{ bounceStiffness: 300, bounceDamping: 10 }}
				dragElastic={0}
				dragMomentum={false}
				key={constraint}
				style={{display: 'flex', gap: gap}}
				animate={animation}
				onDragTransitionEnd={() => {
					const xPos = translateXForElement(ref.current);
					// @ts-ignore
					const slideWidth = (ref.current.offsetWidth - gap * (slides - 1)) / slides + gap
					const targetX = -Math.abs(Math.round(xPos / (slideWidth)) * slideWidth)
					setActiveSlide(Math.abs(Math.round(xPos / (slideWidth))))
					return animation.start({ x: targetX, transition: { type: "spring" } });
				}}
			>
				{[...children, ...children.slice(0,slides)].map((slide, index) => (
					<div
						key={index}
						style={{ flexShrink: 0,  width: 'calc((100% - '+gap+'px * ('+slides+' - 1)) / '+slides+')' }}
					>
						{slide}
					</div>
				))}
			</motion.div>
			<div style={{display: 'flex', width: '100%', justifyContent: 'center', padding: '20px 0'}}>
				{children.map((slide, index) => (
					<Button
						key={index}
						onClick={() => goToSlide(index)}
						sx={{
							backgroundColor: activeSlide === index ? '#000' : 'rgba(0,0,0,0.1)',
							margin: '0',
							padding: '0',
							width: '50px',
							height: '7px',
							borderRadius: '0',
						}}
					/>
				))}
			</div>
		</motion.div>
	)
}

export default Slider