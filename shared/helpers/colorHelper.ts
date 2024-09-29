import { ChartSeries } from '../types/chart';

/**
 * Generates a random color in hexadecimal format
 * @returns A hexadecimal color code
 */
export function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generates a color palette with a specified number of colors
 * @param count The number of colors to generate
 * @returns An array of hexadecimal color codes
 */
export function generateColorPalette(count: number): string[] {
  const palette: string[] = [];
  const hueStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    const [r, g, b] = hslToRgb(hue, 100, 50);
    palette.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
  }

  return palette;
}

/**
 * Darkens a given color by a specified percentage
 * @param color The color to darken in hexadecimal format
 * @param percentage The percentage to darken the color
 * @returns A darkened hexadecimal color code
 */
export function darkenColor(color: string, percentage: number): string {
  const [r, g, b] = hexToRgb(color);
  const factor = 1 - percentage / 100;
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Lightens a given color by a specified percentage
 * @param color The color to lighten in hexadecimal format
 * @param percentage The percentage to lighten the color
 * @returns A lightened hexadecimal color code
 */
export function lightenColor(color: string, percentage: number): string {
  const [r, g, b] = hexToRgb(color);
  const factor = 1 + percentage / 100;
  const newR = Math.min(Math.round(r * factor), 255);
  const newG = Math.min(Math.round(g * factor), 255);
  const newB = Math.min(Math.round(b * factor), 255);
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Returns either black or white, whichever provides better contrast with the given color
 * @param backgroundColor The background color in hexadecimal format
 * @returns Either '#000000' for black or '#FFFFFF' for white
 */
export function getContrastColor(backgroundColor: string): string {
  const [r, g, b] = hexToRgb(backgroundColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Assigns colors to chart series if they don't already have colors specified
 * @param series The chart series array
 * @returns The chart series with colors assigned
 */
export function assignColorsToChartSeries(series: ChartSeries[]): ChartSeries[] {
  const uncoloredSeries = series.filter(s => !s.color);
  const colorPalette = generateColorPalette(uncoloredSeries.length);

  return series.map(s => {
    if (!s.color) {
      return { ...s, color: colorPalette.shift() };
    }
    return s;
  });
}

/**
 * Converts HSL color values to RGB
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns An array of [r, g, b] values (0-255)
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4))
  ];
}

/**
 * Converts a hexadecimal color code to RGB values
 * @param hex The hexadecimal color code
 * @returns An array of [r, g, b] values (0-255)
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [0, 0, 0];
}

// Human tasks:
// TODO: Review the color generation algorithm to ensure it produces visually pleasing and accessible color palettes
// TODO: Consider adding functions for color blending or interpolation if needed for advanced chart customization
// TODO: Validate that the color manipulation functions work correctly with different color formats (hex, rgb, hsl)