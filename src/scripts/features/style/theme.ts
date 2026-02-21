// src/scripts/features/style/theme.ts

import { CONFIG } from '../../core/config';
import { logger } from '../../utilities/logger';

export class ThemeModule {
  public styles: Record<string, string>;
  public presets: Record<string, Record<string, string>>;
  public defaultStyles: Record<string, string>;

  constructor() {
    this.styles = { ...CONFIG.DEFAULT_STYLES.COLORS };
    this.presets = { ...CONFIG.THEMES };
    this.defaultStyles = { ...this.styles };
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
    const preset = this.presets[scheme];
    if (preset) {
      for (const [cssVar, value] of Object.entries(preset)) {
        this.applyStyle(cssVar, value);
      }
    }
  }

  public loadSavedColors(savedColors: Record<string, string>): void {
    Object.assign(this.styles, savedColors);
    for (const [cssVar, value] of Object.entries(savedColors)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
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
