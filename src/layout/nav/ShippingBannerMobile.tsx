import {AnimatePresence, motion} from "framer-motion";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import SaveMoney from "../../icons/SaveMoney";
import FastShipping from "../../icons/FastShipping";
import EuShipping from "../../icons/EuShipping";
import {Trans} from "react-i18next";

const ShippingBannerMobile = () => {
	const { t } = useTranslation('common');
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

	const Icons = [SaveMoney, FastShipping, EuShipping]
	const Icon = Icons[index]

	return (
		<div style={{position: 'relative', background: '#000', color: '#FFF', padding: '10px 20px', fontSize: '14px'}}>
			<AnimatePresence mode="wait">
				<motion.div
					key={index}
					initial={{opacity: 0}}
					animate={{opacity: 1}}
					exit={{opacity: 0}}
					transition={{duration: 1}}
					style={{
						display: 'flex',
						alignItems: 'center',
						height: '42px'
					}}
				>
					<Icon fontSize="medium" sx={{marginRight: '20px'}} />
					<div>{shippingPromos[index]}</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

export default ShippingBannerMobile;