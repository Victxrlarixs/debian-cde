// src/scripts/features/style/beep.ts

import { logger } from '../../utilities/logger';
import { settingsManager } from '../../core/settingsmanager';

export interface BeepSettings {
  volume: number;
  pitch: number;
  duration: number;
}

export class BeepModule {
  public settings: BeepSettings = {
    volume: 50,
    pitch: 440,
    duration: 100,
  };

  public load(): void {
    const saved = settingsManager.getSection('beep');
    if (Object.keys(saved).length > 0) {
      Object.assign(this.settings, saved);
      logger.log('[BeepModule] Loaded from SettingsManager:', this.settings);
    }
  }

  public save(): void {
    settingsManager.setSection('beep', this.settings);
    logger.log('[BeepModule] Saved to SettingsManager:', this.settings);
  }

  public apply(): void {
    logger.log('[BeepModule] Applied settings:', this.settings);
    if (window.AudioManager) {
      window.AudioManager.setVolume(this.settings.volume / 100);
    }
  }

  public testBeep(): void {
    if (window.AudioManager) {
      window.AudioManager.beep();
    }
  }

  public update(key: string, value: any): void {
    if (key in this.settings) {
      (this.settings as any)[key] = value;
      this.apply();
      this.save();
    }
  }

  public syncUI(): void {
    const panel = document.getElementById('styleManagerBeep');
    if (!panel) return;
    // ... logic for syncing sliders
    logger.log('[BeepModule] UI synchronized');
  }
}
