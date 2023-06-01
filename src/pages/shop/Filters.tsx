import {Box, Container, Divider, IconButton, Menu, MenuItem, SwipeableDrawer} from "@mui/material";
import {CUSTOM_COLOR} from "../../theme/theme";
import {Close, RestartAltSharp, TuneSharp, SortByAlphaSharp} from '@mui/icons-material';
import {Dispatch, SetStateAction, useRef, useState, MouseEvent} from "react";
import {Attribute, Category, Color, ProductTag} from "../../types/woocommerce";
import {SearchParams} from "./ProductsGrid";
import NameField from "./NameField";
import ExpansionPanel from "../../components/ExpansionPanel";
import FilterChip from "./FilterChip";
import TagPanel from "./TagPanel";
import ColorPanel from "./ColorPanel";


type FiltersProps = {
	setSearchParams: Dispatch<SetStateAction<SearchParams>>
	colors: Color[]
	attributes: Attribute[]
	tags: ProductTag[]
	designers: Category[]
	searchParams: SearchParams
	isSunglasses?: boolean
	isOptical?: boolean
	isMan?: boolean
	isWoman?: boolean
}

const Filters = ({setSearchParams, searchParams, colors, attributes, tags, designers, isSunglasses, isOptical, isWoman, isMan}: FiltersProps) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const selectOpen = Boolean(anchorEl);
	const sortOptions: {slug: 'name_asc'|'name_desc'|'price_asc'|'price_desc'|'best_sells', name: string}[] = [
		{slug: 'name_asc', name: 'Nome (A-Z)'},
		{slug: 'name_desc', name: 'Nome (Z-A)'},
		{slug: 'price_asc', name: 'Prezzo (crescente)'},
		{slug: 'price_desc', name: 'Prezzo (decrescente)'},
		{slug: 'best_sells', name: 'Più venduti'},
	]
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);

	};
	const [open, setOpen] = useState(false);
	const colori = colors.filter(color => color.type === 'colore')
	const lenti = colors.filter(color => color.type === 'lente')
	const montature = colors.filter(color => color.type === 'montatura')
	const modelli = colors.filter(color => color.type === 'modello')
	const calibri = attributes.filter(attribute => attribute.type === 'calibro')
	const calibriPonte = attributes.filter(attribute => attribute.type === 'calibro-ponte')
	return (
		<Box
			ref={ref}
			sx={{
				zIndex: (theme) => theme.zIndex.appBar - 1,
				height: '40px',
				backgroundColor: CUSTOM_COLOR,
				width: '100%',
				position: 'sticky',
				top: {
					xs: '80px',
					md: '90px'
				},
			}}
		>
			<Container
				sx={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<NameField
					value={searchParams.name ?? ''}
					onChange={(name?: string) => setSearchParams(params => ({...params, name}))}
					disabled={open}
				/>
				<div style={{display: 'flex'}}>
					<div>
						<IconButton size="small" onClick={handleClick}>
							<SortByAlphaSharp fontSize="small" sx={{color: 'rgba(255,255,255,0.8)'}} />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={selectOpen}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							{sortOptions.map(option => (
								<MenuItem key={option.slug} selected={option.slug === searchParams.sort} onClick={() => {
									setSearchParams(params => ({
										...params,
										sort: option.slug === params.sort ? undefined : option.slug,
									}))
									handleClose()
								}}>
									{option.name}
								</MenuItem>
							))}
						</Menu>
					</div>
					{Object.keys(searchParams).length > 0 && (
						<IconButton size="small" onClick={() => setSearchParams({})}>
							<RestartAltSharp fontSize="small" sx={{color: 'rgba(255,255,255,0.8)'}} />
						</IconButton>
					)}
					<IconButton size="small" onClick={() => setOpen(!open)}>
						{open ?
							<Close fontSize="small" sx={{color: 'rgba(255,255,255,0.8)'}}/> :
							<TuneSharp fontSize="small" sx={{color: 'rgba(255,255,255,0.8)'}}/>
						}
					</IconButton>
				</div>
			</Container>
			<SwipeableDrawer
				anchor="right"
				open={open}
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				elevation={0}
				sx={{
					zIndex: (theme) => theme.zIndex.appBar - 2,
				}}
				PaperProps={{
					sx: {
						backgroundColor: CUSTOM_COLOR,
						width: '400px',
						maxWidth: '100%',
						height: 'auto',
						top: ((ref.current?.getBoundingClientRect().top ?? 0) + 40)+'px',
						right: {
							xs: 0,
							md: '24px'
						}
					}
				}}
				BackdropProps={{
					sx: {
						backgroundColor: 'transparent'
					}
				}}
			>
				<Box sx={{
					padding: '20px',
					margin: '20px',
					width: 'calc(100% - 40px)',
					border: '1px solid rgba(255,255,255,0.2)',
				}}>
					<TextPanel
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
							<TextPanel
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
							<TextPanel
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
							<TextPanel
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
							<TextPanel
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
					<TextPanel
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
			</SwipeableDrawer>
		</Box>
	)
}

type TagPanelProps = {
	title: string
	list: Attribute[] | Category[] | {name: string, slug: string}[]
	isActive: (slug: string) => boolean
	onClick: (slug: string) => void
}
const TextPanel = ({title, list, onClick, isActive}: TagPanelProps) => (
	<ExpansionPanel title={title}>
		<div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '10px 0'}}>
			{list.map(item => (
				<FilterChip
					key={item.slug}
					tag={{name: item.name}}
					onClick={() => onClick(item.slug)}
					isActive={isActive(item.slug)}
				/>
			))}
		</div>
	</ExpansionPanel>
)



export default Filters