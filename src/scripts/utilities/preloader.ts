// src/scripts/utilities/preloader.ts
import { logger } from './logger';

/**
 * Preloader module - currently disabled
 * Icon preloading has been removed to eliminate cache-related issues
 */
export const Preloader = (() => {
  /**
   * Placeholder init function - does nothing
   */
  async function init(): Promise<void> {
    logger.log('[Preloader] Icon preloading disabled');
  }

  return { init };
})();

export default Preloader;
