import {useEffect} from "react";
import {BaseProduct} from "../../types/woocommerce";
import {Backdrop, Box, CircularProgress, Grid, Typography} from "@mui/material";
import ProductCard from "../../components/ProductCard";
import {useInfiniteQuery} from "@tanstack/react-query";
import {NEXT_API_ENDPOINT} from "../../utils/endpoints";
import InfiniteScroll from "react-infinite-scroll-component";
import {useRouter} from "next/router";
import Loading from "../../components/Loading";
import {SearchParams} from "./ShopLayout";

type ProductsGridProps = {
	products: BaseProduct[]
	isSunglasses?: boolean
	isOptical?: boolean
	isMan?: boolean
	isWoman?: boolean
	searchParams: SearchParams
	open: boolean
	drawerWidth: number
	title?: string
}

const ProductsGrid = ({ products, isSunglasses, isOptical, isMan, isWoman, searchParams, open, drawerWidth, title }: ProductsGridProps) => {
	const {locale} = useRouter()
	const { data, status, fetchNextPage, hasNextPage, isRefetching } = useInfiniteQuery(
		["products", searchParams],
		async ({ pageParam = 1}): Promise<BaseProduct[]> => {
			const queryParams = Object.fromEntries(Object.entries({
				categories: searchParams.categories,
				name: searchParams.name,
				colors: searchParams.colors,
				lente: searchParams.lente,
				modello: searchParams.modello,
				montatura: searchParams.montatura,
				calibro: searchParams.calibro,
				calibro_ponte: searchParams.calibro_ponte,
				formato: searchParams.formato,
				montatura_lenti: searchParams.montatura_lenti,
				price_range: searchParams.price_range,
				tags: [searchParams.styles, searchParams.materials].filter(v=>v).join(','),
				sunglasses: isSunglasses ? true : searchParams.sunglasses,
				optical: isOptical ? true : searchParams.optical,
				man: isMan ? true : searchParams.man,
				woman: isWoman ? true : searchParams.woman,
				sort: searchParams.sort
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
				if (lastPage?.length === 12) {
					return pages.length + 1;
				}
			},
			initialData: {pages: [products], pageParams: []}
		}
	);

	useEffect(() => {
		if (isRefetching)
			window.scrollTo({top: 0, behavior: 'smooth'})
	} , [isRefetching])

	return (
		<Box sx={{
			width: '100%',
			marginLeft: {
				xs: 0,
				md:  `-${drawerWidth}px`
			},
			transition: (theme) => theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			...(open && {
				width: {
					xs: 0,
					md: `calc(100% - ${drawerWidth}px)`
				},
				transition: (theme) => theme.transitions.create(['margin', 'width'], {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				marginLeft: {
					xs: 0,
					md: '24px'
				},
			}),
		}}>
			<Typography variant="h1" sx={{textAlign: 'center', marginTop: '20px', marginBottom: '20px', textTransform: 'capitalize'}}>
				{title}
			</Typography>
			{status === "success" && (
				<InfiniteScroll
					style={{
						width: '100%',
						overflow: 'hidden'
					}}
					dataLength={data?.pages.length * 24}
					next={fetchNextPage}
					hasMore={hasNextPage || false}
					loader={<div style={{width: '100%', textAlign: 'center'}}><Loading /></div>}
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
		</Box>
	)
}

export default ProductsGrid