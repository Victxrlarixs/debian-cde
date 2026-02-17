// src/scripts/stylemanager.ts

import { CONFIG } from './config';

/**
 * Administrador de estilos CDE para personalización de colores y fuentes.
 */
export class StyleManager {
  public styles: Record<string, string>;
  public fontStyles: Record<string, string>;
  public presets: Record<string, Record<string, string>>;
  public fontPresets: Record<string, Record<string, string>>;
  public defaultStyles: Record<string, string>;
  public defaultFontStyles: Record<string, string>;
  public allStyles: Record<string, string>;
  public defaultAllStyles: Record<string, string>;

  constructor() {
    // Cargar valores por defecto desde CONFIG
    this.styles = { ...CONFIG.DEFAULT_STYLES.COLORS };
    this.fontStyles = { ...CONFIG.DEFAULT_STYLES.FONTS };
    this.presets = { ...CONFIG.THEMES };
    this.fontPresets = { ...CONFIG.FONT_PRESETS };

    this.defaultStyles = { ...this.styles };
    this.defaultFontStyles = { ...this.fontStyles };
    this.allStyles = { ...this.styles, ...this.fontStyles };
    this.defaultAllStyles = { ...this.defaultStyles, ...this.defaultFontStyles };
  }

  public init(): void {
    this.loadSavedStyles();
    this.bindEvents();
    this.setupColorInputs();
    this.setupFontControls();
    this.updateUI();
    this.updateFontControls();
  }

  private bindEvents(): void {
    const styleManagerIcon = document.querySelector(
      '.cde-icon img[src*="appearance"]'
    )?.parentElement;
    if (styleManagerIcon) {
      styleManagerIcon.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    const closeBtn = document.querySelector('#styleManager .close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const applyBtn = document.querySelector('#styleManager .cde-btn-default');
    if (applyBtn) applyBtn.addEventListener('click', () => this.apply());

    const resetBtn = document.querySelector('#styleManager .cde-btn:nth-child(2)');
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

    const saveBtn = document.querySelector('#styleManager .cde-btn:nth-child(3)');
    if (saveBtn) saveBtn.addEventListener('click', () => this.save());

    document.querySelectorAll('.cde-preset[data-scheme]').forEach((btn) => {
      btn.removeEventListener('click', this.handlePresetClick);
      btn.addEventListener('click', this.handlePresetClick);
    });

    document.querySelectorAll('.cde-preset[data-preset][data-type="font"]').forEach((btn) => {
      btn.removeEventListener('click', this.handleFontPresetClick);
      btn.addEventListener('click', this.handleFontPresetClick);
    });

    const fontPresetNames = ['classic-cde', 'modern', 'retro', 'terminal'];
    document.querySelectorAll('.cde-preset[data-preset]').forEach((btn) => {
      const presetName = btn.getAttribute('data-preset');
      if (presetName && fontPresetNames.includes(presetName)) {
        btn.removeEventListener('click', this.handleFontPresetClick);
        btn.addEventListener('click', this.handleFontPresetClick);
      }
    });

    document.querySelectorAll('.cde-category').forEach((cat) => {
      cat.removeEventListener('click', this.handleCategoryClick);
      cat.addEventListener('click', this.handleCategoryClick);
    });

    const titlebar = document.getElementById('styleManagerTitlebar');
    if (titlebar) titlebar.addEventListener('mousedown', (e) => this.startDrag(e));
  }

  private handlePresetClick = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const scheme = target.dataset.scheme;
    if (scheme) {
      this.applyPreset(scheme);
      this.highlightActiveColorPreset(target);
    }
  };

  private handleFontPresetClick = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const presetName = target.dataset.preset;
    if (presetName) {
      this.applyFontPreset(presetName);
      this.highlightActiveFontPreset(target);
    }
  };

  private handleCategoryClick = (e: Event): void => {
    const target = e.currentTarget as HTMLElement;
    const category = target.dataset.category;
    if (category) {
      this.setActiveCategory(category);
    }
  };

  public highlightActiveColorPreset(activeButton: HTMLElement): void {
    document
      .querySelectorAll('.cde-preset[data-scheme]')
      .forEach((btn) => btn.classList.remove('active'));
    document
      .querySelectorAll('.cde-preset[data-preset][data-type="font"]')
      .forEach((btn) => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  public highlightActiveFontPreset(activeButton: HTMLElement): void {
    document
      .querySelectorAll('.cde-preset[data-preset][data-type="font"]')
      .forEach((btn) => btn.classList.remove('active'));
    document
      .querySelectorAll('.cde-preset[data-scheme]')
      .forEach((btn) => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  private setupColorInputs(): void {
    const colorMap: Record<string, string> = {
      'color-workspace': '--workspace-color',
      'color-title-active': '--titlebar-color',
      'color-background': '--window-color',
      'color-highlight': '--highlight-color',
      'color-text': '--text-color',
    };

    Object.entries(colorMap).forEach(([inputId, cssVar]) => {
      const input = document.getElementById(inputId) as HTMLInputElement | null;
      if (input) {
        input.addEventListener('input', (e) => {
          const value = (e.target as HTMLInputElement).value;
          this.applyStyle(cssVar, value);
          const selector = input.closest('.cde-colorselector');
          if (selector) {
            const swatch = selector.querySelector('.cde-colorswatch') as HTMLElement | null;
            const nameSpan = selector.querySelector('.cde-colorname') as HTMLElement | null;
            if (swatch) swatch.style.backgroundColor = value;
            if (nameSpan) nameSpan.textContent = this.getColorName(value);
          }
          this.updateStatus(`Changed: ${cssVar}`);
        });
      }
    });
  }

  private setupFontControls(): void {
    this.setupFontSelect('font-family-base', '--font-family-base');
    this.setupFontSelect('font-family-terminal', '--font-family-terminal');
    this.setupSlider('font-size-base', '--font-size-base', 'font-size-value', 'px');
    this.setupSlider('font-size-title', '--font-size-title', 'font-size-title-value', 'px');
    this.setupSlider('line-height-base', '--line-height-base', 'line-height-value', '');
    this.setupFontSelect('font-weight', '--font-weight-normal');

    document.querySelectorAll('.cde-select, .cde-slider').forEach((control) => {
      control.addEventListener('input', () => this.updateFontPreview());
    });

    this.updateFontControls();
  }

  private setupFontSelect(elementId: string, cssVar: string): void {
    const select = document.getElementById(elementId) as HTMLSelectElement | null;
    if (select) {
      select.addEventListener('change', (e) => {
        this.applyFontStyle(cssVar, (e.target as HTMLSelectElement).value);
        this.updateFontPreview();
        this.updateStatus(`Font changed: ${cssVar}`);
      });
    }
  }

  private setupSlider(
    sliderId: string,
    cssVar: string,
    valueId: string,
    suffix: string = ''
  ): void {
    const slider = document.getElementById(sliderId) as HTMLInputElement | null;
    const valueSpan = document.getElementById(valueId) as HTMLElement | null;

    if (slider && valueSpan) {
      slider.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value + suffix;
        this.applyFontStyle(cssVar, value);
        valueSpan.textContent = (e.target as HTMLInputElement).value + suffix;
        this.updateFontPreview();
      });
    }
  }

  private getLabelFromId(id: string): string {
    const labels: Record<string, string> = {
      'color-workspace': 'Workspace',
      'color-title-active': 'Active Title',
      'color-background': 'Background',
      'color-highlight': 'Highlight',
      'color-text': 'Text Color',
    };
    return labels[id] || id.replace('color-', '').replace(/-/g, ' ');
  }

  public open(): void {
    const modal = document.getElementById('styleManager') as HTMLElement | null;
    if (modal) {
      modal.style.display = 'flex';
      modal.style.zIndex = '10000';
    }
  }

  public close(): void {
    const modal = document.getElementById('styleManager') as HTMLElement | null;
    if (modal) {
      modal.style.display = 'none';
    }
  }

  public applyStyle(cssVar: string, value: string): void {
    document.documentElement.style.setProperty(cssVar, value);
    this.styles[cssVar] = value;
  }

  public applyFontStyle(cssVar: string, value: string): void {
    document.documentElement.style.setProperty(cssVar, value);
    this.fontStyles[cssVar] = value;
    this.allStyles[cssVar] = value;
  }

  public apply(): void {
    this.applyAllStyles();
    this.applyAllFontStyles();
    this.updateStatus('All changes applied');
    this.showMessage('Styles applied successfully.');
  }

  private applyAllStyles(): void {
    for (const [cssVar, value] of Object.entries(this.styles)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
  }

  private applyAllFontStyles(): void {
    for (const [cssVar, value] of Object.entries(this.fontStyles)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
  }

  public applyPreset(scheme: string): void {
    const preset = this.presets[scheme];
    if (preset) {
      console.log(`Applying preset: ${scheme}`);
      for (const [cssVar, value] of Object.entries(preset)) {
        this.applyStyle(cssVar, value);
        // Actualizar input si existe
        const input = document.querySelector(
          `input[data-var="${cssVar}"]`
        ) as HTMLInputElement | null;
        if (input) {
          input.value = value;
          const selector = input.closest('.cde-colorselector');
          if (selector) {
            const swatch = selector.querySelector('.cde-colorswatch') as HTMLElement | null;
            const nameSpan = selector.querySelector('.cde-colorname') as HTMLElement | null;
            if (swatch) swatch.style.backgroundColor = value;
            if (nameSpan) nameSpan.textContent = this.getColorName(value);
          }
        }
      }
      this.updateStatus(`Applied theme: ${scheme}`);
      this.showMessage(`${scheme} theme applied.`);
    }
  }

  public applyFontPreset(presetName: string): void {
    const preset = this.fontPresets[presetName];
    if (preset) {
      console.log(`Applying font preset: ${presetName}`);
      for (const [cssVar, value] of Object.entries(preset)) {
        this.applyFontStyle(cssVar, value);
      }
      this.updateFontControls();
      this.updateStatus(`Applied font preset: ${presetName}`);
      this.showMessage(`${presetName} font preset applied.`);
    }
  }

  public reset(): void {
    for (const [cssVar, value] of Object.entries(this.defaultStyles)) {
      this.applyStyle(cssVar, value);
    }
    for (const [cssVar, value] of Object.entries(this.defaultFontStyles)) {
      this.applyFontStyle(cssVar, value);
    }
    this.updateUI();
    this.updateFontControls();
    this.updateStatus('Reset to default');
    this.showMessage('Reset to default theme and fonts.');
    document
      .querySelectorAll('.cde-preset.active')
      .forEach((btn) => btn.classList.remove('active'));
  }

  public save(): void {
    try {
      const allSettings = {
        colors: this.styles,
        fonts: this.fontStyles,
      };
      localStorage.setItem('cde-styles', JSON.stringify(allSettings));
      this.updateStatus('All settings saved');
      this.showMessage('Configuration saved.');
      console.log('Styles and fonts saved to localStorage');
    } catch (e) {
      this.showMessage('Error saving configuration.');
      console.error('Error saving styles:', e);
    }
  }

  private loadSavedStyles(): void {
    try {
      const saved = localStorage.getItem('cde-styles');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        if (savedSettings.colors) {
          Object.assign(this.styles, savedSettings.colors);
          this.applyAllStyles();
        }
        if (savedSettings.fonts) {
          Object.assign(this.fontStyles, savedSettings.fonts);
          this.applyAllFontStyles();
        }
        console.log('Loaded saved styles and fonts from localStorage');
      }
    } catch (e) {
      console.log('No saved styles found');
    }
  }

  public updateUI(): void {
    for (const [cssVar, value] of Object.entries(this.styles)) {
      const input = document.querySelector(
        `input[data-var="${cssVar}"]`
      ) as HTMLInputElement | null;
      if (input) {
        input.value = value;
        const selector = input.closest('.cde-colorselector');
        if (selector) {
          const swatch = selector.querySelector('.cde-colorswatch') as HTMLElement | null;
          const nameSpan = selector.querySelector('.cde-colorname') as HTMLElement | null;
          if (swatch) swatch.style.backgroundColor = value;
          if (nameSpan) nameSpan.textContent = this.getColorName(value);
        }
      }
    }
    console.log('UI updated with current styles');
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

  private updateFontPreview(): void {
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

  public testFontPreview(): void {
    this.updateFontPreview();
    this.showMessage('Font preview updated.');
  }

  public setActiveCategory(category: string): void {
    document.querySelectorAll('.cde-category').forEach((cat) => cat.classList.remove('active'));
    document
      .querySelectorAll('.cde-controlgroup')
      .forEach((panel) => panel.classList.remove('active'));

    const activeCat = document.querySelector(`.cde-category[data-category="${category}"]`);
    const activePanel = document.getElementById(`${category}-panel`);

    if (activeCat) activeCat.classList.add('active');
    if (activePanel) activePanel.classList.add('active');

    this.updateStatus(`Viewing: ${category}`);
  }

  private getColorName(hex: string): string {
    const colors: Record<string, string> = {
      '#000000': 'Black',
      '#ffffff': 'White',
      '#c0c0c0': 'Light Gray',
      '#808080': 'Gray',
      '#404040': 'Dark Gray',
      '#000080': 'Navy Blue',
      '#0000ff': 'Blue',
      '#008000': 'Green',
      '#00ff00': 'Lime',
      '#800000': 'Maroon',
      '#ff0000': 'Red',
      '#800080': 'Purple',
      '#ff00ff': 'Magenta',
      '#808000': 'Olive',
      '#ffff00': 'Yellow',
      '#008080': 'Teal',
      '#00ffff': 'Cyan',
      '#a0a0a0': 'Gray',
      '#e0d0c0': 'Sand',
      '#a0c0e0': 'Marine',
      '#c0c0a0': 'Olive',
      '#c6bdb3': 'Beige',
      '#dcd6cc': 'Cream',
      '#4a6c7a': 'Steel Blue',
      '#070b0d': 'Dark Slate',
      '#c7fbe3': 'Mint',
      '#e6e1d8': 'Pearl',
      '#bfb6aa': 'Taupe',
      '#bfb9ad': 'Warm Gray',
      '#e0dad0': 'Light Cream',
      '#d8d1c6': 'Cream Gray',
      '#8f877d': 'Dark Taupe',
      '#00ff88': 'Cyber Green',
      '#006400': 'Dark Green',
      '#000060': 'Dark Navy',
      '#806040': 'Brown',
      '#202020': 'Charcoal',
      '#303030': 'Dark Gray',
      '#505050': 'Medium Gray',
      '#000020': 'Midnight Blue',
      '#000030': 'Deep Navy',
      '#000040': 'Night Blue',
      '#0080ff': 'Azure',
      '#d8c8a8': 'Desert Sand',
      '#a08040': 'Golden Brown',
    };
    return colors[hex.toLowerCase()] || hex.toUpperCase();
  }

  private updateStatus(message: string): void {
    const statusElement = document.getElementById('style-status');
    if (statusElement) statusElement.textContent = message;
  }

  private showMessage(message: string): void {
    const msgBox = document.createElement('div');
    msgBox.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--modal-bg, #c0c0c0);
      border: 2px solid;
      border-top-color: var(--border-light, #ffffff);
      border-left-color: var(--border-light, #ffffff);
      border-right-color: var(--border-dark, #404040);
      border-bottom-color: var(--border-dark, #404040);
      padding: 20px;
      z-index: 10001;
      font-family: var(--font-family-base, monospace);
      font-size: 12px;
      color: #000000;
      box-shadow: 4px 4px 0 var(--shadow-color, #000000);
      min-width: 200px;
      text-align: center;
    `;
    msgBox.innerHTML = `<div style="margin-bottom: 10px;">${message}</div>`;
    document.body.appendChild(msgBox);
    setTimeout(() => msgBox.parentNode?.removeChild(msgBox), 2000);
  }

  private startDrag(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('close-btn')) return;
    const modal = document.getElementById('styleManager') as HTMLElement | null;
    if (!modal) return;

    const rect = modal.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const onMouseMove = (moveEvent: MouseEvent) => {
      modal.style.left = `${moveEvent.clientX - offsetX}px`;
      modal.style.top = `${moveEvent.clientY - offsetY}px`;
      modal.style.transform = 'none';
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  }
}

// Declaración global para window.styleManager
declare global {
  interface Window {
    styleManager?: StyleManager;
    openStyleManager?: () => void;
    switchStyleTab?: (category: string) => void;
  }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.styleManager = new StyleManager();
  setTimeout(() => window.styleManager?.init(), 100);
  window.openStyleManager = () => window.styleManager?.open();

  // Arrastre de la ventana Style Manager (ya manejado dentro de la clase, pero mantenemos compatibilidad)
  const styleManagerEl = document.getElementById('styleManager');
  const styleManagerTitlebar = document.getElementById('styleManagerTitlebar');
  if (styleManagerEl && styleManagerTitlebar) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    styleManagerTitlebar.addEventListener('mousedown', function (e) {
      if ((e.target as HTMLElement).classList.contains('close-btn')) return;
      isDragging = true;
      const rect = styleManagerEl.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    });

    function onMouseMove(e: MouseEvent) {
      if (!isDragging || !styleManagerEl) return;
      styleManagerEl.style.left = e.clientX - dragOffset.x + 'px';
      styleManagerEl.style.top = e.clientY - dragOffset.y + 'px';
      styleManagerEl.style.transform = 'none';
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }
});

// Exponer función global para cambiar pestañas
window.switchStyleTab = function (category: string) {
  window.styleManager?.setActiveCategory(category);
};
