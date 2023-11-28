import {
	AttributeType,
	BaseAttribute,
	BaseProduct,
	Color,
	ColorAttribute,
	ImageColor,
	Product,
	TextAttribute
} from "../types/woocommerce";
import {CheckboxProps} from "@mui/material/Checkbox/Checkbox";
import {Box, Checkbox, Typography} from "@mui/material";
import Image from "next/image";
type AttributeCheckboxesProps = {
	product: Product | BaseProduct
	currentAttributes: {  [key in AttributeType]?: string }
	handleClickAttribute: (attribute: AttributeType, slug: string) => void
	extended?: boolean
}
export const AttributeCheckboxes = ({ product, currentAttributes, handleClickAttribute, extended }: AttributeCheckboxesProps) => {
	const boxStyle = {display: 'flex', gap: '5px', flexWrap: 'wrap' as const, marginBottom: extended ? '20px' : 0}
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '5px', width: 'calc(100% - 70px)'}}>
			{['colore', 'color', 'lente', 'modello', 'montatura'].map((attribute) => {
				const attributes = product.attributes[attribute as ColorAttribute];
				return Array.isArray(attributes) ? (
					<div key={attribute} style={boxStyle}>
						{extended && (
							<AttributeTitle attribute={attribute} value={currentAttributes[attribute as ColorAttribute]} />
						)}
						{attributes.map((color) => (
							<ColorBox
								title={attribute + ' - ' + color.name }
								productColor={color}
								key={color.slug}
								checked={currentAttributes[attribute as ColorAttribute] === color.slug}
								onChange={() => handleClickAttribute(attribute as ColorAttribute, color.slug)}
							/>
						))}
					</div>
				) : null
			})}
			{Array.isArray(product.attributes.montaturaLenti) ? (
				<div key="montaturaLenti" style={boxStyle}>
					{extended && (
						<AttributeTitle attribute="montaturaLenti" value={currentAttributes.montaturaLenti} />
					)}
					{product.attributes.montaturaLenti.map((color) => (
						<ImageBox
							title={'montatura lenti' + ' - ' + color.name }
							productColor={color}
							key={color.slug}
							checked={currentAttributes.montaturaLenti === color.slug}
							onChange={() => handleClickAttribute('montaturaLenti', color.slug)}
						/>
					))}
				</div>
			) : null}
			{['calibro', 'formato', 'calibro-ponte'].map((attributeName) => {
				const attributes = product.attributes[attributeName as BaseAttribute];
				return Array.isArray(attributes) ? (
					<div key={attributeName} style={boxStyle}>
						{extended && (
							<AttributeTitle attribute={attributeName} value={currentAttributes[attributeName as BaseAttribute]} />
						)}
						{attributes.map((attribute) => (
							<TextBox
								title={attributeName + ' - ' + attribute.name }
								attribute={attribute}
								key={attribute.slug}
								checked={currentAttributes[attributeName as BaseAttribute] === attribute.slug}
								onChange={() => handleClickAttribute(attributeName as BaseAttribute, attribute.slug)}
							/>
						))}
					</div>
				) : null
			})}
		</div>
	)
}
const AttributeTitle = ({attribute, value}: {attribute: string, value?: string}) => (
	<Typography sx={{fontSize: '18px', width: '100%', textTransform: 'capitalize', marginBorrom: '5px'}}>
		<b>{attribute}:</b> {value}
	</Typography>
)

const ColorBox = ({ productColor, ...checkBoxProps }: { productColor: Color } & CheckboxProps) => {
	return (
		<Checkbox
			icon={<Box sx={{ height: '10px', width: '30px', backgroundColor: productColor.code }} />}
			checkedIcon={<div style={{ border: '1px solid', borderColor: productColor.code}}>
				<Box sx={{ height: '10px', width: '30px', backgroundColor: productColor.code, margin: '2px' }} />
			</div>}
			sx={{
				padding: 0,
				margin: 0
			}}
			{...checkBoxProps}
		/>
	)
}

const ImageBox = ({ productColor, ...checkBoxProps }: { productColor: ImageColor } & CheckboxProps) => {
	return (
		<Checkbox
			icon={<Image src={productColor.image} alt={productColor.name} width="30" height="10" />}
			checkedIcon={<div style={{ border: '1px solid #000', padding: '2px', height: '16px', width: '36px'}}>
				<Image src={productColor.image} width="30" height="10" style={{display: 'block'}} alt={productColor.name} />
			</div>}
			sx={{
				padding: 0,
				margin: 0
			}}
			{...checkBoxProps}
		/>
	)
}

const TextBox = ({ attribute, ...checkBoxProps }: { attribute: TextAttribute } & CheckboxProps) => {
	const AttributeBox = ({isChecked}: {isChecked?: boolean}) => (
		<Box sx={{
			height: isChecked ? '16px' : '14px',
			minWidth: isChecked ? '36px' : '30px',
			border: '1px solid #000',
			padding: '2px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: isChecked ? '#fff' : '#000',
			backgroundColor: isChecked ? '#000' : '#fff',
			fontSize: '10px',
			fontWeight: isChecked ? 700 : 300,
		}}>
			{attribute.name}
		</Box>
	)
	return (
		<Checkbox
			icon={<AttributeBox />}
			checkedIcon={<AttributeBox isChecked />}
			sx={{
				padding: 0,
				margin: 0
			}}
			{...checkBoxProps}
		/>
	)
}