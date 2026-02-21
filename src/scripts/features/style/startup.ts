// src/scripts/features/style/startup.ts

import { logger } from '../../utilities/logger';
import { settingsManager } from '../../core/settingsmanager';

/**
 * Session startup settings.
 */
export interface StartupSettings {
  restoreSession: boolean;
  onStartup: 'home' | 'session';
}

/**
 * Module to manage session startup and reset behavior.
 */
export class StartupModule {
  public settings: StartupSettings = {
    restoreSession: true,
    onStartup: 'session',
  };

  /**
   * Initializes the startup module.
   */
  public load(): void {
    const saved = settingsManager.getSection('theme').startup;
    if (saved) {
      Object.assign(this.settings, saved);
    }
    logger.log('[StartupModule] Loaded:', this.settings);
  }

  /**
   * Clears the current session (window positions, etc.)
   */
  public clearSession(): void {
    const session = settingsManager.getSection('session');
    session.windows = {};
    settingsManager.setSection('session', session);
    logger.log('[StartupModule] Session cleared');
    window.location.reload();
  }

  /**
   * Updates and saves settings.
   */
  public update(key: keyof StartupSettings, value: any): void {
    (this.settings as any)[key] = value;
    this.save();
  }

  private save(): void {
    const theme = settingsManager.getSection('theme');
    theme.startup = this.settings;
    settingsManager.setSection('theme', theme);
  }

  /**
   * Syncs UI in StyleManagerStartup.astro.
   */
  public syncUI(): void {
    const panel = document.getElementById('styleManagerStartup');
    if (!panel) return;

    const restoreCheck = panel.querySelector('input[data-key="restoreSession"]') as HTMLInputElement;
    if (restoreCheck) {
      restoreCheck.checked = this.settings.restoreSession;
    }

    const startupRadios = panel.querySelectorAll('input[name="startup-mode"]') as NodeListOf<HTMLInputElement>;
    startupRadios.forEach(radio => {
      radio.checked = radio.value === this.settings.onStartup;
    });
  }
}
