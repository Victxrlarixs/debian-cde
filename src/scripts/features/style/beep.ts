// src/scripts/features/style/beep.ts

import { logger } from '../../utilities/logger';
import { settingsManager } from '../../core/settingsmanager';
import { CONFIG } from '../../core/config';

/**
 * System beep and sound settings.
 */
export interface BeepSettings {
  volume: number;
  frequency: number;
  duration: number;
}

/**
 * Module to manage system beep settings and volume.
 */
export class BeepModule {
  public settings: BeepSettings = {
    volume: CONFIG.AUDIO.BEEP_GAIN,
    frequency: CONFIG.AUDIO.BEEP_FREQUENCY,
    duration: CONFIG.AUDIO.BEEP_DURATION,
  };

  /**
   * Initializes the beep module and applies saved settings.
   * Always ensures volume starts at 90% (0.9) if not previously configured.
   */
  public load(): void {
    const saved = settingsManager.getSection('beep');
    if (Object.keys(saved).length > 0) {
      Object.assign(this.settings, saved);
    } else {
      // First time load: ensure volume is set to 90%
      this.settings.volume = 0.9;
      this.save();
    }
    this.apply();
    logger.log('[BeepModule] Loaded:', this.settings);
  }

  /**
   * Applies the current beep settings to the AudioManager.
   */
  public apply(): void {
    if (window.AudioManager) {
      window.AudioManager.setVolume(this.settings.volume);
    }
    logger.log('[BeepModule] Applied settings to AudioManager');
  }

  /**
   * Updates a specific beep setting and persists it.
   */
  public update(key: keyof BeepSettings, value: number): void {
    if (key in this.settings) {
      this.settings[key] = value;
      this.apply();
      this.save();
      logger.log(`[BeepModule] "${key}" updated to ${value}`);
    }
  }

  /**
   * Persists the current beep settings.
   */
  private save(): void {
    settingsManager.setSection('beep', this.settings);
  }

  /**
   * Syncs the UI in StyleManagerBeep.astro.
   */
  public syncUI(): void {
    const panel = document.getElementById('styleManagerBeep');
    if (!panel) return;

    const volumeSlider = panel.querySelector('input[data-key="volume"]') as HTMLInputElement;
    if (volumeSlider) {
      volumeSlider.value = String(this.settings.volume * 100);
    }

    const freqSlider = panel.querySelector('input[data-key="frequency"]') as HTMLInputElement;
    if (freqSlider) {
      freqSlider.value = String(this.settings.frequency);
    }

    const durSlider = panel.querySelector('input[data-key="duration"]') as HTMLInputElement;
    if (durSlider) {
      durSlider.value = String(this.settings.duration * 1000);
    }

    logger.log('[BeepModule] UI synchronized');
  }

  /**
   * Test the current beep settings.
   */
  public testBeep(): void {
    if (window.AudioManager) {
      window.AudioManager.beep(this.settings.frequency, this.settings.duration);
      logger.log('[BeepModule] Test beep played');
    }
  }
}
