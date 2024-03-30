import sanitizeHtml from 'sanitize-html';
import {
    AttributeType, BaseCategory,
    BaseProduct,
    BaseVariation,
    Color,
    Product, ProductCategory,
    ShippingMethod,
    Variation, WooOrder
} from "../types/woocommerce";
import { formatDistance as fd } from 'date-fns';
import { it } from 'date-fns/locale';
import {LIQUIDES_IMAGINAIRES_SUB_PATH, PROFUMUM_ROMA_SUB_PATH} from "./endpoints";
import {Cart, Item} from "../types/cart-type";

export const sanitize = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
	allowedAttributes: {
      '*': ['style', 'id'],
      'a': ['target', 'href', 'title'],
      'img': ['src', 'alt', 'width', 'height', 'title'],
    },
    allowedClasses: {
      '*': ['*']
    }
  });
}
export const EYEWEAR_CATEGORY = {
  it: 188,
  en: 496
}

export const SUNGLASSES_CATEGORY = {
    it: 18,
    en: 517
}

export const OPTICAL_CATEGORY = {
    it: 43,
    en: 493
}
export const PROFUMUM_ROMA_CATEGORY = {
    it: 51,
    en: 518
}
export const LIQUIDES_IMAGINAIRES_CATEGORY = {
    it: 1166,
    en: 1188
}

export const BOTTEGA_DI_SGUARDI_CATEGORY = {
    it: 33,
    en: 498
}

export const BOTTEGA_DI_SGUARDI_HORN_COLLECTION_CATEGORY = {
    it: 1581,
    en: 12497
}

export const VIBES_365_CATEGORY = {
    it: 38,
    en: 514
}

export const OUR_PRODUCTION_CATEGORIES = {
    it: [BOTTEGA_DI_SGUARDI_CATEGORY.it, BOTTEGA_DI_SGUARDI_HORN_COLLECTION_CATEGORY.it, VIBES_365_CATEGORY.it],
    en: [BOTTEGA_DI_SGUARDI_CATEGORY.en, BOTTEGA_DI_SGUARDI_HORN_COLLECTION_CATEGORY.en, VIBES_365_CATEGORY.en]
}

export const SHOP_CATEGORIES = {
    optical: { it: 2796, en: 9604 },
    sunglasses: { it: 2990, en: 9602 }
}
export const MAIN_CATEGORIES = [
    EYEWEAR_CATEGORY.it,
    EYEWEAR_CATEGORY.en,
]
export const EYEWEAR_CATEGORIES = [
    SUNGLASSES_CATEGORY.it,
    SUNGLASSES_CATEGORY.en,
    OPTICAL_CATEGORY.it,
    OPTICAL_CATEGORY.en,
    EYEWEAR_CATEGORY.it,
    EYEWEAR_CATEGORY.en,
];


type RGB = [number, number, number];
type Palette = { [color: string]: { label: string, color: string } };


function hexToRgb(hex: string): RGB {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
  ];
}

export const palette: Palette = {
    black: { label: 'Black', color: '#000000' },
    darkGray: { label: 'Dark Gray', color: '#808080' },
    lightGray: { label: 'Light Gray', color: '#C0C0C0' },
    white: { label: 'White', color: '#FFFFFF' },
    red: { label: 'Red', color: '#800000' },
    brightRed: { label: 'Bright Red', color: '#FF0000' },
    yellow: { label: 'Yellow', color: '#808000' },
    brightYellow: { label: 'Bright Yellow', color: '#FFFF00' },
    brightGreen: { label: 'Bright Green', color: '#00FF00' },
    green: { label: 'Green', color: '#008000' },
    cyan: { label: 'Cyan', color: '#008080' },
    brightCyan: { label: 'Bright Cyan', color: '#00FFFF' },
    brightBlue: { label: 'Bright Blue', color: '#0000FF' },
    blue: { label: 'Blue', color: '#000080' },
    magenta: { label: 'Magenta', color: '#800080' },
    brightMagenta: { label: 'Bright Magenta', color: '#FF00FF' },
};

export function closestColor(hex: string): Color {
  const rgb = hexToRgb(hex);
  let [r1, g1, b1] = rgb;
  let closest = { slug: '', name: '', code: '' };
  let smallestDistance = Infinity;
  for (let color in palette) {
    let [r2, g2, b2] = hexToRgb(palette[color].color);
    let distance = Math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closest = {
        slug: color,
        name: palette[color].label,
        code: palette[color].color
      };
    }
  }
  return closest;
}

export function getDefaultProduct(product: BaseProduct | Product): {
    defaultProduct: BaseVariation | Variation,
    defaultAttributes: { [key in AttributeType]?: string }
} {
    const defaultProduct = product.variations[0] ?? {
        id: product.id,
        stock_status: product.stock_status,
        stock_quantity: product.stock_quantity,
        image: product.image,
        price: product.price,
        attributes: Object.keys(product.attributes).map((key) => {
            const attributes = product.attributes[key as AttributeType];
            return ({
                id: 'pa_' + (key === 'montaturaLenti' ? 'montatura-lenti' : key),
                name: attributes && attributes[0].name,
                option: attributes && attributes[0].slug
            })
        })
    }
    const defaultAttributes: {  [key in AttributeType]?: string } = defaultProduct.attributes ? defaultProduct.attributes.reduce((obj, item) => {
        const key = item.id.toString().replace("pa_", ""); // remove "pa_" prefix from id
        obj[key === 'montatura-lenti' ? 'montaturaLenti': key] = item.option;
        return obj;
    }, {} as {[key: string]: string}) : {};

    return { defaultProduct, defaultAttributes };
}

export function findVariationFromAttributes(product: BaseProduct | Product, attributes: {  [key in AttributeType]?: string }): Variation | BaseVariation | undefined {
    const variations = product.variations as BaseVariation[];
    return variations?.find(
        (variation: Variation | BaseVariation) => {
            return (
                (!attributes.colore || variation.attributes?.find((attribute) => attribute.id === 'pa_colore')?.option === attributes.colore) &&
                (!attributes.lente || variation.attributes?.find((attribute) => attribute.id === 'pa_lente')?.option === attributes.lente) &&
                (!attributes.modello || variation.attributes?.find((attribute) => attribute.id === 'pa_modello')?.option === attributes.modello) &&
                (!attributes.montatura || variation.attributes?.find((attribute) => attribute.id === 'pa_montatura')?.option === attributes.montatura) &&
                (!attributes.montaturaLenti || variation.attributes?.find((attribute) => attribute.id === 'pa_montatura-lenti')?.option === attributes.montaturaLenti) &&
                (!attributes.calibro || variation.attributes?.find((attribute) => attribute.id === 'pa_calibro')?.option === attributes.calibro) &&
                (!attributes.formato || variation.attributes?.find((attribute) => attribute.id === 'pa_formato')?.option === attributes.formato)
            )
        }
    )
}
export function shippingMethodApplies(method: ShippingMethod, totalOrderAmount: number, totalDiscounts: number) {
    if(!method.enabled) {
        return false;
    }
    if (method.methodId === 'free_shipping') {
        if (method.requires === 'min_amount') {
            const minAmount = parseFloat(method.minAmount);
            let effectiveOrderAmount = totalOrderAmount;
            // Check if discounts should be ignored
            if (method.ignoreDiscounts === 'yes') {
                effectiveOrderAmount += totalDiscounts;
            }
            if (effectiveOrderAmount < minAmount) {
                // The order amount is less than the required minimum for free shipping
                return false;
            }
        }
        // Add more conditions here if needed...
    }
    // If none of the conditions above matched, the method applies
    return true;
}

export function getRelativePath(url: string): string {
    try {
        const urlObject = new URL(url);
        return urlObject.pathname + urlObject.search + urlObject.hash;
    } catch (e) {
        // If it's not a valid URL, assume it's a relative path
        return url;
    }
}

export function getName(fullName?: string | null): [string | undefined, string | undefined] {
    const [name, ...lastName] = fullName?.split(' ') ?? []
    return [
        name,
        lastName.join(' ')
    ]
}

export function formatDistance(date: Date | number, locale: 'it'|'en') {
    const lang = locale === 'it' ? {locale: it} : {};
    return fd(date, new Date(), { addSuffix: true, ...lang });
}

export function getProductMainCategory(product: BaseProduct): BaseCategory {
    const fragrance = product.categories.find((category) => [LIQUIDES_IMAGINAIRES_SUB_PATH, PROFUMUM_ROMA_SUB_PATH].includes(category.slug))
    if (fragrance)
        return fragrance;
    return product.categories.find((category) => category.parent && MAIN_CATEGORIES.includes(category.parent)) ?? product.categories[0];
}
export const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function calculateImageDarkness(imageUrl: string, callback: Function) {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous";
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Calculate average luminance
            let totalLuminance = 0;
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i] / 255;
                const g = imageData.data[i + 1] / 255;
                const b = imageData.data[i + 2] / 255;
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b; // Relative luminance formula
                totalLuminance += luminance;
            }

            const averageLuminance = totalLuminance / (imageData.data.length / 4);
            callback(averageLuminance);
        }
    };
}

export const getCartItemPriceWithoutTax = (item: Item, isEU: boolean) => (isEU && item.cart_item_data.priceEU) ?
    (Number(item.cart_item_data.priceEU) * Number(item.quantity.value) / 1.22) :
    Number(item.totals.total)

export const getCartItemPrice = (item: Item, isEU: boolean) => (isEU && item.cart_item_data.priceEU) ?
    Number(item.cart_item_data.priceEU) * Number(item.quantity.value) :
    (Number(item.totals.total) + Number(item.totals.tax))

export const getIsEU = (customer?: Cart['customer']) => (customer?.shipping_address?.shipping_country ?? customer?.billing_address?.billing_country ) !== 'IT'

export const getCartTotals = (cart?: Cart) => {
    const isEU = getIsEU(cart?.customer)

    const subtotal = isEU ?
        cart?.items?.reduce((acc: number, item: any) => {
            return acc + getCartItemPrice(item, isEU)
        }, 0) ?? 0 :
        (Number(cart?.totals?.subtotal) + Number(cart?.totals?.subtotal_tax)) / 100

    const shipping = (Number(cart?.totals?.shipping_total) + Number(cart?.totals?.shipping_tax)) / 100
    const discount = (Number(cart?.totals?.discount_total) + Number(cart?.totals?.discount_tax)) / 100
    const total = isEU ? (subtotal + shipping - discount) : (Number(cart?.totals?.total) / 100);
    const taxRate = (Number(cart?.totals?.total_tax) / Number(cart?.totals?.total)) ;
    const totalTax =  isEU ? (total * taxRate) : (Number(cart?.totals?.total_tax) / 100);
    return {
        subtotal,
        shipping,
        discount,
        total,
        totalTax
    }
}

export const pageview = (GA_MEASUREMENT_ID : string, url : string) => {
    window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
    });
};

export interface PurchaseEvent {
    transaction_id: string
    value: number
    tax?: number
    shipping?: number
    items: PurchaseItem[]
}

export interface PurchaseItem {
    item_id: string
    item_name: string
    item_brand?: string
    item_category?: string
    item_variant?: string
    price?: number
    quantity?: number
}

export const gtagPurchase = (order: WooOrder) => {
    const params: PurchaseEvent = {
        transaction_id: order.id.toString(),
        value: Number(order.total) / 100,
        tax: Number(order.total_tax) / 100,
        shipping: Number(order.shipping_total) / 100,
        items: order.line_items.map((item) => {
            return {
                item_id: item.product_id.toString(),
                item_name: item.name,
                item_variant: item.variation_id?.toString(),
                price: Number(item.total) / 100,
                quantity: item.quantity
            }
        })
    }
    window.gtag("event", 'purchase', {
        currency: 'EUR',
        ...params
    });
};

export const gtagConsent = (granted: boolean) => {
    const newValue = granted ? 'granted' : 'denied'
    window.gtag("consent", 'update', {
        'analytics_storage': newValue
    });
}

export const prepareOrderPayload = async (cart: any, customerData: any, api: any) => {
    const { invoice, customerNote, ...addresses} = customerData
    const selectedShipping = cart.shipping.packages.default.rates[cart.shipping.packages.default.chosen_method]
    const isEu = (customerData?.shipping?.country ?? customerData?.billing?.country ) !== 'IT'
    const line_items = await Promise.all(cart.items.map(prepareOrderLineItem(api, isEu)))
    return ({
        ...addresses,
        line_items,
        shipping_lines: [
            {
                method_id: selectedShipping?.method_id,
                method_title: selectedShipping?.label,
                total: (Number(selectedShipping?.cost) / 1.22 / 100) + '',
            }
        ],
        coupon_lines:  cart.coupons[0] ? [{ code: cart.coupons[0].coupon ?? '' }] : [],
        customer_note: customerNote,
        meta_data: [
            { key: '_billing_choice_type', value: invoice.billingChoice },
            { key: '_billing_invoice_type', value: invoice.invoiceType },
            { key: '_billing_sdi_type', value: invoice.sdi },
            { key: '_billing_vat_number', value: invoice.vat },
            { key: '_billing_tax_code', value: invoice.tax },
        ]
    })
}

export const prepareOrderLineItem = (api: any, isEu: boolean) => async (item: Item) => {
    const {data: product} = await api.get("products/" + item.id)
    const itemPrice = isEu ?
        product.meta_data.find((m: {key: string, value: string}) => m.key === '_europa_price')?.value ?? product.price :
        product.price
    const total = ((Number(itemPrice) * item.quantity.value) / 1.22) + ''
    return {
        product_id: item.meta.product_type === 'variation' ? item.meta.variation.parent_id : item.id,
        variation_id: item.meta.product_type === 'variation' ? item.id : undefined,
        quantity: item.quantity.value,
        total,
    }
}