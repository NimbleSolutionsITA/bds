import {LOCALE, PRODUCT_ATTRIBUTES} from "../utils/utils";

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
	link: string;
}

export type ProductCategory = BaseCategory & { bottomText: string | null }

export type Variation = Omit<BaseVariation, 'image'> & { image: ImageDetailed }

export type ColorAttribute = typeof PRODUCT_ATTRIBUTES.color[number]

export type ImageAttribute = typeof PRODUCT_ATTRIBUTES.image[number]

export type BaseAttribute = typeof PRODUCT_ATTRIBUTES.text[number]

export type AttributeType = BaseAttribute|ImageAttribute|ColorAttribute

export type BaseAttributes = {
	[key in BaseAttribute]: TextAttribute[]
} & {
	[key in ColorAttribute]: Color[]
} & {
	[key in ImageAttribute]: ImageColor[]
}

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
	type?: ColorAttribute;
}

export interface Attribute {
	slug: string;
	name: string;
	type?: BaseAttribute
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

export interface PostCategory {
	id: number;
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
	width: number;
	height: number;
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

export type WooProductCategory = BaseCategory & Category & {
	acf: {
		bottomText: string;
		gallery: string[];
	}
	description: string;
	image: Image|null;
	menu_order: number;
	link: string;
	child_items?: WooProductCategory[]
}

export type BaseCategory = {
	id: number;
	name: string;
	slug: string;
	parent?: number | string;
	lang: LOCALE;
}

export type BaseProduct = {
	id: number;
	name: string;
	slug: string;
	image: string;
	price: string;
	price_eu: string;
	price_it: string;
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
	price_eu: string;
	price_it: string;
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

export type ShippingClass = ShippingZone & {
	methods: ShippingMethod[];
	locations: string[];
}

export type ShippingZone = {
	id: number;
	name: string;
	order: number;
}

export type SippingZoneLocation = {
	code: string;
	type: 'country' | 'state' | 'postcode' | 'continent';
}

export type ShippingMethod = {
	id: number;
	order: number;
	enabled: boolean;
	methodId: string;
	title: string
	cost: string;
	requires: 'min_amount';
	minAmount: string;
	ignoreDiscounts: 'no' | 'yes';
}

export type Country = {
	code: string,
	name: string,
	states: {
		code: string,
		name: string
	}[]
}

export type WooOrder = {
	id: number;
	discount_total: string;
	shipping_total: string;
	total: string;
	currency: string;
	discount_tax: string;
	shipping_tax: string;
	cart_tax: string;
	total_tax: string;
	subtotal: string;
	subtotal_tax: string;
	billing: BillingData
	shipping: ShippingData
	payment_method: string;
	payment_method_title: string;
	status: 'processing'|'completed'|'pending'|'refunded'|'failed'|'cancelled'|'on-hold';
	line_items: WooLineItem[]
	coupon_lines: {
		id: number;
		code: string;
	}[]
	shipping_lines: WooSippingLine[]
	meta_data: {
		id: number;
		key: string;
		value: string;
	}[]
	date_completed: string;
	date_paid: string;
	date_created: string;
	customer_note: string;
}

export type BillingData = {
	first_name: string;
	last_name: string;
	address_1: string;
	address_2: string;
	company?: string;
	city: string;
	state: string;
	postcode: string;
	country: string;
	email: string;
	phone: string;
}

export type ShippingData = {
	first_name: string;
	last_name: string;
	company?: string;
	address_1: string;
	address_2: string;
	city: string;
	state: string;
	postcode: string;
	country: string;
}

export type InvoiceData = {
	vat: string,
	tax: string,
	sdi: string,
	billingChoice: 'invoice' | 'receipt',
	invoiceType: 'private' | 'company' | 'freelance'
}

export type WooSippingLine = {
	id: number;
	method_title: string;
	method_id: string;
}

export type WooLineItem = {
	id: number;
	name: string;
	product_id: number;
	variation_id: number;
	quantity: number;
	subtotal: string;
	subtotal_tax: string;
	total: string;
	total_tax: string;
	image: {
		id: number;
		src: string;
	}
	parent_name: string;
	meta_data: {
		id: number;
		key: string;
		value: string;
		display_key: string;
		display_value: string;
	}[]
}

export type WPPage = {
	id: number;
	title: {
		rendered: string;
	};
	slug: string;
	content: {
		rendered: string;
	};
	translations: {
		it: number
		eb: number
	}
	link: string;
	acf: any
	lang: LOCALE
}

export type WPArticle = WPPage & {
	date: string;
	link: string;
	categories_data: PostCategory[]
	author_data: {
		display_name: string;
		url?: string;
	}
	tags_data: PostCategory[]
	excerpt: {
		rendered: string;
	};
	image: {
		medium: string;
		full: string;
	};
	minutes_read: number;
}

export type Page = {
	id: number;
	title: string;
	slug: string;
	content: string
	translations: {
		it: number
		eb: number
	}
	link: string;
	acf: any
}

export type Article = Page & ListArticle & {
	date: string;
	link: string;
	categories: PostCategory[]
	tags: PostCategory[]
	excerpt: string;
	lang: LOCALE
}

export type ACFListArticle = {
	ID: number;
	post_title: string;
	post_name: string;
	post_date: string;
	post_excerpt: string;
	minutes_read: number;
	featured_image: {
		medium: string;
		full: string;
	};
	category_data: PostCategory[]
	author_data: {
		display_name: string;
		url?: string;
	}
}

export type ListArticle = {
	id: number;
	title: string;
	slug: string;
	date: string;
	excerpt: string;
	minutesRead?: number;
	categories: PostCategory[]
	image: {
		medium: string;
		full: string;
	};
	author: {
		displayName: string;
		url?: string;
	}
}

export interface LoggedCustomer {
	id: number
	date_created: string
	date_created_gmt: string
	date_modified: string
	date_modified_gmt: string
	email: string
	first_name: string
	last_name: string
	role: string
	username: string
	billing: Billing
	shipping: Shipping
	is_paying_customer: boolean
	avatar_url: string
	meta_data: MetaDaum[]
}

export interface Billing {
	first_name: string
	last_name: string
	company: string
	address_1: string
	address_2: string
	city: string
	postcode: string
	country: string
	state: string
	email: string
	phone: string
}

export interface Shipping {
	first_name: string
	last_name: string
	company: string
	address_1: string
	address_2: string
	city: string
	postcode: string
	country: string
	state: string
	phone: string
}

export interface MetaDaum {
	id: number
	key: string
	value: any
}