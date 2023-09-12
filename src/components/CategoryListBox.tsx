import {Box, Button, Hidden, Typography} from "@mui/material";
import Link from "./Link";
import {WooProductCategory} from "../types/woocommerce";
import {sanitize} from "../utils/utils";
import {DESIGNERS_SUB_PATH} from "../utils/endpoints";

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
const CategoryListBox = ({ category, index, subpath = DESIGNERS_SUB_PATH }: { category: WooProductCategory, index: number, subpath?: string }) => (
	<div
		key={category.id}
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
					backgroundImage: `url(${category.image?.src})`,
					...boxProps
				}}
			>
				<CategoryButton name={category.name} slug={category.slug} color="#fff" subpath={subpath} />
			</Box>
		</Hidden>
		<Hidden mdDown>
			<Box
				component={Link}
				href={`/${subpath}/${category.slug}`}
				sx={{
					width: '50%',
					height: '50vw',
					backgroundImage: `url(${category.image?.src})`,
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
			<CategoryButton name={category.name} slug={category.slug} subpath={subpath} />
		</Box>
	</div>
)

const CategoryButton = ({name, slug, color = '#000', subpath}: {name: string, slug: string, color?: string, subpath: string}) => (
	<Button
		variant="text"
		component={Link}
		href={`/${subpath}/${slug}`}
		sx={{
			color,
			backgroundColor: {
				xs: 'rgba(0,0,0,0.2)',
				md: 'transparent'
			},
		}}
	>
		<Typography
			variant="h1"
			component="div"
			dangerouslySetInnerHTML={{__html: sanitize(name)}}
		/>
	</Button>
)

export default CategoryListBox