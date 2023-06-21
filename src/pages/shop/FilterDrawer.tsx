import {Box, Divider, Drawer} from "@mui/material";
import TagPanel from "./TagPanel";
import ColorPanel from "./ColorPanel";
import {Attribute, Category, Color, ProductTag} from "../../types/woocommerce";
import {SearchParams} from "./ShopLayout";
import {Dispatch, RefObject, SetStateAction, useEffect, useState} from "react";
import FilterTextPanel from "./FilterTextPanel";

type FilterDrawerProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	searchParams: SearchParams;
	setSearchParams: Dispatch<SetStateAction<SearchParams>>;
	colors: Color[]
	attributes: Attribute[]
	tags: ProductTag[]
	designers: Category[]
	isSunglasses?: boolean
	isOptical?: boolean
	isMan?: boolean
	isWoman?: boolean
	filterBarRef: RefObject<HTMLDivElement>
	drawerWidth: number
}
const FilterDrawer =({drawerWidth, open, setSearchParams, searchParams, colors, attributes, tags, designers, isSunglasses, isOptical, isWoman, isMan, filterBarRef}: FilterDrawerProps) => {
	const colori = colors.filter(color => color.type === 'colore')
	const lenti = colors.filter(color => color.type === 'lente')
	const montature = colors.filter(color => color.type === 'montatura')
	const modelli = colors.filter(color => color.type === 'modello')
	const calibri = attributes.filter(attribute => attribute.type === 'calibro')
	const calibriPonte = attributes.filter(attribute => attribute.type === 'calibro-ponte')
	const [yOffSet, setYoffSet] = useState(0)
	useEffect(() => {
		const updateScroll = () => {
			setYoffSet(window.scrollY)
		}
		window.addEventListener("scroll",updateScroll)
		updateScroll()
		return () => {
			window.removeEventListener("scroll", updateScroll)
		}
	}, []);
	return (
		<Drawer
			variant="persistent"
			anchor="right"
			open={open}
			elevation={0}
			sx={{
				width: {
					xs: '100%',
					md: drawerWidth+'px'
				},
				marginLeft: {
					xs: '-16px',
					md: 0
				},
				flexShrink: 0,
				flex: '0 0 auto',
				zIndex: 'auto'
			}}
			PaperProps={{
				sx: {
					zIndex: 'auto',
					width: '100%',
					backgroundColor: '#e5e5e5',
					boxSizing: 'border-box',
					height: '100%',
					top: (filterBarRef.current?.getBoundingClientRect().top ?? 160)+'px',
					paddingTop: '60px',
					right: 'auto',
					paddingRight: {
						xs: 0,
						md: '24px'
					}
				}
			}}
		>
			<Box sx={{
				padding: {
					xs: '16px',
					md: '20px 0 20px 20px',
				},
				width: {
					xs: '100%',
					md: drawerWidth+'px'
				}
			}}>
				<FilterTextPanel
					title="Designers"
					list={designers}
					isActive={(slug) => searchParams.categories?.includes(slug) ?? false}
					onClick={(slug) => setSearchParams(params => ({
						...params,
						categories: params.categories === slug ? undefined : slug
					}))}
				/>
				{!isMan && !isWoman && (
					<>
						<Divider light sx={{margin: '5px 0'}} />
						<FilterTextPanel
							title="Genere"
							list={[{name: 'uomo', slug: 'man'}, {name: 'donna', slug: 'woman'}]}
							isActive={(slug) => searchParams[slug as 'man'|'woman'] ?? false}
							onClick={(slug) => setSearchParams(params => ({
								...params,
								man: slug === 'man' ? !params.man : undefined,
								woman: slug === 'woman' ? !params.woman : undefined,
							}))}
						/>
					</>
				)}
				{!isSunglasses && !isOptical && (
					<>
						<Divider light sx={{margin: '5px 0'}} />
						<FilterTextPanel
							title="Tipologia"
							list={[{name: 'vista', slug: 'optical'}, {name: 'sole', slug: 'sunglasses'}]}
							isActive={(slug) => searchParams[slug as 'optical'|'sunglasses'] ?? false}
							onClick={(slug) => setSearchParams(params => ({
								...params,
								sunglasses: slug === 'sunglasses' ? !params.sunglasses : undefined,
								optical: slug === 'optical' ? !params.optical : undefined,
							}))}
						/>
					</>
				)}
				<TagPanel
					title="Materiali"
					name="materials"
					params={searchParams.materials}
					tags={tags.filter(tag => tag.filter === 'material')}
					setSearchParams={setSearchParams}
				/>
				<TagPanel
					title="Stili"
					name="styles"
					params={searchParams.styles}
					tags={tags.filter(tag => tag.filter === 'style')}
					setSearchParams={setSearchParams}
				/>
				{colori.length > 0 && (
					<ColorPanel
						params={searchParams.colors}
						colors={colori}
						setSearchParams={setSearchParams}
						type="colore"
					/>
				)}
				{lenti.length > 0 && (
					<ColorPanel
						params={searchParams.lente}
						colors={lenti}
						setSearchParams={setSearchParams}
						type="lente"
					/>
				)}
				{montature.length > 0 && (
					<ColorPanel
						params={searchParams.montatura}
						colors={montature}
						setSearchParams={setSearchParams}
						type="montatura"
					/>
				)}
				{modelli.length > 0 && (
					<ColorPanel
						params={searchParams.modello}
						colors={modelli}
						setSearchParams={setSearchParams}
						type="modello"
					/>
				)}
				{!isSunglasses && calibri.length > 0 && (
					<>
						<Divider light sx={{margin: '5px 0'}} />
						<FilterTextPanel
							title="Calibro"
							list={calibri}
							isActive={(slug) => searchParams.calibro?.toString() === slug}
							onClick={(slug) => setSearchParams(params => ({
								...params,
								calibro: slug === searchParams.calibro?.toString() ? undefined : slug,
							}))}
						/>
					</>
				)}
				{!isSunglasses && calibriPonte.length > 0 && (
					<>
						<Divider light sx={{margin: '5px 0'}} />
						<FilterTextPanel
							title="Calibro Ponte"
							list={calibriPonte}
							isActive={(slug) => searchParams.calibro_ponte?.toString() === slug}
							onClick={(slug) => setSearchParams(params => ({
								...params,
								calibro_ponte: slug === searchParams.calibro_ponte?.toString() ? undefined : slug,
							}))}
						/>
					</>
				)}
				<Divider light sx={{margin: '5px 0'}} />
				<FilterTextPanel
					title="Prezzo"
					list={[
						{name: 'fino a 200€', slug: '0,200'},
						{name: '200€ - 300€', slug: '200,300'},
						{name: '300€ - 400€', slug: '300,400'},
						{name: '400€ - 500€', slug: '400,500'},
						{name: '500€ - 750€', slug: '500,750'},
						{name: '750€ - 1000€', slug: '750,1000'},
						{name: 'oltre i 1000€', slug: '1000,5000'},
					]}
					isActive={(slug) => searchParams.price_range?.toString() === slug}
					onClick={(slug) => setSearchParams(params => ({
						...params,
						price_range: slug === searchParams.price_range?.toString() ? undefined : slug,
					}))}
				/>
			</Box>
		</Drawer>
	)
}

export default FilterDrawer