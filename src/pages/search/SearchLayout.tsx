import {BaseProduct, WooProductCategory} from "../../types/woocommerce";
import {IconButton, TextField, Typography} from "@mui/material";
import {useInfiniteQuery} from "@tanstack/react-query";
import {
	DESIGNERS_SUB_PATH,
	LIQUIDES_IMAGINAIRES_SUB_PATH,
	NEXT_API_ENDPOINT,
	PRODUCT_SUB_PATH,
	PROFUMUM_ROMA_SUB_PATH
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

type Props = {
	designers: WooProductCategory[],
	profumum: WooProductCategory[]
	liquides: WooProductCategory[]
}

const SearchLayout = ({designers, profumum, liquides}: Props) => {
	const fragrances = [...profumum, ...liquides]
	const { locale } = useRouter()
	const [search, setSearch] = useState('');
	const { t } = useTranslation('common');
	const router = useRouter()
	const dispatch = useDispatch()
	const eyewar = useInfiniteQuery(
		["products", search],
		async ({ pageParam = 1}): Promise<BaseProduct[]> => {

			const {products: data} = await fetch(NEXT_API_ENDPOINT + '/products?' + new URLSearchParams({
				page: pageParam.toString(),
				per_page: '12',
				lang: locale ?? 'it',
				name: search,
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
			initialData: {pages: [], pageParams: []}
		}
	);

	const perfumes = useInfiniteQuery(
		["fragrances", search],
		async ({ pageParam = 1}): Promise<BaseProduct[]> => {

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
		{
			getNextPageParam: (lastPage, pages) => {
				if (lastPage?.length === 12) {
					return pages.length + 1;
				}
			},
			initialData: {pages: [], pageParams: []}
		}
	);
	const designersList = designers.filter((d => d.name.toLowerCase().includes(search.toLowerCase())))
	const fragrancesList = fragrances.filter((f => f.name.toLowerCase().includes(search.toLowerCase())))
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
					{designersList.length > 0 && (
						<>
							<Typography variant="h5" sx={{textTransform: 'uppercase', marginTop: '40px'}}>
								{t('designers')}
							</Typography>
							<Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '20px'}}>
								{designersList.map(designer => (
									<Chip
										key={designer.slug}
										tag={{name: designer.name}}
										onClick={() => handleClick(`/${DESIGNERS_SUB_PATH}/${designer.slug}`)}
									/>
								))}
							</Box>
						</>
					)}

					{eyewar.status === "success" && (
						<InfiniteScroll
							style={{
								width: '100%',
								overflow: 'hidden'
							}}
							dataLength={eyewar.data?.pages.length * 24}
							next={eyewar.fetchNextPage}
							hasMore={eyewar.hasNextPage || false}
							loader={<div  />}
							scrollableTarget="html"
						>
							{eyewar.data?.pages[0]?.length > 0 && (
								<>
									<Typography variant="h5" sx={{textTransform: 'uppercase', marginTop: '40px'}}>
										{t('eyewear')}
									</Typography>
									<Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px'}}>
										{eyewar.data?.pages.map(products => products.map((product: BaseProduct) => (
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

					{fragrancesList.length > 0 && (
						<>
							<Typography variant="h5" sx={{textTransform: 'uppercase', marginTop: '40px'}}>
								{t('fragrances')}
							</Typography>
							<Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '10px'}}>
								{fragrances.map(category => (
									<Chip
										key={category.slug}
										tag={{name: category.name}}
										onClick={() => handleClick(`/${profumum.find(p => p.id === category.id) ? PROFUMUM_ROMA_SUB_PATH : LIQUIDES_IMAGINAIRES_SUB_PATH}/${category.slug}`)}
									/>
								))}
							</Box>
						</>
					)}

					{perfumes.status === "success" && (
						<InfiniteScroll
							style={{
								width: '100%',
								overflow: 'hidden'
							}}
							dataLength={perfumes.data?.pages.length * 24}
							next={eyewar.fetchNextPage}
							hasMore={eyewar.hasNextPage || false}
							loader={<div  />}
							scrollableTarget="html"
						>
							{perfumes.data?.pages[0]?.length > 0 && (
								<>
									{fragrancesList.length === 0 && (
										<Typography variant="h5" sx={{textTransform: 'uppercase', marginTop: '40px'}}>
											{t('fragrances')}
										</Typography>
									)}
									<Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px'}}>
										{perfumes.data?.pages.map(products => products.map((product: BaseProduct) => (
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
				</>
			)}
		</div>
	)
}

export default SearchLayout