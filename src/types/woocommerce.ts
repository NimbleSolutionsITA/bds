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

	images: Image[];

	colors: Color[];
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
	id: number;
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