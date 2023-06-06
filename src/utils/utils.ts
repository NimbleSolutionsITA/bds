import sanitizeHtml from 'sanitize-html';
import {
    AttributeType,
    BaseProduct,
    BaseVariation,
    Color,
    Product,
    ShippingMethod,
    Variation
} from "../types/woocommerce";

export const sanitize = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
	allowedAttributes: {
      '*': ['style'],
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
export const PROFUMUM_ROMA_CATEGORY = {
    it:1166,
    en: 11732
}
export const LIQUIDES_IMAGINAIRES_CATEGORY = {
    it: 51,
    en: 518
}

export const SHOP_CATEGORIES = {
    optical: { it: 2796, en: 9604 },
    sunglasses: { it: 2990, en: 9602 }
}
export const MAIN_CATEGORIES = [
    EYEWEAR_CATEGORY.it,
    EYEWEAR_CATEGORY.en,
]


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