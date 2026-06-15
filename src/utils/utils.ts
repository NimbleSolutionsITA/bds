import sanitizeHtml from 'sanitize-html';
import {
    AttributeType, BaseCategory,
    BaseProduct,
    BaseVariation,
    Color, LoggedCustomer,
    Product, ProductCategory,
    Variation, WooOrder, WooProductCategory
} from "../types/woocommerce";
import { formatDistance as fd } from 'date-fns';
import { it } from 'date-fns/locale';
import {Cart, Item} from "../types/cart-type";
import {ReadonlyURLSearchParams} from "next/navigation";
import {DESIGNERS_SUB_PATH} from "./endpoints";

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
export type LOCALE = 'it' | 'en'

export const PRODUCT_ATTRIBUTES = {
    color: ['colore', 'color', 'lente', 'modello', 'montatura'] as const,
    image:  ['montaturaLenti'] as const,
    text: ['calibro', 'formato', 'calibro-ponte'] as const
}

/** Mappa una chiave attributo JS sul nome della tassonomia WooCommerce (pa_*). */
export const attributeKeyToTaxonomy = (key: string): string =>
    'pa_' + (key === 'montaturaLenti' ? 'montatura-lenti' : key);

/** Inverso di attributeKeyToTaxonomy: dal nome tassonomia (pa_*) alla chiave JS. */
export const taxonomyToAttributeKey = (id: string): string => {
    const key = id.replace('pa_', '');
    return key === 'montatura-lenti' ? 'montaturaLenti' : key;
};

/** Attributi usati per individuare la variante corrispondente a una selezione. */
export const VARIATION_MATCH_ATTRIBUTES = ['colore', 'lente', 'modello', 'montatura', 'montaturaLenti', 'calibro', 'formato'] as const;

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
export const FRAGRANCES_CATEGORY = {
    it: 15787,
    en: 15789
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
const FRAGRANCE_CATEGORY_IDS = Object.values(FRAGRANCES_CATEGORY); // [15787, 15789]

// Una fragranza e un prodotto che appartiene all'albero fragranze. L'albero fragranze e
// "pulito" (solo le due root it/en) e ogni prodotto fragranza porta sempre la root nel
// proprio array di categorie (oltre a brand/sottocategorie), quindi basta controllare che
// una categoria sia la root o ne abbia la root come parent -> copre qualsiasi livello.
export const isFragranceProduct = (product: Pick<BaseProduct, 'categories'>): boolean =>
    product.categories?.some(({id, parent}) =>
        FRAGRANCE_CATEGORY_IDS.includes(id) || FRAGRANCE_CATEGORY_IDS.includes(parent as number)
    ) ?? false;

// Regola inversa (piu robusta dell'enumerare le categorie eyewear): e eyewear tutto cio
// che NON e una fragranza. Le categorie occhiali sono sparse e disomogenee (eyewear root,
// modello, optical...), quindi enumerarle e fragile e lasciava fuori prodotti come quelli
// messi direttamente sotto optical (es. 180-vista) -> resi col formato verticale da fragranza.
export const isEyewearProduct = (product: Pick<BaseProduct, 'categories'>): boolean =>
    !isFragranceProduct(product);

export const getDesignersCategories = (categories: WooProductCategory[]) =>
    categories.find(c => Object.values(EYEWEAR_CATEGORY).includes(c.id))?.child_items?.sort((a,b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
        return 0
    }) ?? []
export const getFragrancesCategories = (categories: WooProductCategory[]) =>
    categories.find(c => Object.values(FRAGRANCES_CATEGORY).includes(c.id))?.child_items?.sort((a,b) => a.menu_order - b.menu_order) ?? []

export const getOurProductionCategories = (categories: WooProductCategory[]) =>
    getDesignersCategories(categories)?.filter(category => Object.values(OUR_PRODUCTION_CATEGORIES).flat().includes(category.id)) ?? []


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

export function getVariationFromParams(product: BaseProduct | Product, params: ReadonlyURLSearchParams): BaseVariation | undefined {
    return product.variations?.find(variation => variation.attributes?.every(attribute => {
        let type = (attribute.id as string).replace('pa_', '');
        return params.has(type) && params.get(type) === attribute.option
    })) as BaseVariation;
}


export function getDefaultProduct(product: BaseProduct | Product, variation?: BaseVariation): {
    defaultProduct: BaseVariation | Variation,
    defaultAttributes: { [key in AttributeType]?: string }
} {
    const defaultProduct = variation ?? product?.variations?.[0] ?? {
        id: product.id,
        stock_status: product.stock_status,
        stock_quantity: product.stock_quantity,
        image: product.image,
        price: product.price,
        attributes: Object.keys(product?.attributes ?? {}).map((key) => {
            const attributes = product.attributes[key as AttributeType];
            return ({
                id: attributeKeyToTaxonomy(key),
                name: attributes && attributes[0].name,
                option: attributes && attributes[0].slug
            })
        })
    }
    const defaultAttributes: {  [key in AttributeType]?: string } = defaultProduct.attributes ? defaultProduct.attributes.reduce((obj, item) => {
        obj[taxonomyToAttributeKey(item.id.toString())] = item.option;
        return obj;
    }, {} as {[key: string]: string}) : {};

    return { defaultProduct, defaultAttributes };
}

export function findVariationFromAttributes(product: BaseProduct | Product, attributes: {  [key in AttributeType]?: string }): Variation | BaseVariation | undefined {
    const variations = product.variations as BaseVariation[];
    return variations?.find((variation: Variation | BaseVariation) =>
        VARIATION_MATCH_ATTRIBUTES.every((key) => {
            const wanted = attributes[key];
            if (!wanted) return true;
            const taxonomyId = attributeKeyToTaxonomy(key);
            return variation.attributes?.find((attribute) => attribute.id === taxonomyId)?.option === wanted;
        })
    )
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

export function formatDistance(date: Date | number, locale: 'it'|'en') {
    const lang = locale === 'it' ? {locale: it} : {};
    return fd(date, new Date(), { addSuffix: true, ...lang });
}

export function getProductMainCategory(product: BaseProduct): BaseCategory {

    return product?.categories?.find((category) =>
        category.parent &&
        [...Object.values(EYEWEAR_CATEGORY), ...Object.values(FRAGRANCES_CATEGORY)].includes(category.parent as number)
    ) ?? product?.categories?.[0];
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

export const getCartItemPrice = (item: Item, isEU: boolean) => (isEU && item.cart_item_data.priceEU) ?
    parseFloat((Number(item.cart_item_data.priceEU) * Number(item.quantity.value)).toFixed(2)) :
    parseFloat((Number(item.totals.total) + Number(item.totals.tax)).toFixed(1))

export const getIsEU = (customer?: Cart['customer']) => {
    let country = (!customer?.shipping_address?.shipping_country || customer?.shipping_address?.shipping_country === '') ?
        customer?.billing_address?.billing_country : customer?.shipping_address?.shipping_country

    country = (!country || country === '') ?
        'IT' : country
    return country !== 'IT'
}

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
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        totalTax: parseFloat(totalTax.toFixed(2))
    };
}

export const gtagAddToCart = (item: Item, productId: number, variantId: number|"") => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
            items: [{
                item_id: productId,
                item_name: item.name,
                item_variant: variantId,
                price: Number(item.price),
                quantity: item.quantity.value
            }],
        }
    })
}

export const gtagPurchase = (order: WooOrder) => {
    const event = {
        event: 'purchase',
        ecommerce: {
            currency: 'EUR',
            transaction_id: order.id.toString(),
            value: Number(order.total),
            tax: Number(order.total_tax),
            shipping: Number(order.shipping_total),
            items: order.line_items.map((item) => {
                return {
                    item_id: item.product_id.toString(),
                    item_name: item.name,
                    item_variant: item.variation_id?.toString(),
                    price: Number(item.total),
                    quantity: item.quantity
                }
            })
        }
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event)
};

type Consent = 'granted' | 'denied'
export const gtagConsent = (consent: {
    'ad_user_data': Consent,
    'ad_personalization': Consent,
    'ad_storage': Consent,
    'analytics_storage': Consent
}) => {
    window.gtag?.("consent", 'update', consent);
}

export const getInvoice = (customer?: LoggedCustomer) => ({
    vat: getCustomerMetaData('vat', '', customer),
    tax: getCustomerMetaData('tax', '', customer),
    sdi: getCustomerMetaData('sdi', '', customer),
    billingChoice: getCustomerMetaData('billing_choice', 'receipt', customer),
    invoiceType: getCustomerMetaData('invoice_type', 'private', customer)
})

export const getCustomerMetaData = (key: string, fallback: any, customer?: LoggedCustomer) => {
    return customer?.meta_data.find(({key: k}) => k === key)?.value ?? fallback
}

export const getProductCategoryLink = (category?: ProductCategory) => {
    return (category && (Object.values(FRAGRANCES_CATEGORY).includes(category.parent as number) ? '/' + category.slug : '/' +  DESIGNERS_SUB_PATH + '/' + category.slug)) ?? ''
}