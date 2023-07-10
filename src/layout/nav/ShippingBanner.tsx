import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";

const ShippingBanner = () => {
	const { t } = useTranslation('common');
	const shippingPromos = [
		t('shipping.line1'),
		t('shipping.line2'),
		t('shipping.line3')
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