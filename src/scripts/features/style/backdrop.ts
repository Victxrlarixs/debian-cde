// src/scripts/features/style/backdrop.ts

import { logger } from '../../utilities/logger';
import { settingsManager } from '../../core/settingsmanager';

/**
 * Backdrop options for CDE.
 * Only image backdrops are supported now.
 */
export interface BackdropSettings {
  type: 'image';
  value: string; // image path
}

/**
 * Module to manage desktop wallpapers.
 */
export class BackdropModule {
  private settings: BackdropSettings = {
    type: 'image',
    value: '/backdrops/Marble.png',
  };

  /**
   * Initializes the backdrop module and applies saved settings.
   */
  public load(): void {
    const saved = settingsManager.getSection('theme').backdrop;
    if (saved && saved.type === 'image') {
      this.settings = saved;
    }
    this.apply();
    logger.log('[BackdropModule] Loaded and applied:', this.settings);
  }

  /**
   * Applies the current backdrop settings to the document body.
   */
  public apply(): void {
    const body = document.body;

    // Clear previous dynamic body styles if any (from old patterns)
    body.classList.forEach((cls) => {
      if (cls.startsWith('backdrop-')) body.classList.remove(cls);
    });

    body.style.backgroundColor = '';
    body.style.backgroundImage = `url('${this.settings.value}')`;
    body.style.backgroundRepeat = 'repeat';
    body.style.backgroundSize = 'auto';
    body.style.backgroundPosition = 'center';
    body.style.backgroundAttachment = 'fixed';
  }

  /**
   * Updates the backdrop settings and persists them.
   * @param type - The type of backdrop ('color', 'image', 'pattern')
   * @param value - The value (URL, HEX, or class name)
   */
  public update(type: BackdropSettings['type'], value: string): void {
    this.settings = { type, value };
    this.apply();
    this.save();
    logger.log(`[BackdropModule] Updated to ${type}: ${value}`);
  }

  /**
   * Returns the current backdrop settings.
   */
  public getSettings(): BackdropSettings {
    return { ...this.settings };
  }

  /**
   * Persists the current backdrop settings to logical storage.
   */
  private save(): void {
    const theme = settingsManager.getSection('theme');
    theme.backdrop = this.settings;
    settingsManager.setSection('theme', theme);
  }

  /**
   * Syncs the UI state with the current module settings.
   */
  public syncUI(): void {
    const status = document.getElementById('backdropStatus');
    if (status) {
      status.textContent = `${this.settings.type}: ${this.settings.value.split('/').pop()}`;
    }

    // Highlight active preset in UI
    document.querySelectorAll('.backdrop-preset').forEach((btn) => {
      const bType = (btn as HTMLElement).dataset.type;
      const bValue = (btn as HTMLElement).dataset.value;
      if (bType === this.settings.type && bValue === this.settings.value) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}
