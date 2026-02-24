// src/scripts/utilities/preloader.ts
import { logger } from './logger';

/**
 * Utility to preload critical CDE assets (icons, sounds)
 * to ensure they are available in memory and avoid redundant network requests.
 */
export const Preloader = (() => {
  const CRITICAL_ICONS = [
    '/icons/shade-inactive.png',
    '/icons/shade-toggled-inactive.png',
    '/icons/maximize-inactive.png',
    '/icons/maximize-toggled-inactive.png',
    '/icons/close-inactive.png',
    '/icons/filemanager.png',
    '/icons/text-x-generic.png',
    '/icons/konsole.png',
    '/icons/computer.png',
    '/icons/org.xfce.settings.appearance.png',
    '/icons/multimedia-volume-control.png',
    '/icons/org.xfce.taskmanager.png',
    '/icons/calendar.png',
    '/icons/gtkclocksetup.png',
    '/icons/org.xfce.screenshooter.png',
  ];

  /**
   * Preloads an array of image URLs.
   */
  async function preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve; // Continue even if one fails
      });
    });
    await Promise.all(promises);
  }

  /**
   * Starts the preloading process.
   */
  async function init(): Promise<void> {
    logger.log('[Preloader] Starting preloading of critical assets...');
    const start = performance.now();

    await preloadImages(CRITICAL_ICONS);

    const end = performance.now();
    logger.log(
      `[Preloader] Preloaded ${CRITICAL_ICONS.length} icons in ${(end - start).toFixed(2)}ms`
    );
  }

  return { init };
})();

export default Preloader;
