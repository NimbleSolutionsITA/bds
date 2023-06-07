import {Box, Button, Hidden, Typography} from "@mui/material";
import Link from "./Link";
import {WooProductCategory} from "../types/woocommerce";
import {sanitize} from "../utils/utils";

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
const CategoryListBox = ({ category, index }: { category: WooProductCategory, index: number }) => (
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
				<CategoryButton name={category.name} slug={category.slug} color="#fff" />
			</Box>
		</Hidden>
		<Hidden mdDown>
			<Box
				component={Link}
				href={`/categorys/${category.slug}`}
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
			<CategoryButton name={category.name} slug={category.slug} />
		</Box>
	</div>
)

const CategoryButton = ({name, slug, color = '#000'}: {name: string, slug: string, color?: string}) => (
	<Button
		variant="text"
		component={Link}
		href={`/fragrances/${slug}`}
		sx={{color}}
	>
		<Typography
			variant="h1"
			component="div"
			dangerouslySetInnerHTML={{__html: sanitize(name)}}
		/>
	</Button>
)

export default CategoryListBox