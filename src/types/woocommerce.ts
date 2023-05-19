export type Product = Omit<BaseProduct, 'image' | 'variations' | 'categories'> & {
	type: "simple" | "variable" | "grouped";
	short_description: string;
	categories: ProductCategory[];
	related: BaseProduct[];
	stock_status: 'instock' | 'outofstock' | 'onbackorder';
	manage_stock: boolean;
	stock_quantity: number;
	backorders: 'no' | 'notify' | 'yes';
	gallery: ImageDetailed[];
	image: ImageDetailed;
	variations: Variation[];
}

export type ProductCategory = BaseCategory & { bottomText: string | null }

export type Variation = Omit<BaseVariation, 'image'> & { image: ImageDetailed }

export type ColorAttribute = 'colore'|'lente'|'modello'|'montatura'

export type ImageAttribute = 'montaturaLenti'

export type BaseAttribute = 'calibro'|'formato'

export type AttributeType = BaseAttribute|ImageAttribute|ColorAttribute

export interface ImageDetailed {
	url: string;
	alt: string;
	width: number;
	height: number;
	variation?: number;
}

export interface AcfAdvancedLink {
	type: string
	value: string
	url: string
	name: string
	title: string
	target: string
}

export interface Color {
	slug: string;
	name: string;
	code: string;
}

export interface ImageColor {
	slug: string;
	name: string;
	image: string;
}

export interface TextAttribute {
	name: string;
	slug: string;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	count: number;
}

export interface Image {
	id: number;
	src: string;
	name: string;
	alt: string;
}

export interface AcfImage {
	id: number;
	url: string;
	title: string;
	alt: string;
	width: string;
	height: string;
}

export interface DefaultAttribute {
	id: number | string
	name: string;
	option: string;
}

export interface AcfProductCategory {
	id: number;
	name: string;
	slug: string;
	description: string;
	image: string;
}

export interface WooProductCategory {
	id: number;
	acf: {
		bottomText: string;
		gallery: string[];
	}
	count: number;
	description: string;
	image: Image;
	menu_order: number;
	name: string;
	slug: string;
	parent?: number;
}

export type BaseAttributes = {
	colore?: Color[];
	lente?: Color[];
	modello?: Color[];
	montatura?: Color[];
	montaturaLenti?: ImageColor[];
	calibro?: TextAttribute[];
	formato?: TextAttribute[];
}

export type BaseCategory = {
	id: number;
	name: string;
	slug: string;
	parent: number;
}

export type BaseProduct = {
	id: number;
	name: string;
	slug: string;
	image: string;
	price: string;
	categories: BaseCategory[];
	attributes: BaseAttributes
	stock_status: 'instock' | 'outofstock' | 'onbackorder';
	stock_quantity?: number;
	manage_stock: boolean;
	variations: BaseVariation[];
}

export type BaseVariation = {
	id: number;
	price: string | number;
	image: string;
	stock_status: 'instock' | 'outofstock' | 'onbackorder';
	stock_quantity?: number | null;
	attributes?: DefaultAttribute[];
}

export type ProductTag = {
	id: number;
	name: string;
	count: number;
	filter: 'none' | 'material' | 'gender' | 'style';
	slug: string;
}