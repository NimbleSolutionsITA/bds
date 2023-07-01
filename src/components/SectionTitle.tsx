import {Box, IconButton, Typography} from "@mui/material";
import {NavigateNextSharp, NavigateBeforeSharp} from '@mui/icons-material';

type SectionTitleProps = {
	title: string
	onNext?: () => void
	onPrev?: () => void
	disableNext?: boolean
	disablePrev?: boolean
	isLoading?: boolean
}

const SectionTitle = ({ title, onNext, onPrev, disableNext, disablePrev, isLoading}: SectionTitleProps) => (
	<Box sx={{
		gridColumn: '1 / -1',
		padding: '10px 0',
		display: 'flex',
		alignItems: 'center',
	}}>
		<Typography variant="h1" component="h2" sx={{fontFamily: 'Apercu', fontWeight: 500, textTransform: 'uppercase'}}>
			{title}
		</Typography>
		<Box flexGrow={1} borderBottom={1} ml={2} mr={1} borderColor="text.primary"/>
		{onPrev && (
			<IconButton color="primary" size="small" onClick={onPrev} sx={{padding: 0}} disabled={isLoading || disablePrev}>
				<NavigateBeforeSharp sx={{fontSize: '30px'}}/>
			</IconButton>
		)}
		{onNext && (
			<IconButton color="primary" size="small" onClick={onNext} sx={{padding: 0}} disabled={isLoading || disableNext}>
				<NavigateNextSharp sx={{fontSize: '30px'}} />
			</IconButton>
		)}
	</Box>
)

export default SectionTitle