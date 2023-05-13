import {BaseProduct, Category, Color, ProductTag} from "../../types/woocommerce";
import {Container, Grid, IconButton, SwipeableDrawer, Theme, Typography, useMediaQuery} from "@mui/material";
import ProductCard from "../../components/ProductCard";
import {useState} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {NEXT_API_ENDPOINT} from "../../utils/endpoints";
import InfiniteScroll from "react-infinite-scroll-component";
import {useRouter} from "next/router";
import FilterBar from "./FilterBar";
import {FilterAltOutlined} from "@mui/icons-material";
import {CUSTOM_COLOR} from "../../theme/theme";

type ProductsGridProps = {
	products: BaseProduct[]
	colors: Color[]
	tags: ProductTag[],
	designers: Category[]
}

type SearchParams = {
	categories?: string | string[] | undefined,
	name?: string | undefined,
	colors?: string | string[] | undefined,
	price_range?: string | string[] | undefined,
	styles?: string | string[] | undefined,
	materials?: string | string[] | undefined,
	genders?: string | string[] | undefined,
}

const ProductsGrid = ({ products, colors, tags, designers }: ProductsGridProps) => {
	const [searchParams, setSearchParams] = useState<SearchParams>({})
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
	const {locale} = useRouter()
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery(
		["products", searchParams],
		async ({ pageParam = 1}): Promise<BaseProduct[]> => {
			const queryParams = Object.fromEntries(Object.entries({
				categories: searchParams.categories,
				name: searchParams.name,
				colors: searchParams.colors,
				price_range: searchParams.price_range,
				tags: [searchParams.styles, searchParams.materials, searchParams.genders].filter(v=>v).join(',')
			}).filter(([key, value]) => value !== undefined))
			const {products: data} = await fetch(NEXT_API_ENDPOINT + '/products?' + new URLSearchParams({
				page: pageParam.toString(),
				per_page: '12',
				lang: locale ?? 'it',
				...queryParams
			}))
				.then(response => response.json())
			return data
		},
		{
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.length > 0) {
					return pages.length + 1;
				}
			},
			initialData: {pages: [products], pageParams: []}
		}
	);
	return (
		<>
			{isMobile ?
				<>
					<IconButton
						onClick={() => setIsDrawerOpen(!isDrawerOpen)}
						sx={{
							position: 'fixed',
							top: '14px',
							right: '80px',
							zIndex: 1201
						}}
					>
						<FilterAltOutlined fontSize="large" />
					</IconButton>
					<SwipeableDrawer
						elevation={0}
						open={isDrawerOpen}
						onClose={() => setIsDrawerOpen(false)}
						onOpen={() => setIsDrawerOpen(true)}
						anchor="right"
						PaperProps={{
							sx: {
								backgroundColor: CUSTOM_COLOR,
								padding: '80px 24px 24px',
								minWidth: '300px'
							}
						}}
					>
						<FilterBar setSearchParams={setSearchParams} colors={colors} tags={tags} designers={designers} />
					</SwipeableDrawer>
				</> :
				<FilterBar setSearchParams={setSearchParams} colors={colors} tags={tags} designers={designers} />
			}
			<Container sx={{paddingTop: '20px', paddingBottom: '20px'}}>
				{status === "success" && (
					<InfiniteScroll
						style={{width: '100%'}}
						dataLength={data?.pages.length * 24}
						next={fetchNextPage}
						hasMore={hasNextPage || false}
						loader={(<Typography variant="h1">Loading...</Typography>)}
					>
						<Grid container spacing={3}>
							{data?.pages.map(products => products.map((product: BaseProduct) => (
								<Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
									<ProductCard product={product} />
								</Grid>
							)))}
						</Grid>
					</InfiniteScroll>
				)}
			</Container>
		</>
	)
}

export default ProductsGrid