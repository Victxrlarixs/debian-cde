// src/scripts/features/stylemanager.ts

import { CONFIG } from '../core/config';
import { logger } from '../utilities/logger';
import { ThemeModule } from './style/theme';
import { FontModule } from './style/font';
import { MouseModule } from './style/mouse';
import { KeyboardModule } from './style/keyboard';
import { BeepModule } from './style/beep';
import { BackdropModule } from './style/backdrop';
import { settingsManager } from '../core/settingsmanager';

/**
 * CDE Style Manager for system customization.
 * Orchestrates multiple specialized modules.
 */
export class StyleManager {
  private theme: ThemeModule;
  private font: FontModule;
  public mouse: MouseModule;
  public keyboard: KeyboardModule;
  public beep: BeepModule;
  public backdrop: BackdropModule;

  constructor() {
    this.theme = new ThemeModule();
    this.font = new FontModule();
    this.mouse = new MouseModule();
    this.keyboard = new KeyboardModule();
    this.beep = new BeepModule();
    this.backdrop = new BackdropModule();
  }

  // Getters for backward compatibility
  public get styles() { return this.theme.styles; }
  public get fontStyles() { return this.font.fontStyles; }
  public get presets() { return this.theme.presets; }
  public get fontPresets() { return this.font.fontPresets; }

  /**
   * Initializes the Style Manager and all its modules.
   */
  public init(): void {
    const themeSettings = settingsManager.getSection('theme');
    this.theme.loadSavedColors(themeSettings.colors || {});
    this.font.loadSavedFonts(themeSettings.fonts || {});
    
    this.mouse.load();
    this.keyboard.load();
    this.beep.load();
    this.backdrop.load();

    this.bindEvents();
    this.setupColorInputs();
    this.setupFontControls();

    this.theme.updateUI();
    this.font.updateFontControls();
  }

  private bindEvents(): void {
    const styleManagerIcon = document.querySelector('.cde-icon img[src*="appearance"]')?.parentElement;
    if (styleManagerIcon) {
      styleManagerIcon.addEventListener('click', (e) => {
        e.preventDefault();
        this.openMain();
      });
    }

    const closeButtons = {
      '#styleManagerMain .close-btn': () => this.closeMain(),
      '#styleManagerColor .close-btn': () => this.closeColor(),
      '#styleManagerFont .close-btn': () => this.closeFont(),
      '#styleManagerBackdrop .close-btn': () => this.closeBackdrop(),
      '#styleManagerMouse .close-btn': () => this.closeMouse(),
      '#styleManagerKeyboard .close-btn': () => this.closeKeyboard(),
      '#styleManagerWindow .close-btn': () => this.closeWindow(),
      '#styleManagerScreen .close-btn': () => this.closeScreen(),
      '#styleManagerBeep .close-btn': () => this.closeBeep(),
      '#styleManagerStartup .close-btn': () => this.closeStartup(),
    };

    Object.entries(closeButtons).forEach(([selector, action]) => {
      const btn = document.querySelector(selector);
      if (btn) btn.addEventListener('click', action);
    });

    this.bindButton('#styleManagerColor .cde-btn-default', () => this.applyColor());
    this.bindButton('#styleManagerColor .cde-btn:nth-child(2)', () => this.resetColor());
    this.bindButton('#styleManagerColor .cde-btn:nth-child(3)', () => this.saveColor());

    this.bindButton('#styleManagerFont .cde-btn-default', () => this.applyFont());
    this.bindButton('#styleManagerFont .cde-btn:nth-child(2)', () => this.resetFont());
    this.bindButton('#styleManagerFont .cde-btn:nth-child(3)', () => this.saveFont());

    document.querySelectorAll('.cde-preset[data-scheme]').forEach((btn) => {
      btn.addEventListener('click', this.handlePresetClick);
    });

    document.querySelectorAll('.cde-preset[data-preset]').forEach((btn) => {
      btn.addEventListener('click', this.handleFontPresetClick);
    });
  }

  private bindButton(selector: string, action: () => void): void {
    const btn = document.querySelector(selector);
    if (btn) btn.addEventListener('click', action);
  }

  private handlePresetClick = (e: Event): void => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const scheme = target.dataset.scheme;
    if (scheme) {
      this.theme.applyPreset(scheme);
      this.highlightActivePreset(target, '[data-scheme]');
      this.saveColor();
      this.updateStatus(`Theme: ${scheme}`, 'colorStatus');
    }
  };

  private handleFontPresetClick = (e: Event): void => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const preset = target.dataset.preset;
    if (preset) {
      this.font.applyFontPreset(preset);
      this.highlightActivePreset(target, '[data-preset]');
      this.saveFont();
      this.updateStatus(`Font: ${preset}`, 'fontStatus');
    }
  };

  private highlightActivePreset(activeButton: HTMLElement, selector: string): void {
    document.querySelectorAll(`.cde-preset${selector}`).forEach((btn) => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  private setupColorInputs(): void {
    document.querySelectorAll('input[data-var]').forEach((input) => {
      input.addEventListener('input', (e) => {
        const val = (e.target as HTMLInputElement).value;
        const cssVar = (e.target as HTMLElement).dataset.var;
        if (cssVar) {
          this.theme.applyStyle(cssVar, val);
          this.theme.updateSwatchForInput(e.target as HTMLInputElement);
          this.saveColor();
        }
      });
    });
  }

  private setupFontControls(): void {
    document.querySelectorAll('#styleManagerFont select, #styleManagerFont input').forEach((ctrl) => {
      ctrl.addEventListener('input', () => this.font.updateFontPreview());
    });
  }

  // Windows
  public openMain(): void { this.showWindow('styleManagerMain'); }
  public closeMain(): void { this.hideWindow('styleManagerMain'); }
  public openColor(): void { this.showWindow('styleManagerColor'); this.theme.updateUI(); }
  public closeColor(): void { this.hideWindow('styleManagerColor'); }
  public openFont(): void { this.showWindow('styleManagerFont'); }
  public closeFont(): void { this.hideWindow('styleManagerFont'); }
  public openBackdrop(): void { this.showWindow('styleManagerBackdrop'); this.backdrop.syncUI(); }
  public closeBackdrop(): void { this.hideWindow('styleManagerBackdrop'); }
  public openMouse(): void { this.showWindow('styleManagerMouse'); this.mouse.syncUI(); }
  public closeMouse(): void { this.hideWindow('styleManagerMouse'); }
  public openKeyboard(): void { this.showWindow('styleManagerKeyboard'); this.keyboard.syncUI(); }
  public closeKeyboard(): void { this.hideWindow('styleManagerKeyboard'); }
  public openWindow(): void { this.showWindow('styleManagerWindow'); }
  public closeWindow(): void { this.hideWindow('styleManagerWindow'); }
  public openScreen(): void { this.showWindow('styleManagerScreen'); }
  public closeScreen(): void { this.hideWindow('styleManagerScreen'); }
  public openBeep(): void { this.showWindow('styleManagerBeep'); this.beep.syncUI(); }
  public closeBeep(): void { this.hideWindow('styleManagerBeep'); }
  public openStartup(): void { this.showWindow('styleManagerStartup'); }
  public closeStartup(): void { this.hideWindow('styleManagerStartup'); }

  private showWindow(id: string): void {
    const win = document.getElementById(id);
    if (win) {
      win.style.display = 'flex';
      win.style.zIndex = '10000';
      if (window.focusWindow) window.focusWindow(id);
    }
  }

  private hideWindow(id: string): void {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
  }

  public applyColor(): void { this.theme.applyColor(); this.showMessage('Colors applied.'); }
  public applyFont(): void { this.font.applyFont(); this.showMessage('Fonts applied.'); }
  public resetColor(): void { this.theme.resetColor(); this.theme.updateUI(); this.saveColor(); }
  public resetFont(): void { this.font.resetFont(); this.font.updateFontControls(); this.saveFont(); }

  public saveColor(): void {
    const theme = settingsManager.getSection('theme');
    theme.colors = this.theme.styles;
    settingsManager.setSection('theme', theme);
  }

  public saveFont(): void {
    const theme = settingsManager.getSection('theme');
    theme.fonts = this.font.fontStyles;
    settingsManager.setSection('theme', theme);
  }

  private updateStatus(msg: string, id: string): void {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  public showMessage(message: string): void {
    const msgBox = document.createElement('div');
    msgBox.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: var(--modal-bg, #c0c0c0); border: 2px solid; padding: 20px; z-index: 10001;
      font-family: var(--font-family-base, monospace); font-size: 12px;
      box-shadow: 4px 4px 0 var(--shadow-color, #000000); min-width: 200px; text-align: center;
    `;
    msgBox.innerHTML = `<div>${message}</div>`;
    document.body.appendChild(msgBox);
    setTimeout(() => msgBox.remove(), 2000);
  }
}

// Global exposure
declare global {
  interface Window {
    updateMouseSetting: (k: string, v: any) => void;
    syncMouseControls: () => void;
  }
}

const manager = new StyleManager();
window.styleManager = manager;
window.updateMouseSetting = (k, v) => manager.mouse.update(k, v);
window.syncMouseControls = () => manager.mouse.syncUI();

export const mouseSettings = manager.mouse.settings;