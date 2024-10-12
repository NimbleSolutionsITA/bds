import {BaseProduct, WooProductCategory} from "../../types/woocommerce";
import {IconButton, TextField, Typography} from "@mui/material";
import {useInfiniteQuery} from "@tanstack/react-query";
import {
	DESIGNERS_CATEGORY,
	NEXT_API_ENDPOINT,
	PRODUCT_SUB_PATH,
} from "../../utils/endpoints";
import React, {useState} from "react";
import {useRouter} from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import {useTranslation} from "next-i18next";
import Chip from "../../components/Chip";
import Box from "@mui/material/Box";
import {useDispatch} from "react-redux";
import {closeSearchDrawer} from "../../redux/layoutSlice";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {FRAGRANCES_CATEGORY} from "../../utils/utils";

type Props = {
	categories: WooProductCategory[]
}

const SearchLayout = ({categories}: Props) => {
	const fragrances = categories.find(category => Object.values(FRAGRANCES_CATEGORY).includes(category.id))?.child_items?.map(c => c.child_items?.map(ci => ({...ci, parent: c.slug}))).flat() ?? [] as WooProductCategory[]
	const designers = categories.find(category => category.slug === DESIGNERS_CATEGORY)?.child_items ?? []
	const { locale } = useRouter()
	const [search, setSearch] = useState('');
	const { t } = useTranslation('common');
	const router = useRouter()
	const dispatch = useDispatch()

	const eyewar = useInfiniteQuery({
		queryKey: ["products", search],
		initialPageParam: 1,
		queryFn: async ({ pageParam }: {pageParam: number}): Promise<BaseProduct[]> => {

			const {products: data} = await fetch(NEXT_API_ENDPOINT + '/products?' + new URLSearchParams({
				page: pageParam.toString(),
				per_page: '12',
				lang: locale ?? 'it',
				name: search,
			}))
				.then(response => response.json())

			return data
		},
		getNextPageParam: (lastPage, pages) => {
			if (lastPage?.length === 12) {
				return pages.length + 1;
			}
		},
		initialData: {pages: [], pageParams: []}
	});

	const perfumes = useInfiniteQuery({
		queryKey: ["fragrances", search],
		initialPageParam: 1,
		queryFn: async ({ pageParam}): Promise<BaseProduct[]> => {

			const {products: data} = await fetch(NEXT_API_ENDPOINT + '/products?' + new URLSearchParams({
				page: pageParam.toString(),
				per_page: '12',
				lang: locale ?? 'it',
				name: search,
				fragrances: 'true'
			}))
				.then(response => response.json())

			return data
		},
		getNextPageParam: (lastPage, pages) => {
			if (lastPage?.length === 12) {
				return pages.length + 1;
			}
		},
		initialData: {pages: [], pageParams: []}
	});
	const designersList = designers.filter((d => d.name.toLowerCase().includes(search.toLowerCase())))
	const fragrancesList = fragrances.filter((f => f && f.name.toLowerCase().includes(search.toLowerCase())))
	const onClose = () => dispatch(closeSearchDrawer())
	const handleClick = (route: string) => {
		router.push(route)
		onClose()
	}
	return (
		<div style={{textAlign: 'center', position: 'relative'}}>
			<IconButton
				onClick={onClose}
				sx={{
					position: 'fixed',
					top: {
						xs: '100px',
						md: '150px'
					},
					right: {
						xs: '0',
						md: '30px'
					}
				}}
			>
				<CloseIcon />
			</IconButton>
			<TextField
				label={t('search')}
				color="primary"
				variant="standard"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				sx={{width: '300px'}}
			/>

			{search.length > 0 && (
				<>
					<ChipList query={eyewar} list={designersList} title="designers" />
					<ChipList query={perfumes} list={fragrancesList} title="fragrances" />
				</>
			)}
		</div>
	)
}

const ChipList = ({query, list, title}: {query: any, list: any, title: string}) => {
	const { t } = useTranslation('common');
	const router = useRouter()
	const dispatch = useDispatch()

	const handleClick = (route: string) => {
		router.push(route)
		dispatch(closeSearchDrawer())
	}

	return (<>
		{list.length > 0 && (
			<>
				<Typography variant="h5" sx={{textTransform: 'uppercase', marginTop: '40px'}}>
					{t(title)}
				</Typography>
				<Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '10px'}}>
					{list.map((category: any) => category && (
						<Chip
							key={category.slug}
							tag={{name: category.name}}
							onClick={() => handleClick(`/${category.parent}/${category.slug}`)}
						/>
					))}
				</Box>
			</>
		)}
		{query.status === "success" && (
			<InfiniteScroll
				style={{
					width: '100%',
					overflow: 'hidden'
				}}
				dataLength={query.data?.pages.length * 24}
				next={query.fetchNextPage}
				hasMore={query.hasNextPage || false}
				loader={<div  />}
				scrollableTarget="html"
			>
				{query.data?.pages[0]?.length > 0 && (
					<>
						{list.length === 0 && (
							<Typography variant="h5" sx={{textTransform: 'uppercase', marginTop: '40px'}}>
								{t(title)}
							</Typography>
						)}
						<Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px'}}>
							{query.data?.pages.map((products: any) => products.map((product: BaseProduct) => (
								<Chip
									avatar={product.image}
									key={product.slug}
									tag={{name: `<b>${product.name}</b><br />${product.categories[0].name}`}}
									onClick={() => handleClick(`/${PRODUCT_SUB_PATH}/${product.slug}`)}
									size="medium"
									sxMobile={{
										margin: '0 auto',
										'& .MuiChip-avatar': {
											width: '100px',
											height: '50px'
										}
									}}
								/>
							)))}
						</Box>
					</>
				)}
			</InfiniteScroll>
		)}
	</>)
}

export default SearchLayout