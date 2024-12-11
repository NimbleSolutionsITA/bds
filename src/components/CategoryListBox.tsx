import {Box, Button, Typography, useMediaQuery, useTheme} from "@mui/material";
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
const CategoryListBox = ({ category, index, subpath, showCompactView }: { category: WooProductCategory, index: number, subpath?: string, showCompactView: boolean }) => {
	const theme = useTheme();
	const mdUp = useMediaQuery(() => theme.breakpoints.up('md'));
	return (
		<Box
			component="div"
			key={category.id}
			sx={{
				display: "flex",
				flexDirection: {
					xs: index % 2 === 0 ? "row" : "row-reverse",
					md: Math.floor(index / (showCompactView ? 5 : 1)) % 2 === 0 ? "row" : "row-reverse"
				},
				width: {
					xs: showCompactView ? '50%' : '100%',
					md: showCompactView ? '20%' : '100%'
				},
			}}
		>
			{mdUp ? (
				<Box
					component={Link}
					href={subpath ? `/${subpath}/${category.slug}` : `/${category.slug}`}
					sx={{
						width: '50%',
						height: showCompactView ? '10vw' : '50vw',
						backgroundImage: `url(${category.image?.src})`,
						...boxProps
					}}
				/>
			) : (
				<Box
					sx={{
						width: '100%',
						height: showCompactView ? '50vw' : '100vw',
						backgroundImage: `url(${category.image?.src})`,
						...boxProps
					}}
				>
					<CategoryButton name={category.name} slug={category.slug} color="#fff" subpath={subpath} showCompactView={showCompactView} />
				</Box>
			)}
			<Box
				sx={{
					width: '50%',
					height: showCompactView ? '10vw' : '50vw',
					backgroundColor: index % 2 === 0 ? '#fff' : '#d1dcdf',
					justifyContent: 'center',
					alignItems: 'center',
					display: {
						xs: 'none',
						md: 'flex'
					},
				}}
			>
				<CategoryButton name={category.name} slug={category.slug} subpath={subpath} showCompactView={showCompactView} />
			</Box>
		</Box>
	)
}

const CategoryButton = ({name, slug, color = '#000', subpath, showCompactView}: {name: string, slug: string, color?: string, subpath?: string, showCompactView: boolean}) => (
	<Button
		variant="text"
		component={Link}
		href={subpath ? `/${subpath}/${slug}` : `/${slug}`}
		sx={{
			color,
			textAlign: 'center',
			backgroundColor: {
				xs: 'rgba(0,0,0,0.2)',
				md: 'transparent'
			},
		}}
	>
		<Typography
			variant="h1"
			sx={showCompactView ? {fontSize: '16px'} : {}}
			component="div"
			dangerouslySetInnerHTML={{__html: sanitize(name)}}
		/>
	</Button>
)

export default CategoryListBox