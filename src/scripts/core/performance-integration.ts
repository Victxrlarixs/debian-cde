// src/scripts/core/performance-integration.ts
// Integration layer for all performance optimizations

import { logger } from '../utilities/logger';
import { lazyLoader, registerLazyFeatures } from '../utilities/lazy-loader';
import { indexedDBManager } from '../utilities/indexeddb-manager';
import { performanceMonitor } from './performance-monitor';

/**
 * Initialize all performance optimizations
 */
export async function initPerformanceOptimizations(): Promise<void> {
  logger.log('[Performance] Initializing optimizations...');
  
  try {
    // 1. Start performance monitoring
    performanceMonitor.init();
    performanceMonitor.mark('perf-init-start');

    // 2. Initialize storage adapter (IndexedDB with localStorage fallback)
    const { storageAdapter } = await import('../utilities/storage-adapter');
    await storageAdapter.init();
    logger.log('[Performance] Storage adapter initialized');

    // 3. Initialize IndexedDB
    await indexedDBManager.init();
    
    // 4. Migrate from localStorage if needed
    const migrated = localStorage.getItem('cde-indexeddb-migrated');
    if (!migrated) {
      await indexedDBManager.migrateFromLocalStorage();
      localStorage.setItem('cde-indexeddb-migrated', 'true');
      logger.log('[Performance] Migrated to IndexedDB');
    }

    // 5. Register lazy-loadable features
    registerLazyFeatures();

    // 6. Preload critical features in background
    const criticalFeatures = ['filemanager', 'emacs'];
    setTimeout(() => {
      lazyLoader.preload(criticalFeatures);
    }, 2000); // Wait 2s after initial load

    // 6. Cleanup old cache entries
    await indexedDBManager.cleanupCache();

    performanceMonitor.mark('perf-init-end');
    const duration = performanceMonitor.measure(
      'perf-init',
      'perf-init-start',
      'perf-init-end'
    );

    logger.log(`[Performance] Optimizations initialized in ${duration.toFixed(2)}ms`);

    // 7. Log storage usage
    const estimate = await indexedDBManager.getStorageEstimate();
    const usageMB = (estimate.usage / 1024 / 1024).toFixed(2);
    const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
    logger.log(`[Performance] Storage: ${usageMB}MB / ${quotaMB}MB`);

  } catch (error) {
    logger.error('[Performance] Failed to initialize optimizations:', error);
  }
}

/**
 * Create XPM worker instance
 */
export function createXPMWorker(): Worker {
  try {
    const worker = new Worker(
      new URL('../workers/xpm-worker.ts', import.meta.url),
      { type: 'module' }
    );
    logger.log('[Performance] XPM Worker created');
    return worker;
  } catch (error) {
    logger.error('[Performance] Failed to create XPM Worker:', error);
    throw error;
  }
}

/**
 * Create VFS worker instance
 */
export function createVFSWorker(): Worker {
  try {
    const worker = new Worker(
      new URL('../workers/vfs-worker.ts', import.meta.url),
      { type: 'module' }
    );
    logger.log('[Performance] VFS Worker created');
    return worker;
  } catch (error) {
    logger.error('[Performance] Failed to create VFS Worker:', error);
    throw error;
  }
}

/**
 * Parse XPM using Web Worker
 */
export async function parseXPMWithWorker(
  xpmText: string,
  themeColors: Record<string, string>
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const worker = createXPMWorker();
    
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error('XPM parsing timeout'));
    }, 10000); // 10s timeout

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      
      if (e.data.type === 'result') {
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data.dataUrl);
        }
      }
    };

    worker.onerror = (error) => {
      clearTimeout(timeout);
      worker.terminate();
      reject(error);
    };

    worker.postMessage({
      type: 'parse',
      xpmText,
      themeColors,
    });
  });
}

/**
 * Search VFS using Web Worker
 */
export async function searchVFSWithWorker(
  fsMap: Record<string, any>,
  pattern: string
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const worker = createVFSWorker();
    
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error('VFS search timeout'));
    }, 5000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      
      if (e.data.type === 'result') {
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data.data);
        }
      }
    };

    worker.onerror = (error) => {
      clearTimeout(timeout);
      worker.terminate();
      reject(error);
    };

    worker.postMessage({
      type: 'search',
      payload: { fsMap, pattern },
    });
  });
}

/**
 * Get performance report
 */
export function getPerformanceReport(): {
  metrics: any;
  lazyLoading: any;
  storage: Promise<any>;
  memory: any;
} {
  return {
    metrics: performanceMonitor.getMetrics(),
    lazyLoading: lazyLoader.getStats(),
    storage: indexedDBManager.getStorageEstimate(),
    memory: performanceMonitor.getMemoryUsage(),
  };
}

/**
 * Log complete performance report
 */
export async function logPerformanceReport(): Promise<void> {
  console.log('='.repeat(60));
  console.log('CDE PERFORMANCE REPORT');
  console.log('='.repeat(60));
  
  // Metrics
  performanceMonitor.logSummary();
  
  // Lazy Loading
  const lazyStats = lazyLoader.getStats();
  console.log('\n=== Lazy Loading ===');
  console.log(`Total Features: ${lazyStats.total}`);
  console.log(`Loaded: ${lazyStats.loaded}`);
  console.log(`Loading: ${lazyStats.loading}`);
  console.log(`Pending: ${lazyStats.total - lazyStats.loaded - lazyStats.loading}`);
  
  // Storage
  const storage = await indexedDBManager.getStorageEstimate();
  console.log('\n=== Storage ===');
  console.log(`Used: ${(storage.usage / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Quota: ${(storage.quota / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Available: ${((storage.quota - storage.usage) / 1024 / 1024).toFixed(2)} MB`);
  
  // Memory
  const memory = performanceMonitor.getMemoryUsage();
  if (memory) {
    console.log('\n=== Memory (Chrome) ===');
    console.log(`Used: ${(memory.used / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total: ${(memory.total / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Limit: ${(memory.limit / 1024 / 1024).toFixed(2)} MB`);
  }
  
  console.log('='.repeat(60));
}

// Global exposure for debugging
if (typeof window !== 'undefined') {
  (window as any).getPerformanceReport = getPerformanceReport;
  (window as any).logPerformanceReport = logPerformanceReport;
}
