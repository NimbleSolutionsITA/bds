import {Box, Container, IconButton, Menu, MenuItem} from "@mui/material";
import {Close, RestartAltSharp, TuneSharp, SortByAlphaSharp} from '@mui/icons-material';
import {Dispatch, SetStateAction, forwardRef, useState, MouseEvent} from "react";
import NameField from "./NameField";
import {SearchParams} from "./ShopLayout";
import {useTranslation} from "next-i18next";

type FilterBarProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	setSearchParams: Dispatch<SetStateAction<SearchParams>>
	searchParams: SearchParams
}

const FilterBar = forwardRef(({setSearchParams, searchParams, open, setOpen}: FilterBarProps, ref) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const selectOpen = Boolean(anchorEl);
	const { t } = useTranslation('common')
	const sortOptions: {slug: 'name_asc'|'name_desc'|'price_asc'|'price_desc'|'best_sells', name: string}[] = [
		{slug: 'name_asc', name: t('name')+' (A-Z)'},
		{slug: 'name_desc', name: t('name')+' (Z-A)'},
		{slug: 'price_asc', name: t('price')+' ('+t('ascending')+')'},
		{slug: 'price_desc', name: t('price')+' ('+t('descending')+')'},
		{slug: 'best_sells', name: t('most-popular')},
	]
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null)

	};
	return (
		<Box
			ref={ref}
			sx={{
				zIndex: (theme) => theme.zIndex.appBar - 1,
				height: '60px',
				backgroundColor: '#e5e5e5',
				width: '100%',
				position: 'sticky',
				top: {
					xs: '101px',
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
				<div style={{display: 'flex'}}>
					<div>
						<IconButton size="small" onClick={() => setOpen(!open)}>
							{open ?
								<Close /> :
								<TuneSharp />
							}
						</IconButton>
						<IconButton onClick={handleClick}>
							<SortByAlphaSharp />
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
						{Object.keys(searchParams).length > 0 && (
							<IconButton onClick={() => setSearchParams({})}>
								<RestartAltSharp  />
							</IconButton>
						)}
					</div>
				</div>
				<NameField
					value={searchParams.name ?? ''}
					onChange={(name?: string) => setSearchParams(params => ({...params, name}))}
				/>
			</Container>
		</Box>
	)
})

FilterBar.displayName = 'FilterBar';

export default FilterBar