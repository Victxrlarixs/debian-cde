// src/scripts/features/style/backdrop.ts

import { logger } from '../../utilities/logger';
import { settingsManager } from '../../core/settingsmanager';
import { loadXpmBackdrop } from '../../core/xpmparser';

/**
 * Backdrop options for CDE.
 */
export interface BackdropSettings {
  type: 'image' | 'xpm';
  value: string;
}

/**
 * Module to manage desktop wallpapers.
 * Supports both static image files (.png, .jpg) and
 * authentic CDE XPM pattern files (.pm).
 */
export class BackdropModule {
  private settings: BackdropSettings = {
    type: 'xpm',
    value: '/backdrops/Toronto.pm',
  };

  /** Cache for rendered XPM data URLs to avoid re-parsing */
  private xpmCache: Map<string, string> = new Map();

  /**
   * Initializes the backdrop module and applies saved settings.
   */
  public load(): void {
    const saved = settingsManager.getSection('theme').backdrop;
    if (saved && (saved.type === 'image' || saved.type === 'xpm')) {
      this.settings = saved;
      // Migration: if the saved value is an old PNG that we deleted, reset to default Toronto.pm
      if (this.settings.value.endsWith('.png')) {
        this.settings = { type: 'xpm', value: '/backdrops/Toronto.pm' };
      }
    }
    this.apply();
    logger.log('[BackdropModule] Loaded and applied:', this.settings);
  }

  /**
   * Applies the current backdrop settings to the document body.
   * For .pm files, fetches, parses and renders the XPM pattern.
   */
  public async apply(): Promise<void> {
    const body = document.body;

    // Clear previous dynamic body styles
    body.classList.forEach((cls) => {
      if (cls.startsWith('backdrop-')) body.classList.remove(cls);
    });
    body.style.backgroundColor = '';

    if (this.settings.type === 'xpm' || this.settings.value.endsWith('.pm')) {
      await this.applyXpm(body);
    } else {
      body.style.backgroundImage = `url('${this.settings.value}')`;
      body.style.backgroundRepeat = 'repeat';
      body.style.backgroundSize = 'auto';
      body.style.backgroundPosition = 'top left';
      body.style.backgroundAttachment = 'fixed';
    }
  }

  /** Render and apply an XPM pattern file */
  private async applyXpm(body: HTMLElement): Promise<void> {
    const path = this.settings.value;
    let dataUrl = this.xpmCache.get(path);

    if (!dataUrl) {
      logger.log(`[BackdropModule] Parsing XPM: ${path}`);
      dataUrl = (await loadXpmBackdrop(path)) ?? undefined;
      if (dataUrl) this.xpmCache.set(path, dataUrl);
    }

    if (dataUrl) {
      body.style.backgroundImage = `url('${dataUrl}')`;
      body.style.backgroundRepeat = 'repeat';
      body.style.backgroundSize = 'auto';
      body.style.backgroundPosition = 'top left';
      body.style.backgroundAttachment = 'scroll';
      logger.log('[BackdropModule] XPM backdrop applied');
    } else {
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = 'var(--window-color)';
      logger.warn('[BackdropModule] XPM parse failed, using solid color fallback');
    }
  }

  /**
   * Updates the backdrop settings and persists them.
   */
  public update(type: BackdropSettings['type'], value: string): void {
    if (value.endsWith('.pm')) type = 'xpm';
    this.settings = { type, value };
    this.xpmCache.delete(value);
    this.apply();
    this.save();
    logger.log(`[BackdropModule] Updated to ${type}: ${value}`);
  }

  /**
   * Clears the XPM render cache (call after theme color changes).
   */
  public clearCache(): void {
    this.xpmCache.clear();
    logger.log('[BackdropModule] XPM cache cleared');
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

    document.querySelectorAll('.backdrop-preset').forEach((btn) => {
      const bValue = (btn as HTMLElement).dataset.value;
      if (bValue === this.settings.value) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}
