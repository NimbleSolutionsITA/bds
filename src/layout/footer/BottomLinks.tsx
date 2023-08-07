import {Button, Typography} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";
import Link from "../../components/Link";

const BottomLinks = () => {
	const linkStyle = {fontSize: '12px', fontWeight: 400, textTransform: 'none', padding: 0}
	return (
		<>
			<div style={{textAlign: 'center', marginTop: '10px'}}>
				<Button component={Link} href="/privacy-policy" variant="text" sx={linkStyle}>Privacy Policy</Button>
				{' - '}
				<Button component={Link} href="/cookie-policy" variant="text" sx={linkStyle}>Cookie Policy</Button>
				{' - '}
				<Button component={Link} href="/terms-and-conditions" variant="text" sx={linkStyle}>Termini e Condizioni</Button>
			</div>
			<Typography sx={{fontSize: '12px', fontWeight: 300, marginTop: '4px', textAlign: 'center'}}>
				Bottega di Sguardi © 2023
			</Typography>
			<Typography sx={{fontSize: '11px', fontWeight: 300, marginTop: '4px', textAlign: 'center', opacity: .75}}>
				Made with <FavoriteIcon sx={{fontSize: '15px', marginBottom: '-4px'}} color="error" /> by <a href="https://www.nimble-solutions.com" target="_blank" rel="noopener noreferrer">Nimble Solutions</a>
			</Typography>
		</>
	)
}

export default BottomLinks;