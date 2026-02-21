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
    this.apply();
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
      window.AudioManager.beep(this.settings.pitch, this.settings.duration / 1000);
    }
  }

  public update(key: string, value: any): void {
    if (key in this.settings) {
      (this.settings as any)[key] = value;
      this.apply();
      this.save();
      logger.log(`[BeepModule] ${key} updated to`, value);
    }
  }

  public syncUI(): void {
    const panel = document.getElementById('styleManagerBeep');
    if (!panel) return;

    // Volume Slider
    const volSlider = panel.querySelector('#beep-volume') as HTMLInputElement;
    const volDisplay = panel.querySelector('#beep-volume + .value-display') as HTMLElement;
    if (volSlider && volDisplay) {
      volSlider.value = String(this.settings.volume);
      volDisplay.textContent = this.settings.volume + '%';
    }

    // Pitch Slider
    const pitchSlider = panel.querySelector('#beep-pitch') as HTMLInputElement;
    const pitchDisplay = panel.querySelector('#beep-pitch + .value-display') as HTMLElement;
    if (pitchSlider && pitchDisplay) {
      pitchSlider.value = String(this.settings.pitch);
      pitchDisplay.textContent = this.settings.pitch + 'Hz';
    }

    // Duration Slider
    const durSlider = panel.querySelector('#beep-duration') as HTMLInputElement;
    const durDisplay = panel.querySelector('#beep-duration + .value-display') as HTMLElement;
    if (durSlider && durDisplay) {
      durSlider.value = String(this.settings.duration);
      durDisplay.textContent = this.settings.duration + 'ms';
    }

    logger.log('[BeepModule] UI synchronized');
  }
}
