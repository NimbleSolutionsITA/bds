import {WooProductCategory} from "../../types/woocommerce";
import {Box, Button, Container, Hidden, TextField, Typography} from "@mui/material";
import {useState} from "react";
import Link from "../../components/Link";
import {sanitize} from "../../utils/utils";

type DesignersListProps = {
	designers: WooProductCategory[]
}
const DesignersList = ({ designers }: DesignersListProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const boxProps = {
		backgroundColor: '#000',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		textAlign: 'center',
		padding: '10px'
	}
	return (
		<>
			<Container maxWidth="md" sx={{textAlign: 'center', padding: '24px 0 64px'}}>
				<TextField
					label="Cerca"
					placeholder="Cerca un designer"
					color="primary"
					variant="standard"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</Container>
			{designers.filter((category) => {
				const pattern = new RegExp(searchTerm, 'i');
				return pattern.test(category.name);
			}).map((designer, index) => (
				<div
					key={designer.id}
					style={{
						display: "flex",
						flexDirection: index % 2 === 0 ? "row" : "row-reverse",
					}}
				>
					<Hidden mdUp>
						<Box
							sx={{
								width: '100%',
								height: '100vw',
								backgroundImage: `url(${designer.image.src})`,
								...boxProps
							}}
						>
							<DesignerButton name={designer.name} slug={designer.slug} color="#fff" />
						</Box>
					</Hidden>
					<Hidden mdDown>
						<Box
							component={Link}
							href={`/designers/${designer.slug}`}
							sx={{
								width: '50%',
								height: '50vw',
								backgroundImage: `url(${designer.image.src})`,
								...boxProps
							}}
						/>
					</Hidden>
					<Box
						sx={{
							width: '50%',
							height: '50vw',
							backgroundColor: index % 2 === 0 ? '#fff' : '#d1dcdf',
							justifyContent: 'center',
							alignItems: 'center',
							display: {
								xs: 'none',
								md: 'flex'
							},
						}}
					>
						<DesignerButton name={designer.name} slug={designer.slug} />
					</Box>
				</div>
			))}
		</>
	)
}

const DesignerButton = ({name, slug, color = '#000'}: {name: string, slug: string, color?: string}) => (
	<Button
		variant="text"
		component={Link}
		href={`/designers/${slug}`}
		sx={{color}}
	>
		<Typography
			variant="h1"
			component="div"
			dangerouslySetInnerHTML={{__html: sanitize(name)}}
		/>
	</Button>
)

export default DesignersList