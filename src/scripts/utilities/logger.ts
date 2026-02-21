// src/scripts/utilities/logger.ts

/**
 * Conditional logger for CDE Desktop.
 *
 * Uses Vite's build-time constant `import.meta.env.DEV` so that in production
 * builds the no-op branches are statically evaluated and tree-shaken away —
 * the log calls are literally absent from the production bundle.
 *
 * Usage:
 *   import { logger } from '../utilities/logger';
 *   logger.log('[MyModule] initialized');
 *
 * Rules:
 *  - logger.log / logger.debug / logger.info → only in development
 *  - logger.warn / logger.error              → always visible (real problems)
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log:   isDev ? console.log.bind(console)   : () => {},
  debug: isDev ? console.debug.bind(console) : () => {},
  info:  isDev ? console.info.bind(console)  : () => {},
  warn:  console.warn.bind(console),
  error: console.error.bind(console),
};
