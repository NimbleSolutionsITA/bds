import {ErrorOutlineSharp} from "@mui/icons-material";

const HelperText = ({ message }: {message?: string}) => {
	return message ? (
		<span style={{display: 'flex', alignItems: 'center'}}>
			<ErrorOutlineSharp color="error" sx={{fontSize: '16px', marginRight: '5px'}} />
		    {message}
		</span>
    ) : <span />
}

export default HelperText