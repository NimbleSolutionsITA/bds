import {BaseAttributes, BaseProduct, Color, ImageColor, TextAttribute} from "../../types/woocommerce";
import {Box, Container, Grid2 as Grid, MenuItem, Select} from "@mui/material";
import ProductCard from "../../components/ProductCard";
import {useTranslation} from "next-i18next";
import usePageState from "../../redux/usePageState";

type DesignerProductGridProps = {
	products: BaseProduct[]
}
type Filters = {
	[Property in keyof BaseAttributes]: string | undefined
}
type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc"
const DesignerProductGrid = ({products}:DesignerProductGridProps) => {
	const { filters, sortOption, setState } = usePageState({
		filters: {},
		sortOption: "name-asc"
	})
	const { t } = useTranslation('common');
	const availableAttributes = getUniqueAttributeOptions(products)
	const sortedAndFilteredProducts = products
		.filter((product) => {
			return Object.keys(filters).every((attribute) => {
				if (!filters[attribute as keyof BaseAttributes]) {
					return true;
				}
				const productAttribute = product.attributes[attribute as keyof BaseAttributes];
				if (Array.isArray(productAttribute)) {
					return productAttribute.some(option => option.slug === filters[attribute as keyof BaseAttributes]);
				}
				return false;
			});
		})
		.sort((a, b) => {
			switch (sortOption) {
				case "price-desc":
					return parseFloat(b.price) - parseFloat(a.price);
				case "price-asc":
					return parseFloat(a.price) - parseFloat(b.price);
				case "name-desc":
					return b.name.localeCompare(a.name);
				case "name-asc":
					return a.name.localeCompare(b.name);
				default:
					return 0;
			}
		});
	return (
		<Container sx={{paddingTop: '20px', paddingBottom: '20px'}}>
			<div style={{margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<Select
					value={sortOption}
					onChange={(e) => setState({ sortOption: e.target.value as SortOption})}
				>
					<MenuItem value="price-asc">{t('sorting.price-asc')}</MenuItem>
					<MenuItem value="price-desc">{t('sorting.price-desc')}</MenuItem>
					<MenuItem value="name-asc">{t('sorting.name-asc')}</MenuItem>
					<MenuItem value="name-desc">{t('sorting.name-desc')}</MenuItem>
				</Select>
				<Box sx={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', flexDirection: {xs: 'column', sm: 'row'}}}>
					{Object.keys(availableAttributes).map((attribute) => (
						<Select
							sx={{
								textTransform: 'capitalize',
								"& .MuiMenuItem-root": {
									textTransform: 'capitalize'
								}
							}}
							key={attribute}
							value={filters[attribute as keyof BaseAttributes] ?? 'all'}
							onChange={(e) => setState({ filters: { ...filters, [attribute]: e.target.value === 'all' ? null : e.target.value }})}
						>
							<MenuItem value="all">
								{t('attributes.pa_'+attribute.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())}
							</MenuItem>
							{availableAttributes[attribute as keyof BaseAttributes]?.map((option) => {
								if ("code" in option) {
									return (
										<MenuItem key={option.slug} value={option.slug}>
									        <span
										        style={{
											        display: 'inline-block',
											        width: '20px',
											        height: '20px',
											        backgroundColor: option.code,
											        marginRight: '10px'
										        }}
									        />
											{option.name}
										</MenuItem>
									);
								} else if ("image" in option) {
									return (
										<MenuItem key={option.slug} value={option.slug}>
									        <span
										        style={{
											        display: 'inline-block',
											        width: '20px',
											        height: '20px',
											        backgroundImage: `url(${option.image})`,
											        backgroundSize: 'cover',
											        marginRight: '10px'
										        }}
									        />
											{option.name}
										</MenuItem>
									);
								} else {
									return (
										<MenuItem key={option.slug} value={option.slug}>
											{option.name}
										</MenuItem>
									);
								}
							})}
						</Select>
					))}
				</Box>
			</div>
			<Grid container spacing={3}>
				{sortedAndFilteredProducts.map((product) => (
					<Grid size={{xs:6, md: 4, xl: 3}} key={product.id}>
						<ProductCard product={product} />
					</Grid>
				))}
			</Grid>
		</Container>
	)
}

function getUniqueAttributeOptions(products: BaseProduct[]): BaseAttributes {
	return products.reduce<BaseAttributes>((uniqueAttributes, product) => {
		uniqueAttributes.colore = getUniqueColors(uniqueAttributes.colore, product.attributes.colore);
		uniqueAttributes.lente = getUniqueColors(uniqueAttributes.lente, product.attributes.lente);
		uniqueAttributes.modello = getUniqueColors(uniqueAttributes.modello, product.attributes.modello);
		uniqueAttributes.montatura = getUniqueColors(uniqueAttributes.montatura, product.attributes.montatura);
		uniqueAttributes.montaturaLenti = getUniqueImageColors(uniqueAttributes.montaturaLenti, product.attributes.montaturaLenti);
		uniqueAttributes.calibro = getUniqueTextAttributes(uniqueAttributes.calibro, product.attributes.calibro);
		uniqueAttributes.formato = getUniqueTextAttributes(uniqueAttributes.formato, product.attributes.formato);
		Object.keys(uniqueAttributes).forEach((key) => {
			if (Array.isArray(uniqueAttributes[key as keyof BaseAttributes]) && uniqueAttributes[key as keyof BaseAttributes]?.length === 0) {
				delete uniqueAttributes[key as keyof BaseAttributes];
			}
		});

		return uniqueAttributes;
	}, {} as BaseAttributes);
}

function getUniqueColors(currentColors: Color[] = [], newColors: Color[] = []): Color[] {
	const uniqueColors = [...currentColors];
	newColors.forEach(newColor => {
		if (!uniqueColors.some(color => color.slug === newColor.slug)) {
			uniqueColors.push(newColor);
		}
	});
	return uniqueColors;
}

function getUniqueImageColors(currentImageColors: ImageColor[] = [], newImageColors: ImageColor[] = []): ImageColor[] {
	const uniqueImageColors = [...currentImageColors];
	newImageColors.forEach(newImageColor => {
		if (!uniqueImageColors.some(imageColor => imageColor.slug === newImageColor.slug)) {
			uniqueImageColors.push(newImageColor);
		}
	});
	return uniqueImageColors;
}

function getUniqueTextAttributes(currentTextAttributes: TextAttribute[] = [], newTextAttributes: TextAttribute[] = []): TextAttribute[] {
	const uniqueTextAttributes = [...currentTextAttributes];
	newTextAttributes.forEach(newTextAttribute => {
		if (!uniqueTextAttributes.some(textAttribute => textAttribute.slug === newTextAttribute.slug)) {
			uniqueTextAttributes.push(newTextAttribute);
		}
	});
	return uniqueTextAttributes;
}


export default DesignerProductGrid;