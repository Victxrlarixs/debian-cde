// src/scripts/features/style/font.ts

import { CONFIG } from '../../core/config';
import { logger } from '../../utilities/logger';

export class FontModule {
  public fontStyles: Record<string, string>;
  public fontPresets: Record<string, Record<string, string>>;
  public defaultFontStyles: Record<string, string>;

  constructor() {
    this.fontStyles = { ...CONFIG.DEFAULT_STYLES.FONTS };
    this.fontPresets = { ...CONFIG.FONT_PRESETS };
    this.defaultFontStyles = { ...this.fontStyles };
  }

  public applyFontStyle(cssVar: string, value: string): void {
    document.documentElement.style.setProperty(cssVar, value);
    this.fontStyles[cssVar] = value;
  }

  public applyFont(): void {
    for (const [cssVar, value] of Object.entries(this.fontStyles)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
    this.updateFontPreview();
  }

  public resetFont(): void {
    for (const [cssVar, value] of Object.entries(this.defaultFontStyles)) {
      this.applyFontStyle(cssVar, value);
    }
  }

  public applyFontPreset(presetName: string): void {
    const preset = this.fontPresets[presetName];
    if (preset) {
      for (const [cssVar, value] of Object.entries(preset)) {
        this.applyFontStyle(cssVar, value);
      }
    }
  }

  public loadSavedFonts(savedFonts: Record<string, string>): void {
    Object.assign(this.fontStyles, savedFonts);
    for (const [cssVar, value] of Object.entries(savedFonts)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
  }

  public updateFontPreview(): void {
    const preview = document.getElementById('font-preview');
    if (!preview) return;

    preview.style.fontFamily = this.fontStyles['--font-family-base'];
    preview.style.fontSize = this.fontStyles['--font-size-base'];
    preview.style.lineHeight = this.fontStyles['--line-height-base'];

    const title = preview.querySelector('.font-preview-title') as HTMLElement | null;
    if (title) {
      title.style.fontSize = this.fontStyles['--font-size-title'];
      title.style.fontWeight = this.fontStyles['--font-weight-bold'] || '700';
      title.style.fontFamily = this.fontStyles['--font-family-base'];
    }

    const text = preview.querySelector('.font-preview-text') as HTMLElement | null;
    if (text) {
      text.style.fontSize = this.fontStyles['--font-size-base'];
      text.style.fontWeight = this.fontStyles['--font-weight-normal'] || '400';
      text.style.fontFamily = this.fontStyles['--font-family-base'];
    }

    const terminal = preview.querySelector('.font-preview-terminal') as HTMLElement | null;
    if (terminal) {
      terminal.style.fontFamily = this.fontStyles['--font-family-terminal'];
      terminal.style.fontSize = this.fontStyles['--font-size-base'];
    }

    const small = preview.querySelector('.font-preview-small') as HTMLElement | null;
    if (small) {
      small.style.fontSize = this.fontStyles['--font-size-small'] || '11px';
      small.style.fontFamily = this.fontStyles['--font-family-base'];
    }
  }

  public updateFontControls(): void {
    const baseFont =
      this.fontStyles['--font-family-base'] || CONFIG.DEFAULT_STYLES.FONTS['--font-family-base'];
    const terminalFont =
      this.fontStyles['--font-family-terminal'] ||
      CONFIG.DEFAULT_STYLES.FONTS['--font-family-terminal'];
    const fontSize = parseInt(this.fontStyles['--font-size-base'] || '12');
    const titleSize = parseInt(this.fontStyles['--font-size-title'] || '13');
    const lineHeight = parseFloat(this.fontStyles['--line-height-base'] || '1.45');
    const fontWeight = this.fontStyles['--font-weight-normal'] || '400';

    this.setSelectValue('font-family-base', baseFont);
    this.setSelectValue('font-family-terminal', terminalFont);
    this.setSliderValue('font-size-base', fontSize, 'font-size-value', 'px');
    this.setSliderValue('font-size-title', titleSize, 'font-size-title-value', 'px');
    this.setSliderValue('line-height-base', lineHeight, 'line-height-value', '');
    this.setSelectValue('font-weight', fontWeight);

    this.updateFontPreview();
  }

  private setSelectValue(id: string, value: string): void {
    const select = document.getElementById(id) as HTMLSelectElement | null;
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === value) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }

  private setSliderValue(sliderId: string, value: number, valueId: string, suffix: string): void {
    const slider = document.getElementById(sliderId) as HTMLInputElement | null;
    const valueSpan = document.getElementById(valueId) as HTMLElement | null;
    if (slider) slider.value = String(value);
    if (valueSpan) valueSpan.textContent = value + suffix;
  }
}
