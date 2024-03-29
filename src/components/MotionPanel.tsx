import {ReactNode} from "react";
import {motion} from "framer-motion";

type MotionPanelProps = {
	active: boolean
	children: ReactNode
}
const MotionPanel = ({active, children}: MotionPanelProps) => (
	<motion.div
		style={{ position:  active ? 'relative' : 'absolute', width: '100%', marginTop: '20px' }}
		initial={{ opacity: 0, height: 0 }}
		animate={{
			opacity: active ? 1 : 0,
			pointerEvents: active ? 'auto' : 'none',
			height: active ? 'auto' : 0,
		}}
		transition={{ duration: 0.5 }}
	>
		{children}
	</motion.div>
)

export default MotionPanel