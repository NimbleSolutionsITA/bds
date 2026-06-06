import {Grid2 as Grid, Typography} from "@mui/material";
import {sanitize} from "../utils/utils";
import ReadMoreText from "./ReadMoreText";

type DesignerTopProps = {
	name: string
	brand?: string
	description: string
}
const CategoryTop = ({name, brand, description}: DesignerTopProps) => {
	const title = brand
		? brand + " - " + name
		: name;
	return (
		<Grid container sx={{flexDirection: {xs: 'column-reverse', md: 'row'}}}>
			<Grid size={{xs: 12, md: 12}} sx={{alignItems: 'center', display: 'flex'}}>
				<div style={{margin: '0 10%', textAlign: 'center', width: '100%'}}>
					<Typography
						variant="h1"
						className="title"
						sx={{width: '100%'}}
						dangerouslySetInnerHTML={{__html: sanitize(title)}}
					/>
					<ReadMoreText text={description}/>
				</div>
			</Grid>
		</Grid>
	)
}

export default CategoryTop