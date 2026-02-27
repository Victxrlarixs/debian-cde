// src/scripts/shared/xpm-renderer.ts
// Shared XPM rendering utilities to eliminate duplication

import { logger } from '../utilities/logger';
import { parseXpmToDataUrl, loadXpmBackdrop } from '../core/xpmparser';

/**
 * Configuration for XPM canvas rendering
 */
export interface XpmCanvasConfig {
  /** Canvas element ID */
  canvasId: string;
  /** XPM file path */
  xpmPath: string;
  /** Optional canvas width (defaults to canvas.width) */
  width?: number;
  /** Optional canvas height (defaults to canvas.height) */
  height?: number;
  /** Whether to log success */
  logSuccess?: boolean;
}

/**
 * XPM cache for rendered data URLs
 * Shared across all XPM rendering operations
 */
class XpmCache {
  private cache: Map<string, string> = new Map();

  get(path: string): string | null {
    return this.cache.get(path) || null;
  }

  set(path: string, dataUrl: string): void {
    this.cache.set(path, dataUrl);
  }

  has(path: string): boolean {
    return this.cache.has(path);
  }

  delete(path: string): void {
    this.cache.delete(path);
  }

  clear(): void {
    this.cache.clear();
    logger.log('[XpmCache] Cache cleared');
  }

  size(): number {
    return this.cache.size;
  }
}

// Global XPM cache instance
const xpmCache = new XpmCache();

/**
 * Renders an XPM file to a canvas element
 * Uses caching to avoid re-parsing the same XPM file
 *
 * @param config - Configuration for rendering
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export async function renderXpmToCanvas(config: XpmCanvasConfig): Promise<boolean> {
  const { canvasId, xpmPath, width, height, logSuccess = true } = config;

  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) {
    logger.warn(`[XpmRenderer] Canvas not found: ${canvasId}`);
    return false;
  }

  try {
    // Check cache first
    let dataUrl = xpmCache.get(xpmPath);

    if (!dataUrl) {
      // Fetch and parse XPM
      const response = await fetch(xpmPath);
      const xpmText = await response.text();
      dataUrl = await parseXpmToDataUrl(xpmText);

      if (dataUrl) {
        xpmCache.set(xpmPath, dataUrl);
      }
    }

    if (dataUrl) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const w = width || canvas.width;
          const h = height || canvas.height;
          ctx.drawImage(img, 0, 0, w, h);
          if (logSuccess) {
            logger.log(`[XpmRenderer] Rendered ${xpmPath} to canvas ${canvasId}`);
          }
        }
      };
      img.src = dataUrl;
      return true;
    }

    return false;
  } catch (error) {
    logger.error(`[XpmRenderer] Failed to render ${xpmPath}:`, error);
    return false;
  }
}

/**
 * Loads an XPM backdrop with caching
 * Wrapper around loadXpmBackdrop with cache support
 *
 * @param path - Path to XPM file
 * @param useCache - Whether to use cache (default: true)
 * @returns Promise<string | null> - Data URL or null
 */
export async function loadXpmBackdropCached(
  path: string,
  useCache: boolean = true
): Promise<string | null> {
  if (useCache && xpmCache.has(path)) {
    return xpmCache.get(path) || null;
  }

  const dataUrl = await loadXpmBackdrop(path);

  if (dataUrl && useCache) {
    xpmCache.set(path, dataUrl);
  }

  return dataUrl;
}

/**
 * Clears the XPM cache
 * Useful when theme colors change and XPM files need to be re-rendered
 */
export function clearXpmCache(): void {
  xpmCache.clear();
}

/**
 * Clears a specific XPM from cache
 */
export function clearXpmFromCache(path: string): void {
  xpmCache.delete(path);
}

/**
 * Gets cache statistics
 */
export function getXpmCacheStats(): { size: number; paths: string[] } {
  return {
    size: xpmCache.size(),
    paths: Array.from(xpmCache['cache'].keys()),
  };
}

/**
 * Preloads multiple XPM files into cache
 * Useful for preloading commonly used XPM files
 *
 * @param paths - Array of XPM file paths
 * @returns Promise<number> - Number of successfully loaded files
 */
export async function preloadXpmFiles(paths: string[]): Promise<number> {
  let successCount = 0;

  const promises = paths.map(async (path) => {
    try {
      const dataUrl = await loadXpmBackdropCached(path, true);
      if (dataUrl) {
        successCount++;
      }
    } catch (error) {
      logger.warn(`[XpmRenderer] Failed to preload ${path}:`, error);
    }
  });

  await Promise.all(promises);
  logger.log(`[XpmRenderer] Preloaded ${successCount}/${paths.length} XPM files`);

  return successCount;
}
