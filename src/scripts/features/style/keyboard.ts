// src/scripts/features/style/keyboard.ts

import { logger } from '../../utilities/logger';
import { settingsManager } from '../../core/settingsmanager';

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
    const saved = settingsManager.getSection('keyboard');
    if (Object.keys(saved).length > 0) {
      Object.assign(this.settings, saved);
      logger.log('[KeyboardModule] Loaded from SettingsManager:', this.settings);
    }
  }

  public save(): void {
    settingsManager.setSection('keyboard', this.settings);
    logger.log('[KeyboardModule] Saved to SettingsManager:', this.settings);
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
