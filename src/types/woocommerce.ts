export type Product = {
	id: number;
	name: string;
	slug: string;
	type: "simple" | "variable" | "grouped";
	description: string;
	short_description: string;
	price: string;
	regular_price: string;
	sale_price: string;
	categories: Category[];
	tags: Category[];
	attributes: Attribute[];
	default_attributes: DefaultAttribute[];
	variations: number[];
	related_ids: number[];
	manage_stock: boolean;
	stock_quantity: number;
	backorders: 'no' | 'notify' | 'yes';
	backorders_allowed: boolean;
	backordered: boolean;
	images: Image[];

	colors: Color[];
	stock_status: 'instock' | 'outofstock' | 'onbackorder';
	translations: {
		[lang: string]: string
	}
	lang: string
}

export interface Variation {
	id: number;
	price: string;
	regular_price: string;
	sale_price: string;
	stock_status: 'instock' | 'outofstock' | 'onbackorder';
	translations: {
		[lang: string]: string
	}
	lang: string
	manage_stock: boolean;
	stock_quantity: number;
	backorders: 'no' | 'notify' | 'yes';
	backorders_allowed: boolean;
	backordered: boolean;
	attributes: DefaultAttribute[];
	image: Image;

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

export interface Attribute {
	id: number;
	name: string;
	position: number;
	visible: boolean;
	variation: boolean;
	options: string[];
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

export interface AcfProduct {
	id: number;
	name: string;
	slug: string;
	price: string;
	image: string;
	category: {
		id: number;
		name: string;
		slug: string;
	}
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

export type BaseProduct = {
	id: number;
	name: string;
	slug: string;
	image: string;
	price: string;
	category: {
		id: number;
		name: string;
		slug: string;
	}
	colors: Color[];
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