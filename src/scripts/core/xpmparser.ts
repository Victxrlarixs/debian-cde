// src/scripts/core/xpmparser.ts
//
// Parses X PixMap (XPM) format used by CDE backdrops (.pm files).
// Maps CDE semantic color names to active CSS theme variables,
// so the backdrop automatically inherits the current theme palette.

import { logger } from '../utilities/logger';

/**
 * CDE semantic color → CSS variable mapping.
 * When the XPM defines `s background`, it means "use the desktop background color".
 * We map that to the active theme variable.
 */
const CDE_SEMANTIC_MAP: Record<string, string> = {
  background: '--window-color',
  selectColor: '--titlebar-color',
  foreground: '--text-color',
  topShadowColor: '--border-light',
  bottomShadowColor: '--border-dark',
  selectBackground: '--dock-color',
  activeForeground: '--titlebar-text-color',
  activeBackground: '--titlebar-color',
  troughColor: '--button-active',
  highlightColor: '--border-light',
  backgroundColor: '--window-color',
};

/** Convert 16-bit-per-channel XPM hex (#RRRRGGGGBBBB) to CSS #RRGGBB */
function normalizeXpmColor(raw: string): string {
  if (!raw.startsWith('#')) return raw;
  const hex = raw.slice(1);
  if (hex.length === 12) {
    // Take high byte of each 16-bit channel
    const r = hex.slice(0, 2);
    const g = hex.slice(4, 6);
    const b = hex.slice(8, 10);
    return `#${r}${g}${b}`;
  }
  if (hex.length === 6) return raw;
  return raw;
}

/** Resolve a CDE color entry to an actual CSS color string */
function resolveColor(entry: string, root: CSSStyleDeclaration): string {
  // Check for 'None' (transparent)
  if (entry.toLowerCase() === 'none') return 'transparent';

  // Check for symbolic semantic color: `s semanticName`
  const semanticMatch = entry.match(/s\s+(\w+)/);
  if (semanticMatch) {
    const semanticName = semanticMatch[1];
    const cssVar = CDE_SEMANTIC_MAP[semanticName];
    if (cssVar) {
      const val = root.getPropertyValue(cssVar).trim();
      if (val) return val;
    }
  }

  // Fall back to literal color value: `c #RRRRGGGGBBBB` or `c #RRGGBB`
  const colorMatch = entry.match(/c\s+(#[0-9a-fA-F]+|[a-zA-Z]+)/);
  if (colorMatch) {
    return normalizeXpmColor(colorMatch[1]);
  }

  return '#808080'; // ultimate fallback
}

/** Parse XPM text and render to a canvas, returning a pattern data URL */
export async function parseXpmToDataUrl(xpmText: string): Promise<string | null> {
  try {
    // Strip C-style comments
    const text = xpmText.replace(/\/\*.*?\*\//gs, '');

    // Extract all quoted strings
    const strings = Array.from(text.matchAll(/"(.*?)"/gs)).map((m) => m[1].replace(/\\n/g, ''));

    if (strings.length < 2) {
      logger.warn('[XPMParser] Not enough data in file');
      return null;
    }

    // Parse header: "width height numColors charsPerPixel"
    const header = strings[0].trim().split(/\s+/).map(Number);
    const [width, height, numColors, cpp] = header;

    if (!width || !height || !numColors || !cpp) {
      logger.warn('[XPMParser] Invalid header:', strings[0]);
      return null;
    }

    // Get current theme CSS variables
    const root = getComputedStyle(document.documentElement);

    // Parse color table
    const colorTable: Map<string, string> = new Map();
    for (let i = 1; i <= numColors; i++) {
      const entry = strings[i];
      const symbol = entry.slice(0, cpp);
      const colorDef = entry.slice(cpp).trim();
      colorTable.set(symbol, resolveColor(colorDef, root));
    }

    // Parse pixel rows
    const pixelRows: string[] = [];
    for (let i = numColors + 1; i < strings.length && pixelRows.length < height; i++) {
      if (strings[i].length >= width * cpp) {
        pixelRows.push(strings[i]);
      }
    }

    if (pixelRows.length < height) {
      logger.warn(`[XPMParser] Only got ${pixelRows.length}/${height} pixel rows`);
    }

    // Render to canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    for (let y = 0; y < pixelRows.length; y++) {
      const row = pixelRows[y];
      for (let x = 0; x < width; x++) {
        const symbol = row.slice(x * cpp, x * cpp + cpp);
        const color = colorTable.get(symbol) ?? '#808080';
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const dataUrl = canvas.toDataURL('image/png');
    logger.log(`[XPMParser] Rendered ${width}x${height} XPM pattern`);
    return dataUrl;
  } catch (err) {
    logger.error('[XPMParser] Parse error:', err);
    return null;
  }
}

/** Fetch a .pm file and render it as a repeating background data URL */
export async function loadXpmBackdrop(path: string): Promise<string | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      logger.warn(`[XPMParser] Failed to fetch: ${path}`);
      return null;
    }
    const text = await res.text();
    return await parseXpmToDataUrl(text);
  } catch (err) {
    logger.error('[XPMParser] Fetch error:', err);
    return null;
  }
}
