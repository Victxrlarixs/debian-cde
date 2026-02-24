// src/scripts/utilities/colorutils.ts

/**
 * Normalizes a 16-bit-per-channel XPM/CDE hex color (#RRRRGGGGBBBB) to 8-bit (#RRGGBB).
 */
export function normalizeCdeColor(hex: string): string {
  if (!hex.startsWith('#')) return hex;
  const raw = hex.slice(1);
  if (raw.length === 12) {
    const r = raw.slice(0, 2);
    const g = raw.slice(4, 6);
    const b = raw.slice(8, 10);
    return `#${r}${g}${b}`;
  }
  return hex;
}

/**
 * Converts hex to RGB.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Converts RGB to hex.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * Calculate light/dark shades for 3D bevels following CDE logic.
 */
export function getCdeShades(baseHex: string) {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return { light: '#FFFFFF', dark: '#000000' };

  const factor = 0.3; // Approx 30% lighter/darker
  
  const light = {
    r: Math.min(255, rgb.r + (255 - rgb.r) * factor),
    g: Math.min(255, rgb.g + (255 - rgb.g) * factor),
    b: Math.min(255, rgb.b + (255 - rgb.b) * factor)
  };

  const dark = {
    r: Math.max(0, rgb.r * (1 - factor)),
    g: Math.max(0, rgb.g * (1 - factor)),
    b: Math.max(0, rgb.b * (1 - factor))
  };

  return {
    light: rgbToHex(Math.round(light.r), Math.round(light.g), Math.round(light.b)),
    dark: rgbToHex(Math.round(dark.r), Math.round(dark.g), Math.round(dark.b))
  };
}

/**
 * Determines contrast color (black or white) for a given background hex.
 */
export function getContrastColor(backgroundHex: string): string {
  const rgb = hexToRgb(backgroundHex);
  if (!rgb) return '#000000';
  
  // Perceptive luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Blend two colors given a ratio (0 to 1).
 */
export function blendColors(c1: string, c2: string, ratio: number): string {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  if (!rgb1 || !rgb2) return c1;

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

  return rgbToHex(r, g, b);
}
