// src/scripts/features/style/keyboard.ts

import { logger } from '../../utilities/logger';

export interface KeyboardSettings {
  repeatRate: number;
  delay: number;
  clickVolume: number;
}

export class KeyboardModule {
  public settings: KeyboardSettings = {
    repeatRate: 10,
    delay: 500,
    clickVolume: 0,
  };

  public load(): void {
    try {
      const saved = localStorage.getItem('cde-keyboard-settings');
      if (saved) {
        Object.assign(this.settings, JSON.parse(saved));
        logger.log('[KeyboardModule] Loaded from localStorage:', this.settings);
      }
    } catch (e) {
      console.warn('[KeyboardModule] Failed to load from localStorage:', e);
    }
  }

  public save(): void {
    localStorage.setItem('cde-keyboard-settings', JSON.stringify(this.settings));
    logger.log('[KeyboardModule] Saved to localStorage:', this.settings);
  }

  public apply(): void {
    logger.log('[KeyboardModule] Applied settings:', this.settings);
  }

  public update(key: string, value: any): void {
     if (key in this.settings) {
      (this.settings as any)[key] = value;
      this.apply();
      this.save();
    }
  }

  public syncUI(): void {
    const panel = document.getElementById('styleManagerKeyboard');
    if (!panel) return;
    // ... logic for syncing sliders if they exist
    logger.log('[KeyboardModule] UI synchronized');
  }
}
