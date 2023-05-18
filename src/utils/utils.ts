import sanitizeHtml from 'sanitize-html';
import {Color} from "../types/woocommerce";

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

