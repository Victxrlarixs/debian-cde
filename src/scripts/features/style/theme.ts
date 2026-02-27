// src/scripts/features/style/theme.ts

import { CONFIG } from '../../core/config';
import { logger } from '../../utilities/logger';
import { getCdeShades, getContrastColor, blendColors } from '../../utilities/colorutils';
import cdePalettes from '../../../data/cde_palettes.json';

export interface CdePalette {
  id: string;
  name: string;
  colors: string[];
}

export class ThemeModule {
  public styles: Record<string, string>;
  public cdePalettes: CdePalette[];
  public defaultStyles: Record<string, string>;
  public currentPaletteId: string | null = null;

  constructor() {
    this.styles = { ...CONFIG.DEFAULT_STYLES.COLORS };
    this.cdePalettes = cdePalettes as CdePalette[];
    this.defaultStyles = { ...this.styles };
  }

  /**
   * Applies an authentic CDE palette by index or ID.
   * Maps CDE ColorSets to CSS variables and generates shades.
   */
  public applyCdePalette(id: string): void {
    const palette = this.cdePalettes.find((p) => p.id === id);
    if (!palette) {
      logger.warn(`[ThemeModule] Palette not found: ${id}`);
      return;
    }

    // Store the current palette ID for sharing
    this.currentPaletteId = id;

    const c = palette.colors;
    // CDE Mapping (8 Colors):
    // 0: Accent/Active (Titlebar)
    // 1: Background (Window)
    // 2: Workspace Background
    // 3: Secondary Accent
    // 4-7: Additional UI variations

    const titlebarBg = c[0];
    const windowBg = c[1];
    const titlebarShades = getCdeShades(titlebarBg);
    const windowShades = getCdeShades(windowBg);

    const newTheme: Record<string, string> = {
      '--window-color': windowBg,
      '--topbar-color': windowBg,
      '--modal-bg': windowBg,
      '--button-bg': windowBg,
      '--dock-color': windowBg,
      '--menu-color': windowBg,

      '--titlebar-color': titlebarBg,
      '--scrollbar-color': titlebarBg,
      '--titlebar-text-color': getContrastColor(titlebarBg),
      '--text-color': getContrastColor(windowBg),

      '--border-light': windowShades.light,
      '--border-dark': windowShades.dark,
      '--border-inset-light': blendColors(windowBg, '#FFFFFF', 0.1),
      '--border-inset-dark': blendColors(windowBg, '#000000', 0.2),

      '--dock-icon-bg': blendColors(windowBg, '#000000', 0.05),
      '--dock-icon-hover': blendColors(windowBg, '#FFFFFF', 0.1),
      '--dock-icon-active': windowShades.dark,
      '--button-active': windowShades.dark,
      '--separator-color': windowShades.dark,
      '--shadow-color': 'rgba(0, 0, 0, 0.3)',
    };

    for (const [cssVar, value] of Object.entries(newTheme)) {
      this.applyStyle(cssVar, value);
    }

    logger.log(`[ThemeModule] Applied CDE Palette: ${palette.name}`);
  }

  public applyStyle(cssVar: string, value: string): void {
    document.documentElement.style.setProperty(cssVar, value);
    this.styles[cssVar] = value;
  }

  public applyColor(): void {
    for (const [cssVar, value] of Object.entries(this.styles)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
  }

  public resetColor(): void {
    for (const [cssVar, value] of Object.entries(this.defaultStyles)) {
      this.applyStyle(cssVar, value);
    }
  }

  public applyPreset(scheme: string): void {
    // If it's a CDE palette ID, use the new logic
    if (this.cdePalettes.some((p) => p.id === scheme)) {
      this.applyCdePalette(scheme);
    } else {
      logger.warn(`[ThemeModule] Preset not found in CDE palettes: ${scheme}`);
    }
  }

  public loadSavedColors(savedColors: Record<string, string>): void {
    Object.assign(this.styles, savedColors);
    this.applyColor();
  }

  public updateUI(): void {
    for (const [cssVar, value] of Object.entries(this.styles)) {
      const input = document.querySelector(
        `input[data-var="${cssVar}"]`
      ) as HTMLInputElement | null;
      if (input) {
        input.value = value;
        this.updateSwatchForInput(input);
      }
    }
  }

  public updateSwatchForInput(input: HTMLInputElement): void {
    const swatch = input.previousElementSibling as HTMLElement | null;
    if (swatch && swatch.classList.contains('color-swatch-btn')) {
      swatch.style.backgroundColor = input.value;
    }
  }
}
