import {WooProductCategory} from "../../types/woocommerce";
import {Box, Button, Container, TextField, Typography} from "@mui/material";
import {useState} from "react";
import Link from "../../components/Link";
import {sanitize} from "../../utils/utils";

type DesignersListProps = {
	designers: WooProductCategory[]
}
const DesignersList = ({ designers }: DesignersListProps) => {
	const [searchTerm, setSearchTerm] = useState("");
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
					<Box
						sx={{
							width: {
								xs: '100%',
								md: '50%'
							},
							height: {
								xs: '100vw',
								md: '50vw'
							},
							backgroundColor: '#000',
							backgroundImage: `url(${designer.image.src})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							justifyContent: 'center',
							alignItems: 'center',
							display: 'flex',
							textAlign: 'center',
							padding: '10px'
						}}
					>
						<DesignerButton name={designer.name} slug={designer.slug} isMobile />
					</Box>
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

const DesignerButton = ({name, slug, isMobile}: {name: string, slug: string, isMobile?: boolean}) => (
	<Button
		variant="text"
		component={Link}
		href={`/designers/${slug}`}
		sx={{
			display: {
				md: isMobile ? 'none' : 'block'
			},
			color: isMobile ? '#fff' : '#000',
		}}
	>
		<Typography
			variant="h1"
			component="div"
			dangerouslySetInnerHTML={{__html: sanitize(name)}}
		/>
	</Button>
)

export default DesignersList