// src/scripts/stylemanager.ts

import { CONFIG } from '../core/config';

/**
 * CDE Style Manager for customization of colors and fonts.
 * Now handles multiple independent windows.
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
    // Load default values from CONFIG
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
    this.makeAllWindowsDraggable();
  }

  private bindEvents(): void {
    // Icon in the dock to open the main Style Manager
    const styleManagerIcon = document.querySelector(
      '.cde-icon img[src*="appearance"]'
    )?.parentElement;
    if (styleManagerIcon) {
      styleManagerIcon.addEventListener('click', (e) => {
        e.preventDefault();
        this.openMain();
      });
    }

    // Close buttons for each window (defined in their components)
    const closeMain = document.querySelector('#styleManagerMain .close-btn');
    if (closeMain) closeMain.addEventListener('click', () => this.closeMain());

    const closeColor = document.querySelector('#styleManagerColor .close-btn');
    if (closeColor) closeColor.addEventListener('click', () => this.closeColor());

    const closeFont = document.querySelector('#styleManagerFont .close-btn');
    if (closeFont) closeFont.addEventListener('click', () => this.closeFont());

    const closeBackdrop = document.querySelector('#styleManagerBackdrop .close-btn');
    if (closeBackdrop) closeBackdrop.addEventListener('click', () => this.closeBackdrop());

    // Apply, Reset, Save buttons for Color window
    const applyColorBtn = document.querySelector('#styleManagerColor .cde-btn-default');
    if (applyColorBtn) applyColorBtn.addEventListener('click', () => this.applyColor());

    const resetColorBtn = document.querySelector('#styleManagerColor .cde-btn:nth-child(2)');
    if (resetColorBtn) resetColorBtn.addEventListener('click', () => this.resetColor());

    const saveColorBtn = document.querySelector('#styleManagerColor .cde-btn:nth-child(3)');
    if (saveColorBtn) saveColorBtn.addEventListener('click', () => this.saveColor());

    // Apply, Reset, Save buttons for Font window
    const applyFontBtn = document.querySelector('#styleManagerFont .cde-btn-default');
    if (applyFontBtn) applyFontBtn.addEventListener('click', () => this.applyFont());

    const resetFontBtn = document.querySelector('#styleManagerFont .cde-btn:nth-child(2)');
    if (resetFontBtn) resetFontBtn.addEventListener('click', () => this.resetFont());

    const saveFontBtn = document.querySelector('#styleManagerFont .cde-btn:nth-child(3)');
    if (saveFontBtn) saveFontBtn.addEventListener('click', () => this.saveFont());

    // Color presets
    document.querySelectorAll('.cde-preset[data-scheme]').forEach((btn) => {
      btn.removeEventListener('click', this.handlePresetClick);
      btn.addEventListener('click', this.handlePresetClick);
    });

    // Font presets
    document.querySelectorAll('.cde-preset[data-preset]').forEach((btn) => {
      btn.removeEventListener('click', this.handleFontPresetClick);
      btn.addEventListener('click', this.handleFontPresetClick);
    });
  }

  // --- Preset handlers ---
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

  public highlightActiveColorPreset(activeButton: HTMLElement): void {
    document
      .querySelectorAll('.cde-preset[data-scheme]')
      .forEach((btn) => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  public highlightActiveFontPreset(activeButton: HTMLElement): void {
    document
      .querySelectorAll('.cde-preset[data-preset]')
      .forEach((btn) => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  // --- Color input setup ---
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
          }
          this.updateStatus('Color changed', 'colorStatus');
        });
      }
    });
  }

  // --- Font control setup ---
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
        this.updateStatus('Font changed', 'fontStatus');
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

  // --- Opening and closing specific windows ---
  public openMain(): void {
    this.showWindow('styleManagerMain');
  }

  public closeMain(): void {
    this.hideWindow('styleManagerMain');
  }

  public openColor(): void {
    this.showWindow('styleManagerColor');
  }

  public closeColor(): void {
    this.hideWindow('styleManagerColor');
  }

  public openFont(): void {
    this.showWindow('styleManagerFont');
  }

  public closeFont(): void {
    this.hideWindow('styleManagerFont');
  }

  public openBackdrop(): void {
    this.showWindow('styleManagerBackdrop');
  }

  public closeBackdrop(): void {
    this.hideWindow('styleManagerBackdrop');
  }

  // Methods for other windows (you can add more)
  public openMouse(): void {
    this.showWindow('styleManagerMouse');
  }

  public closeMouse(): void {
    this.hideWindow('styleManagerMouse');
  }

  public openKeyboard(): void {
    this.showWindow('styleManagerKeyboard');
  }

  public closeKeyboard(): void {
    this.hideWindow('styleManagerKeyboard');
  }

  public openWindow(): void {
    this.showWindow('styleManagerWindow');
  }

  public closeWindow(): void {
    this.hideWindow('styleManagerWindow');
  }

  public openScreen(): void {
    this.showWindow('styleManagerScreen');
  }

  public closeScreen(): void {
    this.hideWindow('styleManagerScreen');
  }

  public openBeep(): void {
    this.showWindow('styleManagerBeep');
  }

  public closeBeep(): void {
    this.hideWindow('styleManagerBeep');
  }

  public openStartup(): void {
    this.showWindow('styleManagerStartup');
  }

  public closeStartup(): void {
    this.hideWindow('styleManagerStartup');
  }

  private showWindow(id: string): void {
    const win = document.getElementById(id);
    if (!win) return;

    // Show the window
    win.style.display = 'flex';
    win.style.zIndex = '10000';

    // Call focusWindow to handle focus and z-index
    if (window.focusWindow) {
      window.focusWindow(id);
    }

    // Force repaint on main window and dock
    const mainWin = document.getElementById('styleManagerMain');
    const dock = document.getElementById('cde-panel');

    if (mainWin) {
      // Get the current computed background color (from theme)
      const bgColor = window.getComputedStyle(mainWin).backgroundColor;
      // Temporarily assign it as an inline style
      mainWin.style.backgroundColor = bgColor;
      // Force reflow (browser must paint the new color)
      mainWin.offsetHeight;
      // Restore so it continues using the CSS variable
      mainWin.style.backgroundColor = '';
    }

    if (dock) {
      const dockBg = window.getComputedStyle(dock).backgroundColor;
      dock.style.backgroundColor = dockBg;
      dock.offsetHeight;
      dock.style.backgroundColor = '';
    }
  }
  private hideWindow(id: string): void {
    const win = document.getElementById(id) as HTMLElement | null;
    if (win) {
      win.style.display = 'none';
    }
  }

  // --- Style application (existing functionality) ---
  public applyStyle(cssVar: string, value: string): void {
    document.documentElement.style.setProperty(cssVar, value);
    this.styles[cssVar] = value;
  }

  public applyFontStyle(cssVar: string, value: string): void {
    document.documentElement.style.setProperty(cssVar, value);
    this.fontStyles[cssVar] = value;
    this.allStyles[cssVar] = value;
  }

  // Apply all current color styles
  public applyColor(): void {
    for (const [cssVar, value] of Object.entries(this.styles)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
    this.updateStatus('Color changes applied', 'colorStatus');
    this.showMessage('Color settings applied.');
  }

  // Apply all current font styles
  public applyFont(): void {
    for (const [cssVar, value] of Object.entries(this.fontStyles)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
    this.updateFontPreview();
    this.updateStatus('Font changes applied', 'fontStatus');
    this.showMessage('Font settings applied.');
  }

  // Apply all (equivalent to original apply)
  public apply(): void {
    this.applyColor();
    this.applyFont();
  }

  // Reset colors to default values
  public resetColor(): void {
    for (const [cssVar, value] of Object.entries(this.defaultStyles)) {
      this.applyStyle(cssVar, value);
    }
    this.updateUI();
    this.updateStatus('Color reset to default', 'colorStatus');
    this.showMessage('Colors reset to default.');
    document
      .querySelectorAll('.cde-preset.active')
      .forEach((btn) => btn.classList.remove('active'));
  }

  // Reset fonts to default values
  public resetFont(): void {
    for (const [cssVar, value] of Object.entries(this.defaultFontStyles)) {
      this.applyFontStyle(cssVar, value);
    }
    this.updateFontControls();
    this.updateStatus('Font reset to default', 'fontStatus');
    this.showMessage('Fonts reset to default.');
    document
      .querySelectorAll('.cde-preset.active')
      .forEach((btn) => btn.classList.remove('active'));
  }

  // Reset everything
  public reset(): void {
    this.resetColor();
    this.resetFont();
  }

  // Save colors to localStorage
  public saveColor(): void {
    try {
      const saved = localStorage.getItem('cde-styles');
      const allSettings = saved ? JSON.parse(saved) : { colors: {}, fonts: {} };
      allSettings.colors = this.styles;
      localStorage.setItem('cde-styles', JSON.stringify(allSettings));
      this.updateStatus('Color settings saved', 'colorStatus');
      this.showMessage('Color configuration saved.');
    } catch (e) {
      this.showMessage('Error saving color settings.');
      console.error('Error saving colors:', e);
    }
  }

  // Save fonts to localStorage
  public saveFont(): void {
    try {
      const saved = localStorage.getItem('cde-styles');
      const allSettings = saved ? JSON.parse(saved) : { colors: {}, fonts: {} };
      allSettings.fonts = this.fontStyles;
      localStorage.setItem('cde-styles', JSON.stringify(allSettings));
      this.updateStatus('Font settings saved', 'fontStatus');
      this.showMessage('Font configuration saved.');
    } catch (e) {
      this.showMessage('Error saving font settings.');
      console.error('Error saving fonts:', e);
    }
  }

  // Save everything
  public save(): void {
    this.saveColor();
    this.saveFont();
  }

  // Apply color preset
  public applyPreset(scheme: string): void {
    const preset = this.presets[scheme];
    if (preset) {
      console.log(`Applying preset: ${scheme}`);
      for (const [cssVar, value] of Object.entries(preset)) {
        this.applyStyle(cssVar, value);
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
          }
        }
      }
      this.updateStatus(`Applied theme: ${scheme}`, 'colorStatus');
      this.showMessage(`${scheme} theme applied.`);
    }
  }

  // Apply font preset
  public applyFontPreset(presetName: string): void {
    const preset = this.fontPresets[presetName];
    if (preset) {
      console.log(`Applying font preset: ${presetName}`);
      for (const [cssVar, value] of Object.entries(preset)) {
        this.applyFontStyle(cssVar, value);
      }
      this.updateFontControls();
      this.updateStatus(`Applied font preset: ${presetName}`, 'fontStatus');
      this.showMessage(`${presetName} font preset applied.`);
    }
  }

  // Load saved styles
  private loadSavedStyles(): void {
    try {
      const saved = localStorage.getItem('cde-styles');
      if (saved) {
        const savedSettings = JSON.parse(saved) as {
          colors?: Record<string, string>;
          fonts?: Record<string, string>;
        };
        if (savedSettings.colors) {
          Object.assign(this.styles, savedSettings.colors);
          for (const [cssVar, value] of Object.entries(savedSettings.colors)) {
            document.documentElement.style.setProperty(cssVar, value);
          }
        }
        if (savedSettings.fonts) {
          Object.assign(this.fontStyles, savedSettings.fonts);
          for (const [cssVar, value] of Object.entries(savedSettings.fonts)) {
            document.documentElement.style.setProperty(cssVar, value);
          }
        }
        console.log('Loaded saved styles and fonts from localStorage');
      }
    } catch (e) {
      console.log('No saved styles found');
    }
  }

  // Update color UI with current values
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
        }
      }
    }
  }

  // Update font controls with current values
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

  // Update font preview
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

  // Test preview (button)
  public testFontPreview(): void {
    this.updateFontPreview();
    this.showMessage('Font preview updated.');
  }

  // Update status message in a specific bar
  private updateStatus(message: string, statusId: string = 'styleMainStatus'): void {
    const statusElement = document.getElementById(statusId);
    if (statusElement) statusElement.textContent = message;
  }

  // Show temporary popup message
  public showMessage(message: string): void {
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

  // Make all Style Manager windows draggable
  private makeAllWindowsDraggable(): void {
    const windows = [
      'styleManagerMain',
      'styleManagerColor',
      'styleManagerFont',
      'styleManagerBackdrop',
      'styleManagerMouse',
      'styleManagerKeyboard',
      'styleManagerWindow',
      'styleManagerScreen',
      'styleManagerBeep',
      'styleManagerStartup',
    ];

    windows.forEach((id) => {
      const win = document.getElementById(id);
      const titlebar = document.getElementById(`${id}Titlebar`);
      if (win && titlebar) {
        this.makeDraggable(win, titlebar);
      }
    });
  }

  // Drag function (adapted from your existing code)
  private makeDraggable(win: HTMLElement, titlebar: HTMLElement): void {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    titlebar.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).classList.contains('close-btn')) return;
      isDragging = true;
      const rect = win.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !win) return;
      win.style.left = e.clientX - dragOffset.x + 'px';
      win.style.top = e.clientY - dragOffset.y + 'px';
      win.style.transform = 'none';
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }
}

// Global declaration for window.styleManager
declare global {
  interface Window {
    styleManager?: StyleManager;
  }
}

// Initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.styleManager = new StyleManager();
  setTimeout(() => window.styleManager?.init(), 100);
});
