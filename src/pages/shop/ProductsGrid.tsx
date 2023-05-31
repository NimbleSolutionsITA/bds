import {BaseProduct, Category, Color, ProductTag} from "../../types/woocommerce";
import {Backdrop, CircularProgress, Container, Grid, Typography} from "@mui/material";
import ProductCard from "../../components/ProductCard";
import {useEffect, useState} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {NEXT_API_ENDPOINT} from "../../utils/endpoints";
import InfiniteScroll from "react-infinite-scroll-component";
import {useRouter} from "next/router";
import Filters from "./Filters";
import Loading from "../../components/Loading";

type ProductsGridProps = {
	products: BaseProduct[]
	colors: Color[]
	tags: ProductTag[],
	designers: Category[]
	isSunglasses?: boolean
	isOptical?: boolean
	isMan?: boolean
	isWoman?: boolean
}

export type SearchParams = {
	categories?: string | string[] | undefined,
	name?: string | undefined,
	colors?: string | string[] | undefined,
	price_range?: string | string[] | undefined,
	styles?: string | string[] | undefined,
	materials?: string | string[] | undefined,
	optical?: boolean | undefined,
	sunglasses?: boolean | undefined,
	man?: boolean | undefined,
	woman?: boolean | undefined
}

const ProductsGrid = ({ products, colors, tags, designers, isSunglasses, isOptical, isMan, isWoman }: ProductsGridProps) => {
	const [searchParams, setSearchParams] = useState<SearchParams>({})
	const {locale} = useRouter()

	const { data, status, fetchNextPage, hasNextPage, isRefetching } = useInfiniteQuery(
		["products", searchParams],
		async ({ pageParam = 1}): Promise<BaseProduct[]> => {
			const queryParams = Object.fromEntries(Object.entries({
				categories: searchParams.categories,
				name: searchParams.name,
				colors: searchParams.colors,
				price_range: searchParams.price_range,
				tags: [searchParams.styles, searchParams.materials].filter(v=>v).join(','),
				sunglasses: isSunglasses ? true : searchParams.sunglasses,
				optical: isOptical ? true : searchParams.optical,
				man: isMan ? true : searchParams.man,
				woman: isWoman ? true : searchParams.woman
			}).filter(([_, value]) => value !== undefined))

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
				if (lastPage.length === 12) {
					return pages.length + 1;
				}
			},
			initialData: {pages: [products], pageParams: []}
		}
	);

	console.log({status, isRefetching, hasNextPage})

	useEffect(() => {
		if (isRefetching)
			window.scrollTo({top: 0, behavior: 'smooth'})
	} , [isRefetching])

	return (
		<div style={{height: '100%'}}>
			<Filters
				searchParams={searchParams}
				setSearchParams={setSearchParams}
				colors={colors}
				tags={tags.filter(tag => tag.count > 0)}
				designers={designers.filter(designer => designer.count > 0)}
				isSunglasses={isSunglasses}
				isOptical={isOptical}
				isMan={isMan}
				isWoman={isWoman}
			/>
			<Container sx={{marginTop: '20px', marginBottom: '20px', minHeight: '500px'}}>
				{status === "success" && (
					<InfiniteScroll
						style={{
							width: '100%',
							overflow: 'hidden'
						}}
						dataLength={data?.pages.length * 24}
						next={fetchNextPage}
						hasMore={hasNextPage || false}
						loader={<Loading />}
						scrollableTarget="html"
					>
						{data?.pages[0]?.length > 0 ? (
							<Grid container spacing={3}>
								{data?.pages.map(products => products.map((product: BaseProduct) => (
									<Grid item xs={12} sm={6} md={4} xl={3} key={product.id}>
										<ProductCard product={product} />
									</Grid>
								)))}
							</Grid>
						) : <Typography variant="subtitle2">Nessun prdodotto trovato</Typography>}
					</InfiniteScroll>
				)}
				<Backdrop
					sx={{ backgroundColor: 'rgba(255,255,255,0.75)', zIndex: (theme) => theme.zIndex.appBar - 2 }}
					open={isRefetching}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			</Container>
		</div>
	)
}

export default ProductsGrid