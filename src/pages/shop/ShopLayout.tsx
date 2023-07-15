import {Container, Theme, useMediaQuery} from "@mui/material";
import {Attribute, BaseProduct, Category, Color, ProductTag} from "../../types/woocommerce";
import ProductsGrid from "./ProductsGrid";
import {useRef, useState} from "react";
import FilterBar from "./FilterBar";
import {useTranslation} from "next-i18next";
import dynamic from 'next/dynamic'

const FilterDrawer = dynamic(() => import('./FilterDrawer'))

type ShopLayoutProps = {
	products: BaseProduct[]
	colors: Color[]
	attributes: Attribute[]
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
	lente?: string | string[] | undefined,
	modello?: string | string[] | undefined,
	montatura?: string | string[] | undefined,
	calibro?: string | string[] | undefined,
	calibro_ponte?: string | string[] | undefined,
	formato?: string | string[] | undefined,
	montatura_lenti?: string | string[] | undefined,
	sort?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'best_sells' | undefined
}
const ShopLayout = ({ products, colors, attributes, tags, designers, isSunglasses, isOptical, isMan, isWoman }: ShopLayoutProps) => {
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
	const [searchParams, setSearchParams] = useState<SearchParams>({})
	const [open, setOpen] = useState(!isMobile);
	const ref = useRef<HTMLDivElement | null>(null);
	const drawerWidth = 240;
	const { t } = useTranslation('common');
	return(
		<div style={{height: '100%'}}>
			<FilterBar
				ref={ref}
				open={open}
				setOpen={setOpen}
				searchParams={searchParams}
				setSearchParams={setSearchParams}
			/>
			<Container sx={{marginTop: '20px', marginBottom: '20px', minHeight: '500px', display: 'flex'}}>
				<FilterDrawer
					open={open}
					setOpen={setOpen}
					searchParams={searchParams}
					setSearchParams={setSearchParams}
					colors={colors}
					attributes={attributes}
					tags={tags}
					designers={designers}
					filterBarRef={ref}
					drawerWidth={drawerWidth}
				/>
				<ProductsGrid
					title={`${t(isSunglasses ? 'sunglasses_long' : 'optical_long')}${(isMan || isWoman) ? ' ' + t(isMan ? 'man' : 'woman') : ''}`}
					searchParams={searchParams}
					products={products}
					open={open}
					drawerWidth={drawerWidth}
					isMan={isMan}
					isWoman={isWoman}
					isOptical={isOptical}
					isSunglasses={isSunglasses}
				/>
			</Container>
		</div>
	)
}

export default ShopLayout;