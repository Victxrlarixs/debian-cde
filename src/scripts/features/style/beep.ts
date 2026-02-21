// src/scripts/features/style/beep.ts

import { logger } from '../../utilities/logger';

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
    try {
      const saved = localStorage.getItem('cde-beep-settings');
      if (saved) {
        Object.assign(this.settings, JSON.parse(saved));
        logger.log('[BeepModule] Loaded from localStorage:', this.settings);
      }
    } catch (e) {
      console.warn('[BeepModule] Failed to load from localStorage:', e);
    }
  }

  public save(): void {
    localStorage.setItem('cde-beep-settings', JSON.stringify(this.settings));
    logger.log('[BeepModule] Saved to localStorage:', this.settings);
  }

  public apply(): void {
    logger.log('[BeepModule] Applied settings:', this.settings);
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
