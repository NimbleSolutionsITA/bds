import {Box, Container, Divider, IconButton, SwipeableDrawer, Typography} from "@mui/material";
import {CUSTOM_COLOR} from "../../theme/theme";
import {RestartAltSharp, TuneSharp} from '@mui/icons-material';
import React, {Dispatch, SetStateAction, useRef, useState} from "react";
import {Category, Color, ProductTag} from "../../types/woocommerce";
import {SearchParams} from "./ProductsGrid";
import NameField from "./NameField";
import ExpansionPanel from "../../components/ExpansionPanel";
import PriceRange from "./PriceRange";
import FilterChip from "./FilterChip";
import TagPanel from "./TagPanel";
import ColorPanel from "./ColorPanel";


type FiltersProps = {
	setSearchParams: Dispatch<SetStateAction<SearchParams>>
	colors: Color[]
	tags: ProductTag[]
	designers: Category[]
	searchParams: SearchParams
}

const Filters = ({setSearchParams, searchParams, colors, tags, designers}: FiltersProps) => {
	const [open, setOpen] = useState(false);

	const ref = useRef<HTMLDivElement | null>(null);
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
				<div>
					{Object.keys(searchParams).length > 0 && (
						<IconButton size="small" onClick={() => setSearchParams({})}>
							<RestartAltSharp fontSize="small" sx={{color: 'rgba(255,255,255,0.8)'}} />
						</IconButton>
					)}
					<IconButton size="small" onClick={() => setOpen(!open)}>
						<TuneSharp fontSize="small" sx={{color: 'rgba(255,255,255,0.8)'}} />
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
						height: '100vh',
						width: '400px',
						maxWidth: '100%',
						top: ((ref.current?.getBoundingClientRect().top ?? 0) + 40)+'px',
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
					<ExpansionPanel title="Designers">
						<div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '10px 0'}}>
							{designers.map(designer => (
								<FilterChip
									key={designer.slug}
									tag={designer}
									onClick={() => setSearchParams(params => ({
										...params,
										categories: params.categories === designer.slug ? undefined : designer.slug
									}))}
									isActive={searchParams.categories?.includes(designer.slug) ?? false}
								/>
							))}
						</div>
					</ExpansionPanel>
					<TagPanel
						title="Genere"
						name="genders"
						params={searchParams.genders}
						tags={tags.filter(tag => tag.filter === 'gender')}
						setSearchParams={setSearchParams}
					/>
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
					<ColorPanel
						params={searchParams.colors}
						colors={colors}
						setSearchParams={setSearchParams}
					/>
					<Divider light sx={{margin: '5px 0'}} />
					<Typography  sx={{color: 'rgba(255,255,255)', fontWeight: 500, textTransform: 'uppercase', margin: '10px 0'}}>Prezzo</Typography>
					<PriceRange
						price={searchParams.price_range}
						onChange={(priceRange) => setSearchParams(params => ({
							...params,
							price_range: (Array.isArray(priceRange) ? priceRange : [priceRange].filter(v => v)).map(v => v.toString())
						}))}
					/>
				</Box>
			</SwipeableDrawer>
		</Box>
	)
}






export default Filters