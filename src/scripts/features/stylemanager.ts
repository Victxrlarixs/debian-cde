// src/scripts/stylemanager.ts

import { CONFIG } from '../core/config';
import { logger } from '../utilities/logger';

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

  /**
   * Initializes the Style Manager: loads saved styles, sets up event listeners,
   * configures color and font controls, updates UI, and makes windows draggable.
   */
  public init(): void {
    this.loadSavedStyles();
    this.bindEvents();
    this.setupColorInputs();
    this.setupFontControls();
    this.updateUI();
    this.updateFontControls();
  }

  /**
   * Binds all necessary event listeners: dock icon, close buttons,
   * apply/reset/save buttons, and preset clicks.
   */
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

  /**
   * Handles click on a color preset button.
   * @param e - The click event.
   */
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

  /**
   * Handles click on a font preset button.
   * @param e - The click event.
   */
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

  /**
   * Highlights the active color preset and removes highlight from others.
   * @param activeButton - The button element that was clicked.
   */
  public highlightActiveColorPreset(activeButton: HTMLElement): void {
    document
      .querySelectorAll('.cde-preset[data-scheme]')
      .forEach((btn) => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  /**
   * Highlights the active font preset and removes highlight from others.
   * @param activeButton - The button element that was clicked.
   */
  public highlightActiveFontPreset(activeButton: HTMLElement): void {
    document
      .querySelectorAll('.cde-preset[data-preset]')
      .forEach((btn) => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  /**
   * Updates the swatch button color to match the given input.
   * @param input - The color input element.
   */
  private updateSwatchForInput(input: HTMLInputElement): void {
    const swatch = input.previousElementSibling as HTMLElement | null;
    if (swatch && swatch.classList.contains('color-swatch-btn')) {
      swatch.style.backgroundColor = input.value;
    }
  }

  /**
   * Sets up event listeners for all color inputs.
   */
  private setupColorInputs(): void {
    const colorMap: Record<string, string> = {
      'color-workspace': '--workspace-color',
      'color-title-active': '--titlebar-color',
      'color-title-text': '--titlebar-text-color',
      'color-background': '--window-color',
      'color-highlight': '--highlight-color',
      'color-text': '--text-color',
      'color-topbar': '--topbar-color',
      'color-dock': '--dock-color',
      'color-modal-bg': '--modal-bg',
      'color-dock-icon-bg': '--dock-icon-bg',
      'color-button-bg': '--button-bg',
      'color-terminal-bg': '--terminal-bg-color',
      'color-terminal-text': '--terminal-text-color',
    };

    Object.entries(colorMap).forEach(([inputId, cssVar]) => {
      const input = document.getElementById(inputId) as HTMLInputElement | null;
      if (input) {
        input.addEventListener('input', (e) => {
          const value = (e.target as HTMLInputElement).value;
          this.applyStyle(cssVar, value);
          this.updateSwatchForInput(input);
          this.saveColor(); // Auto-save on every color change
          this.updateStatus('Color changed', 'colorStatus');
        });
      }
    });
  }

  /**
   * Sets up font controls: selects and sliders.
   */
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

  /**
   * Sets up a font select element.
   * @param elementId - The ID of the select element.
   * @param cssVar - The CSS variable to update.
   */
  private setupFontSelect(elementId: string, cssVar: string): void {
    const select = document.getElementById(elementId) as HTMLSelectElement | null;
    if (select) {
      select.addEventListener('change', (e) => {
        this.applyFontStyle(cssVar, (e.target as HTMLSelectElement).value);
        this.updateFontPreview();
        this.updateStatus('Font changed', 'fontStatus');
        this.saveFont(); // Auto-save font changes
      });
    }
  }

  /**
   * Sets up a slider input.
   * @param sliderId - The ID of the slider.
   * @param cssVar - The CSS variable to update.
   * @param valueId - The ID of the element displaying the current value.
   * @param suffix - Optional suffix (e.g., 'px').
   */
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
        this.saveFont(); // Auto-save font changes
      });
    }
  }

  // --- Opening and closing specific windows ---

  /** Opens the main Style Manager window. */
  public openMain(): void {
    this.showWindow('styleManagerMain');
  }

  /** Closes the main Style Manager window. */
  public closeMain(): void {
    this.hideWindow('styleManagerMain');
  }

  /** Opens the Color panel. */
  public openColor(): void {
    this.showWindow('styleManagerColor');
    this.updateUI(); // Force swatch update when opening the window
  }

  /** Closes the Color panel. */
  public closeColor(): void {
    this.hideWindow('styleManagerColor');
  }

  /** Opens the Font panel. */
  public openFont(): void {
    this.showWindow('styleManagerFont');
  }

  /** Closes the Font panel. */
  public closeFont(): void {
    this.hideWindow('styleManagerFont');
  }

  /** Opens the Backdrop panel. */
  public openBackdrop(): void {
    this.showWindow('styleManagerBackdrop');
  }

  /** Closes the Backdrop panel. */
  public closeBackdrop(): void {
    this.hideWindow('styleManagerBackdrop');
  }

  /** Opens the Mouse panel. */
  public openMouse(): void {
    this.showWindow('styleManagerMouse');
  }

  /** Closes the Mouse panel. */
  public closeMouse(): void {
    this.hideWindow('styleManagerMouse');
  }

  /** Opens the Keyboard panel. */
  public openKeyboard(): void {
    this.showWindow('styleManagerKeyboard');
  }

  /** Closes the Keyboard panel. */
  public closeKeyboard(): void {
    this.hideWindow('styleManagerKeyboard');
  }

  /** Opens the Window behavior panel. */
  public openWindow(): void {
    this.showWindow('styleManagerWindow');
  }

  /** Closes the Window behavior panel. */
  public closeWindow(): void {
    this.hideWindow('styleManagerWindow');
  }

  /** Opens the Screen panel. */
  public openScreen(): void {
    this.showWindow('styleManagerScreen');
  }

  /** Closes the Screen panel. */
  public closeScreen(): void {
    this.hideWindow('styleManagerScreen');
  }

  /** Opens the Beep panel. */
  public openBeep(): void {
    this.showWindow('styleManagerBeep');
  }

  /** Closes the Beep panel. */
  public closeBeep(): void {
    this.hideWindow('styleManagerBeep');
  }

  /** Opens the Startup panel. */
  public openStartup(): void {
    this.showWindow('styleManagerStartup');
  }

  /** Closes the Startup panel. */
  public closeStartup(): void {
    this.hideWindow('styleManagerStartup');
  }

  /**
   * Shows a window by its ID, brings it to front, and forces repaint on main window and dock.
   * @param id - The ID of the window to show.
   */
  private showWindow(id: string): void {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'flex';
    win.style.zIndex = '10000';

    if (window.focusWindow) {
      window.focusWindow(id);
    }

    const mainWin = document.getElementById('styleManagerMain');
    const dock = document.getElementById('cde-panel');

    if (mainWin) {
      const bgColor = window.getComputedStyle(mainWin).backgroundColor;
      mainWin.style.backgroundColor = bgColor;
      mainWin.offsetHeight;
      mainWin.style.backgroundColor = '';
    }

    if (dock) {
      const dockBg = window.getComputedStyle(dock).backgroundColor;
      dock.style.backgroundColor = dockBg;
      dock.offsetHeight;
      dock.style.backgroundColor = '';
    }
  }

  /**
   * Hides a window by its ID.
   * @param id - The ID of the window to hide.
   */
  private hideWindow(id: string): void {
    const win = document.getElementById(id) as HTMLElement | null;
    if (win) {
      win.style.display = 'none';
    }
  }

  // --- Style application ---

  /**
   * Applies a single CSS variable to the document root and updates internal styles.
   * @param cssVar - The CSS variable name.
   * @param value - The value to set.
   */
  public applyStyle(cssVar: string, value: string): void {
    document.documentElement.style.setProperty(cssVar, value);
    this.styles[cssVar] = value;
  }

  /**
   * Applies a single font CSS variable to the document root and updates internal font styles.
   * @param cssVar - The CSS variable name.
   * @param value - The value to set.
   */
  public applyFontStyle(cssVar: string, value: string): void {
    document.documentElement.style.setProperty(cssVar, value);
    this.fontStyles[cssVar] = value;
    this.allStyles[cssVar] = value;
  }

  /** Applies all current color styles to the document. */
  public applyColor(): void {
    for (const [cssVar, value] of Object.entries(this.styles)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
    this.updateStatus('Color changes applied', 'colorStatus');
    this.showMessage('Color settings applied.');
  }

  /** Applies all current font styles to the document and updates preview. */
  public applyFont(): void {
    for (const [cssVar, value] of Object.entries(this.fontStyles)) {
      document.documentElement.style.setProperty(cssVar, value);
    }
    this.updateFontPreview();
    this.updateStatus('Font changes applied', 'fontStatus');
    this.showMessage('Font settings applied.');
  }

  /** Applies all current styles (colors and fonts). */
  public apply(): void {
    this.applyColor();
    this.applyFont();
  }

  /** Resets colors to default values. */
  public resetColor(): void {
    for (const [cssVar, value] of Object.entries(this.defaultStyles)) {
      this.applyStyle(cssVar, value);
    }
    this.updateUI();
    this.saveColor(); // Save after reset
    this.updateStatus('Color reset to default', 'colorStatus');
    this.showMessage('Colors reset to default.');
    document
      .querySelectorAll('.cde-preset.active')
      .forEach((btn) => btn.classList.remove('active'));
  }

  /** Resets fonts to default values. */
  public resetFont(): void {
    for (const [cssVar, value] of Object.entries(this.defaultFontStyles)) {
      this.applyFontStyle(cssVar, value);
    }
    this.updateFontControls();
    this.saveFont(); // Save after reset
    this.updateStatus('Font reset to default', 'fontStatus');
    this.showMessage('Fonts reset to default.');
    document
      .querySelectorAll('.cde-preset.active')
      .forEach((btn) => btn.classList.remove('active'));
  }

  /** Resets both colors and fonts to default. */
  public reset(): void {
    this.resetColor();
    this.resetFont();
  }

  /** Saves current color settings to localStorage. */
  public saveColor(): void {
    try {
      const saved = localStorage.getItem('cde-styles');
      const allSettings = saved ? JSON.parse(saved) : { colors: {}, fonts: {} };
      allSettings.colors = this.styles;
      localStorage.setItem('cde-styles', JSON.stringify(allSettings));
      logger.log('[StyleManager] Colors saved to localStorage:', this.styles);
      this.updateStatus('Color settings saved', 'colorStatus');
      this.showMessage('Color configuration saved.');
    } catch (e) {
      this.showMessage('Error saving color settings.');
      console.error('Error saving colors:', e);
    }
  }

  /** Saves current font settings to localStorage. */
  public saveFont(): void {
    try {
      const saved = localStorage.getItem('cde-styles');
      const allSettings = saved ? JSON.parse(saved) : { colors: {}, fonts: {} };
      allSettings.fonts = this.fontStyles;
      localStorage.setItem('cde-styles', JSON.stringify(allSettings));
      logger.log('[StyleManager] Fonts saved to localStorage:', this.fontStyles);
      this.updateStatus('Font settings saved', 'fontStatus');
      this.showMessage('Font configuration saved.');
    } catch (e) {
      this.showMessage('Error saving font settings.');
      console.error('Error saving fonts:', e);
    }
  }

  /** Saves both colors and fonts to localStorage. */
  public save(): void {
    this.saveColor();
    this.saveFont();
  }

  /**
   * Applies a color preset (theme) by name.
   * @param scheme - The theme name (e.g., 'platinum').
   */
  public applyPreset(scheme: string): void {
    const preset = this.presets[scheme];
    if (preset) {
      logger.log(`[StyleManager] Applying preset: ${scheme}`);
      for (const [cssVar, value] of Object.entries(preset)) {
        this.applyStyle(cssVar, value);
        const input = document.querySelector(
          `input[data-var="${cssVar}"]`
        ) as HTMLInputElement | null;
        if (input) {
          input.value = value;
          this.updateSwatchForInput(input);
        }
      }
      this.saveColor(); // Auto-save after applying preset
      this.updateStatus(`Applied theme: ${scheme}`, 'colorStatus');
      this.showMessage(`${scheme} theme applied.`);
    }
  }

  /**
   * Applies a font preset by name.
   * @param presetName - The font preset name (e.g., 'modern').
   */
  public applyFontPreset(presetName: string): void {
    const preset = this.fontPresets[presetName];
    if (preset) {
      logger.log(`[StyleManager] Applying font preset: ${presetName}`);
      for (const [cssVar, value] of Object.entries(preset)) {
        this.applyFontStyle(cssVar, value);
      }
      this.updateFontControls();
      this.saveFont(); // Auto-save after applying font preset
      this.updateStatus(`Applied font preset: ${presetName}`, 'fontStatus');
      this.showMessage(`${presetName} font preset applied.`);
    }
  }

  /** Loads saved styles from localStorage and applies them. */
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
          logger.log('[StyleManager] Loaded colors from localStorage:', savedSettings.colors);
        }
        if (savedSettings.fonts) {
          Object.assign(this.fontStyles, savedSettings.fonts);
          for (const [cssVar, value] of Object.entries(savedSettings.fonts)) {
            document.documentElement.style.setProperty(cssVar, value);
          }
          logger.log('[StyleManager] Loaded fonts from localStorage:', savedSettings.fonts);
        }
      } else {
        logger.log('[StyleManager] No saved styles found, using defaults.');
      }
    } catch (e) {
      logger.log('[StyleManager] Error loading saved styles:', e);
    }
  }

  /** Updates all color swatches and inputs to match current styles. */
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

  /** Updates font control values (selects, sliders) to match current font styles. */
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

  /**
   * Sets the selected value of a select element.
   * @param id - The element ID.
   * @param value - The value to select.
   */
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

  /**
   * Sets the value of a slider and updates its display span.
   * @param sliderId - The slider element ID.
   * @param value - The numeric value.
   * @param valueId - The display span ID.
   * @param suffix - Optional suffix (e.g., 'px').
   */
  private setSliderValue(sliderId: string, value: number, valueId: string, suffix: string): void {
    const slider = document.getElementById(sliderId) as HTMLInputElement | null;
    const valueSpan = document.getElementById(valueId) as HTMLElement | null;
    if (slider) slider.value = String(value);
    if (valueSpan) valueSpan.textContent = value + suffix;
  }

  /** Updates the font preview area with current font styles. */
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

  /** Triggers a font preview update and shows a message. */
  public testFontPreview(): void {
    this.updateFontPreview();
    this.showMessage('Font preview updated.');
  }

  /**
   * Updates the status bar message.
   * @param message - The message to display.
   * @param statusId - The ID of the status element.
   */
  private updateStatus(message: string, statusId: string = 'styleMainStatus'): void {
    const statusElement = document.getElementById(statusId);
    if (statusElement) statusElement.textContent = message;
  }

  /**
   * Shows a temporary popup message centered on screen.
   * @param message - The message to display.
   */
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

}

// ============================================================================
// Mouse Settings - Functionality for the Mouse panel
// ============================================================================

// Mouse configuration object
const mouseSettings = {
  handedness: 'right',
  button2: 'transfer',
  doubleClick: 0.5,
  acceleration: 2,
  threshold: 4,
};

/**
 * Loads mouse settings from localStorage.
 */
export function loadMouseSettings(): void {
  try {
    const saved = localStorage.getItem('cde-mouse-settings');
    if (saved) {
      Object.assign(mouseSettings, JSON.parse(saved));
      logger.log('[MouseSettings] Loaded from localStorage:', mouseSettings);
    } else {
      logger.log('[MouseSettings] No saved settings found, using defaults.');
    }
  } catch (e) {
    console.warn('[MouseSettings] Failed to load from localStorage:', e);
  }
}

/**
 * Saves mouse settings to localStorage.
 */
export function saveMouseSettings(): void {
  localStorage.setItem('cde-mouse-settings', JSON.stringify(mouseSettings));
  logger.log('[MouseSettings] Saved to localStorage:', mouseSettings);
}

/**
 * Applies mouse settings.
 */
export function applyMouseSettings(): void {
  logger.log('[MouseSettings] Applied:', mouseSettings);
  saveMouseSettings();
}

/**
 * Updates a single mouse setting and triggers apply.
 * @param key - The setting key
 * @param value - The new value
 */
export function updateMouseSetting(key: string, value: any): void {
  if (key in mouseSettings) {
    (mouseSettings as any)[key] = value;
    applyMouseSettings();
    logger.log(`[MouseSettings] "${key}" updated to ${value}`);
  } else {
    console.warn(`[MouseSettings] Unknown key: "${key}"`);
  }
}

/**
 * Synchronizes the mouse panel controls with the current settings.
 */
export function syncMouseControls(): void {
  const panel = document.getElementById('styleManagerMouse');
  if (!panel) {
    console.warn('[MouseSettings] Panel not found');
    return;
  }

  // Handedness radios
  const handednessRight = panel.querySelector(
    'input[name="handedness"][value="right"]'
  ) as HTMLInputElement;
  const handednessLeft = panel.querySelector(
    'input[name="handedness"][value="left"]'
  ) as HTMLInputElement;
  if (handednessRight && handednessLeft) {
    handednessRight.checked = mouseSettings.handedness === 'right';
    handednessLeft.checked = mouseSettings.handedness === 'left';
  }

  // Button2 radios
  const button2Transfer = panel.querySelector(
    'input[name="button2"][value="transfer"]'
  ) as HTMLInputElement;
  const button2Adjust = panel.querySelector(
    'input[name="button2"][value="adjust"]'
  ) as HTMLInputElement;
  if (button2Transfer && button2Adjust) {
    button2Transfer.checked = mouseSettings.button2 === 'transfer';
    button2Adjust.checked = mouseSettings.button2 === 'adjust';
  }

  // Sliders
  const doubleClickSlider = panel.querySelector(
    '.mouse-slider-row:nth-child(1) input'
  ) as HTMLInputElement;
  const doubleClickSpan = panel.querySelector('.mouse-slider-row:nth-child(1) span:last-child');
  if (doubleClickSlider && doubleClickSpan) {
    doubleClickSlider.value = String(mouseSettings.doubleClick);
    doubleClickSpan.textContent = String(mouseSettings.doubleClick);
  }

  const accelSlider = panel.querySelector(
    '.mouse-slider-row:nth-child(2) input'
  ) as HTMLInputElement;
  const accelSpan = panel.querySelector('.mouse-slider-row:nth-child(2) span:last-child');
  if (accelSlider && accelSpan) {
    accelSlider.value = String(mouseSettings.acceleration);
    accelSpan.textContent = String(mouseSettings.acceleration);
  }

  const thresholdSlider = panel.querySelector(
    '.mouse-slider-row:nth-child(3) input'
  ) as HTMLInputElement;
  const thresholdSpan = panel.querySelector('.mouse-slider-row:nth-child(3) span:last-child');
  if (thresholdSlider && thresholdSpan) {
    thresholdSlider.value = String(mouseSettings.threshold);
    thresholdSpan.textContent = String(mouseSettings.threshold);
  }

  logger.log('[MouseSettings] Controls synchronized');
}

// ============================================================================
// Global exposure
// ============================================================================

declare global {
  interface Window {
    styleManager?: StyleManager;
    updateMouseSetting: typeof updateMouseSetting;
    syncMouseControls: typeof syncMouseControls;
  }
}

// StyleManager instance — initialized by init.ts after the boot sequence
window.styleManager = new StyleManager();

window.updateMouseSetting = updateMouseSetting;
window.syncMouseControls = syncMouseControls;

loadMouseSettings();

logger.log('[Init]   - Mouse acceleration:', mouseSettings.acceleration);

export { mouseSettings };