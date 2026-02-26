// src/scripts/core/version-manager.ts

import { logger } from '../utilities/logger';

/**
 * Version Manager - Handles cache busting and version migrations
 *
 * IMPORTANT: Update APP_VERSION in package.json when deploying breaking changes
 */

const VERSION_KEY = 'cde-app-version';

export class VersionManager {
  private static instance: VersionManager;
  private currentVersion: string;

  private constructor() {
    // Get version from package.json (injected at build time)
    // @ts-ignore - Vite injects this at build time
    this.currentVersion = import.meta.env.PUBLIC_APP_VERSION || '1.0.0';
  }

  public static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }
    return VersionManager.instance;
  }

  /**
   * Checks if the app version has changed and performs cleanup if needed
   */
  public async checkVersion(): Promise<void> {
    const storedVersion = localStorage.getItem(VERSION_KEY);

    if (!storedVersion) {
      // First time user
      logger.log(`[VersionManager] First time user, setting version: ${this.currentVersion}`);
      localStorage.setItem(VERSION_KEY, this.currentVersion);
      return;
    }

    if (storedVersion !== this.currentVersion) {
      logger.warn(
        `[VersionManager] Version mismatch! Stored: ${storedVersion}, Current: ${this.currentVersion}`
      );
      await this.performVersionUpdate(storedVersion, this.currentVersion);
    } else {
      logger.log(`[VersionManager] Version check passed: ${this.currentVersion}`);
    }
  }

  /**
   * Performs cleanup and migration when version changes
   */
  private async performVersionUpdate(oldVersion: string, newVersion: string): Promise<void> {
    logger.log(`[VersionManager] Updating from ${oldVersion} to ${newVersion}`);

    try {
      // 1. Clear all localStorage except critical data
      await this.clearCache();

      // 2. Clear service worker cache if exists
      await this.clearServiceWorkerCache();

      // 3. Update version
      localStorage.setItem(VERSION_KEY, newVersion);

      // 4. Show update notification
      this.showUpdateNotification(oldVersion, newVersion);

      // 5. Force reload after a short delay
      setTimeout(() => {
        logger.log('[VersionManager] Forcing page reload...');
        window.location.reload();
      }, 2000);
    } catch (error) {
      logger.error('[VersionManager] Error during version update:', error);
    }
  }

  /**
   * Clears storage cache while preserving critical data
   */
  private async clearCache(): Promise<void> {
    logger.log('[VersionManager] Clearing storage cache...');

    // List of keys to preserve (if you want to keep user preferences)
    const preserveKeys: string[] = [
      // 'cde-system-settings', // Uncomment to preserve user settings
      // 'cde_high_contrast',   // Uncomment to preserve accessibility settings
    ];

    // Get all keys from localStorage
    const allKeys = Object.keys(localStorage);

    // Remove all except preserved
    allKeys.forEach((key) => {
      if (!preserveKeys.includes(key) && key !== VERSION_KEY) {
        localStorage.removeItem(key);
        logger.log(`[VersionManager] Removed: ${key}`);
      }
    });

    // Also clear IndexedDB settings store
    try {
      const { indexedDBManager, STORES } = await import('../utilities/indexeddb-manager');
      await indexedDBManager.clear(STORES.SETTINGS);
      logger.log('[VersionManager] Cleared IndexedDB settings');
    } catch (error) {
      logger.warn('[VersionManager] Could not clear IndexedDB:', error);
    }
  }

  /**
   * Clears service worker cache if available
   */
  private async clearServiceWorkerCache(): Promise<void> {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            logger.log(`[VersionManager] Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
        logger.log('[VersionManager] All caches cleared');
      } catch (error) {
        logger.error('[VersionManager] Error clearing caches:', error);
      }
    }
  }

  /**
   * Shows a visual notification about the update
   */
  private showUpdateNotification(oldVersion: string, newVersion: string): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--window-color, #4d648d);
      border: 2px solid var(--border-light, #fff);
      padding: 20px 30px;
      z-index: 999999;
      font-family: var(--font-family-base, monospace);
      font-size: 14px;
      color: var(--text-color, #fff);
      box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
      text-align: center;
      min-width: 300px;
    `;

    notification.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold;">🔄 System Update</div>
      <div style="margin-bottom: 15px;">
        Updating from v${oldVersion} to v${newVersion}
      </div>
      <div style="font-size: 12px; opacity: 0.8;">
        Clearing cache and reloading...
      </div>
    `;

    document.body.appendChild(notification);

    // Remove after reload
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Gets the current app version
   */
  public getVersion(): string {
    return this.currentVersion;
  }

  /**
   * Forces a cache clear and reload (for manual use)
   */
  public async forceUpdate(): Promise<void> {
    logger.log('[VersionManager] Force update requested');
    await this.clearCache();
    await this.clearServiceWorkerCache();
    window.location.reload();
  }
}

// Global exposure for debugging
if (typeof window !== 'undefined') {
  (window as any).VersionManager = VersionManager.getInstance();
}

export default VersionManager.getInstance();
