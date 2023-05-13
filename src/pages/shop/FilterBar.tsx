import {CUSTOM_COLOR} from "../../theme/theme";
import {Box, Container} from "@mui/material";
import {ProductsRequestQuery} from "../../../pages/api/products";
import {Dispatch, SetStateAction} from "react";
import ColorSelect from "./ColorSelect";
import {Category, Color, ProductTag} from "../../types/woocommerce";
import NameField from "./NameField";
import PriceRange from "./PriceRange";
import TagSelect from "./TagSelect";

type FilterBarProps = {
	setSearchParams: Dispatch<SetStateAction<ProductsRequestQuery>>
	colors: Color[]
	tags: ProductTag[]
	designers: Category[]
}
const FilterBar = ({setSearchParams, colors, tags, designers}: FilterBarProps) => {
	const containerStyles = {
		display: 'flex',
		gap: '40px',
		justifyContent: 'center',
		alignItems: {
			xs: 'flex-end',
			md: 'center'
		},
		padding: '10px 0',
		flexDirection: {xs: 'column', md: 'row'}
	}
	return (
		<Box sx={{
			backgroundColor: CUSTOM_COLOR,
			padding: '10px 0',
			height: {xs: '100vh', md: 'auto'}
		}}>
			<Container sx={containerStyles}>
				<NameField
					onChange={(name?: string) => setSearchParams(params => ({...params, name}))}
				/>
				<ColorSelect
					colors={colors}
					onClick={(colors) => setSearchParams(params => ({...params, colors}))}
				/>
				<PriceRange
					onChange={(priceRange?: number|number[]) => setSearchParams(params => ({...params, 'price_range': priceRange?.toString() ?? ''}))}
				/>
			</Container>
			<Container sx={containerStyles}>
				<TagSelect
					single
					tags={designers.filter(designer => designer.count > 0)}
					onChange={(designer) => setSearchParams(params => ({...params, categories: designer?.toString()}))}
					placeholder="Designers"
				/>
				<TagSelect
					tags={tags.filter(tag => tag.count > 0 && tag.filter === 'gender')}
					placeholder="Donna/Uomo"
					onChange={(genders) => setSearchParams(params => ({...params, genders: genders?.toString()}))}
				/>
				<TagSelect
					tags={tags.filter(tag => tag.count > 0 && tag.filter === 'material')}
					placeholder="Materiali"
					onChange={(materials) => setSearchParams(params => ({...params, materials: materials?.toString()}))}
				/>
				<TagSelect
					tags={tags.filter(tag => tag.count > 0 && tag.filter === 'style')}
					placeholder="Stili"
					onChange={(styles) => setSearchParams(params => ({...params, styles: styles?.toString()}))}
				/>
			</Container>
		</Box>
	)
}

export default FilterBar