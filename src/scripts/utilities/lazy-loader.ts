// src/scripts/utilities/lazy-loader.ts
// Lazy loading utility for features to improve initial load time

import { logger } from './logger';

type FeatureLoader = () => Promise<any>;

interface LazyFeature {
  name: string;
  loader: FeatureLoader;
  loaded: boolean;
  loading: boolean;
  module?: any;
}

class LazyLoader {
  private features: Map<string, LazyFeature> = new Map();
  private observers: Map<string, IntersectionObserver> = new Map();

  /**
   * Register a feature for lazy loading
   */
  register(name: string, loader: FeatureLoader): void {
    this.features.set(name, {
      name,
      loader,
      loaded: false,
      loading: false,
    });
    logger.log(`[LazyLoader] Registered feature: ${name}`);
  }

  /**
   * Load a feature on demand
   */
  async load(name: string): Promise<any> {
    const feature = this.features.get(name);
    
    if (!feature) {
      logger.warn(`[LazyLoader] Feature not found: ${name}`);
      return null;
    }

    if (feature.loaded) {
      logger.log(`[LazyLoader] Feature already loaded: ${name}`);
      return feature.module;
    }

    if (feature.loading) {
      logger.log(`[LazyLoader] Feature already loading: ${name}, waiting...`);
      // Wait for the loading to complete
      while (feature.loading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return feature.module;
    }

    try {
      feature.loading = true;
      logger.log(`[LazyLoader] Loading feature: ${name}...`);
      
      const startTime = performance.now();
      feature.module = await feature.loader();
      const loadTime = performance.now() - startTime;
      
      feature.loaded = true;
      feature.loading = false;
      
      logger.log(`[LazyLoader] Feature loaded: ${name} (${loadTime.toFixed(2)}ms)`);
      return feature.module;
    } catch (error) {
      feature.loading = false;
      logger.error(`[LazyLoader] Failed to load feature: ${name}`, error);
      throw error;
    }
  }

  /**
   * Preload features in the background (low priority)
   */
  async preload(names: string[]): Promise<void> {
    logger.log(`[LazyLoader] Preloading ${names.length} features...`);
    
    // Use requestIdleCallback if available
    const loadNext = async (index: number) => {
      if (index >= names.length) return;
      
      const name = names[index];
      try {
        await this.load(name);
      } catch (error) {
        logger.warn(`[LazyLoader] Preload failed for ${name}:`, error);
      }
      
      // Schedule next load
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadNext(index + 1));
      } else {
        setTimeout(() => loadNext(index + 1), 100);
      }
    };
    
    loadNext(0);
  }

  /**
   * Load feature when element becomes visible
   */
  loadOnVisible(name: string, element: HTMLElement): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      this.load(name);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.load(name);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(element);
    this.observers.set(name, observer);
    
    logger.log(`[LazyLoader] Observing visibility for: ${name}`);
  }

  /**
   * Check if a feature is loaded
   */
  isLoaded(name: string): boolean {
    return this.features.get(name)?.loaded ?? false;
  }

  /**
   * Get loaded module
   */
  getModule(name: string): any {
    return this.features.get(name)?.module;
  }

  /**
   * Unload a feature (for memory management)
   */
  unload(name: string): void {
    const feature = this.features.get(name);
    if (feature) {
      feature.loaded = false;
      feature.module = undefined;
      logger.log(`[LazyLoader] Unloaded feature: ${name}`);
    }
  }

  /**
   * Get loading statistics
   */
  getStats(): { total: number; loaded: number; loading: number } {
    let loaded = 0;
    let loading = 0;
    
    this.features.forEach((feature) => {
      if (feature.loaded) loaded++;
      if (feature.loading) loading++;
    });
    
    return {
      total: this.features.size,
      loaded,
      loading,
    };
  }
}

// Singleton instance
export const lazyLoader = new LazyLoader();

// Feature registration helpers
export function registerLazyFeatures(): void {
  // Register features for lazy loading
  lazyLoader.register('emacs', () => import('../features/emacs'));
  lazyLoader.register('netscape', () => import('../features/netscape'));
  lazyLoader.register('terminal', () => import('../features/lab'));
  lazyLoader.register('filemanager', () => import('../features/filemanager'));
  lazyLoader.register('processmonitor', () => import('../features/processmonitor'));
  lazyLoader.register('calendar', () => import('../features/calendar'));
  lazyLoader.register('timemanager', () => import('../features/timemanager'));
  lazyLoader.register('appmanager', () => import('../features/appmanager'));
  
  logger.log('[LazyLoader] All features registered');
}
