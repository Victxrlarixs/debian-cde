// src/scripts/core/settingsmanager.ts

import { logger } from '../utilities/logger';

export interface SystemSettings {
  theme: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
  };
  mouse: Record<string, any>;
  keyboard: Record<string, any>;
  beep: Record<string, any>;
  session: {
    windows: Record<
      string,
      {
        top: string;
        left: string;
        display: string;
        maximized: boolean;
      }
    >;
  };
  desktop: Record<string, any>;
}

const STORAGE_KEY = 'cde-system-settings';

class SettingsManager {
  private static instance: SettingsManager;
  private settings: SystemSettings;

  private constructor() {
    this.settings = this.getDefaultSettings();
    this.load();
  }

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  private getDefaultSettings(): SystemSettings {
    return {
      theme: { colors: {}, fonts: {} },
      mouse: {},
      keyboard: {},
      beep: {},
      session: { windows: {} },
      desktop: {},
    };
  }

  /**
   * Loads settings from localStorage. If none exist, migration from old keys is attempted.
   */
  private load(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.settings = JSON.parse(saved);
        logger.log('[SettingsManager] Unified settings loaded.');
      } else {
        this.migrateLegacySettings();
      }
    } catch (e) {
      console.error('[SettingsManager] Failed to load settings:', e);
    }
  }

  /**
   * Migrates settings from fragmented legacy keys to the new unified key.
   */
  private migrateLegacySettings(): void {
    logger.log('[SettingsManager] Attempting migration from legacy settings...');

    // Migration for Style/Theme (cde-styles)
    const oldStyles = localStorage.getItem('cde-styles');
    if (oldStyles) {
      const parsed = JSON.parse(oldStyles);
      this.settings.theme.colors = parsed.colors || {};
      this.settings.theme.fonts = parsed.fonts || {};
    }

    // Migration for Mouse
    const oldMouse = localStorage.getItem('cde-mouse-settings');
    if (oldMouse) this.settings.mouse = JSON.parse(oldMouse);

    // Migration for Keyboard
    const oldKeyboard = localStorage.getItem('cde-keyboard-settings');
    if (oldKeyboard) this.settings.keyboard = JSON.parse(oldKeyboard);

    // Migration for Beep
    const oldBeep = localStorage.getItem('cde-beep-settings');
    if (oldBeep) this.settings.beep = JSON.parse(oldBeep);

    this.save();
    logger.log('[SettingsManager] Migration completed.');
  }

  public save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.error('[SettingsManager] Failed to save settings:', e);
    }
  }

  public setSection(section: keyof SystemSettings, data: any): void {
    (this.settings as any)[section] = data;
    this.save();
  }

  public getSection(section: keyof SystemSettings): any {
    return this.settings[section];
  }

  public updateWindowSession(id: string, data: any): void {
    this.settings.session.windows[id] = { ...this.settings.session.windows[id], ...data };
    this.save();
  }

  public getAll(): SystemSettings {
    return this.settings;
  }
}

export const settingsManager = SettingsManager.getInstance();
