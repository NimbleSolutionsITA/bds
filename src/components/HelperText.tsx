import {ErrorOutlineSharp} from "@mui/icons-material";

const HelperText = ({ message, absolute }: {message?: string, absolute?: boolean}) => {
	return message ? (
		<span style={{
			display: 'flex',
			alignItems: 'center',
			position: absolute ? 'absolute' : 'relative',
			bottom: absolute ? '-21px' : '0',
		}}>
			<ErrorOutlineSharp color="error" sx={{fontSize: '16px', marginRight: '5px'}} />
		    {message}
		</span>
    ) : <span />
}

export default HelperText