import {AnimatePresence, motion} from "framer-motion";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {Trans} from "react-i18next";

const ShippingBanner = () => {
	const shippingPromos = [
		<Trans key="line1" i18nKey="shipping.line1b" components={[<b key={0} />]} />,
		<Trans key="line2" i18nKey="shipping.line2b" components={[<b key={0} />]} />,
		<Trans key="line3" i18nKey="shipping.line3b" components={[<b key={0} />]} />
	]
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setIndex((current) => (current + 1) % shippingPromos.length);
		}, 5000); // Change promotions every 5 seconds
		return () => clearInterval(timer);
	}, [shippingPromos.length]);

	return (
		<div style={{position: 'relative'}}>
			<AnimatePresence mode="wait">
				<motion.div
					key={index}
					initial={{opacity: 0}}
					animate={{opacity: 1}}
					exit={{opacity: 0}}
					transition={{duration: 1}}
				>
					{shippingPromos[index]}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

export default ShippingBanner;