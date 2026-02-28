// src/scripts/boot/backdrop-preloader.ts
// Preloads the default backdrop in parallel with boot sequence

import { CONFIG } from '../core/config';
import { parseXpmToDataUrl } from '../core/xpmparser';
import { logger } from '../utilities/logger';

let backdropDataUrl: string | null = null;
let backdropPromise: Promise<string | null> | null = null;
let isApplied = false;

/**
 * Start preloading the default backdrop immediately
 * This runs in parallel with the boot sequence
 */
export function startBackdropPreload(): void {
  if (backdropPromise) return; // Already started

  backdropPromise = (async () => {
    try {
      const startTime = performance.now();
      const backdropPath = CONFIG.BACKDROP.DEFAULT_BACKDROP;

      // Fetch is already in-flight due to preload link in HTML
      const response = await fetch(backdropPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const xpmText = await response.text();

      // Parse XPM to data URL (uses worker if available)
      backdropDataUrl = await parseXpmToDataUrl(xpmText);

      const loadTime = performance.now() - startTime;
      logger.log(`[BackdropPreloader] Default backdrop preloaded in ${loadTime.toFixed(2)}ms`);

      return backdropDataUrl;
    } catch (error) {
      logger.error('[BackdropPreloader] Failed to preload backdrop:', error);
      return null;
    }
  })();
}

/**
 * Get the preloaded backdrop data URL
 * Waits for preload to complete if still in progress
 */
export async function getPreloadedBackdrop(): Promise<string | null> {
  if (backdropDataUrl) return backdropDataUrl;
  if (backdropPromise) return await backdropPromise;
  return null;
}

/**
 * Apply the preloaded backdrop to document.body immediately
 * This should be called as early as possible in the boot sequence
 */
export async function applyPreloadedBackdrop(): Promise<boolean> {
  if (isApplied) {
    logger.log('[BackdropPreloader] Backdrop already applied');
    return true;
  }

  const dataUrl = await getPreloadedBackdrop();

  if (dataUrl) {
    document.body.style.backgroundImage = `url('${dataUrl}')`;
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundSize = 'auto';
    document.body.style.backgroundPosition = 'top left';
    document.body.style.backgroundAttachment = 'scroll';

    isApplied = true;
    logger.log('[BackdropPreloader] Default backdrop applied from preload');
    return true;
  }

  logger.warn('[BackdropPreloader] No preloaded backdrop available');
  return false;
}

/**
 * Check if the preloaded backdrop has been applied
 */
export function isBackdropApplied(): boolean {
  return isApplied;
}

/**
 * Get the default backdrop path from config
 */
export function getDefaultBackdropPath(): string {
  return CONFIG.BACKDROP.DEFAULT_BACKDROP;
}
