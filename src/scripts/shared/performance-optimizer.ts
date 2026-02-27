// src/scripts/shared/performance-optimizer.ts
// Performance optimization utilities

import { logger } from '../utilities/logger';
import { moduleLoader, LoadPriority } from './module-loader';

/**
 * Performance metrics
 */
interface PerformanceMetrics {
  bootTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  domContentLoaded: number;
  loadComplete: number;
  modulesLoaded: number;
  avgModuleLoadTime: number;
}

/**
 * Performance optimizer with lazy loading and code splitting
 */
class PerformanceOptimizer {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  /**
   * Initialize performance monitoring
   */
  init(): void {
    this.setupPerformanceObservers();
    this.measureBootTime();
    logger.log('[PerformanceOptimizer] Initialized');
  }

  /**
   * Setup performance observers
   */
  private setupPerformanceObservers(): void {
    if (!('PerformanceObserver' in window)) {
      logger.warn('[PerformanceOptimizer] PerformanceObserver not supported');
      return;
    }

    try {
      // Paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
            logger.log(`[Performance] First Paint: ${entry.startTime.toFixed(2)}ms`);
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
            logger.log(`[Performance] First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);

      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics.domContentLoaded = navEntry.domContentLoadedEventEnd;
          this.metrics.loadComplete = navEntry.loadEventEnd;
          logger.log(
            `[Performance] DOM Content Loaded: ${navEntry.domContentLoadedEventEnd.toFixed(2)}ms`
          );
          logger.log(`[Performance] Load Complete: ${navEntry.loadEventEnd.toFixed(2)}ms`);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (error) {
      logger.warn('[PerformanceOptimizer] Failed to setup observers:', error);
    }
  }

  /**
   * Measure boot time
   */
  private measureBootTime(): void {
    const bootStart = performance.getEntriesByName('boot-start')[0];
    if (bootStart) {
      this.metrics.bootTime = performance.now() - bootStart.startTime;
      logger.log(`[Performance] Boot Time: ${this.metrics.bootTime.toFixed(2)}ms`);
    }
  }

  /**
   * Optimize initial load by prioritizing critical modules
   */
  async optimizeInitialLoad(): Promise<void> {
    logger.log('[PerformanceOptimizer] Optimizing initial load...');

    // Load critical modules first
    await moduleLoader.preloadByPriority(LoadPriority.CRITICAL);

    // Load high priority modules
    await moduleLoader.preloadByPriority(LoadPriority.HIGH);

    // Schedule medium priority modules for idle loading
    const mediumPriorityModules = ['filemanager', 'emacs', 'calendar', 'processmonitor'];
    moduleLoader.loadOnIdle(mediumPriorityModules);

    // Schedule low priority modules for later idle loading
    setTimeout(() => {
      const lowPriorityModules = ['netscape', 'lynx', 'manviewer', 'terminal'];
      moduleLoader.loadOnIdle(lowPriorityModules);
    }, 2000);

    // Schedule idle priority modules for much later
    setTimeout(() => {
      const idlePriorityModules = ['timemanager', 'appmanager'];
      moduleLoader.loadOnIdle(idlePriorityModules);
    }, 5000);

    logger.log('[PerformanceOptimizer] Initial load optimization complete');
  }

  /**
   * Prefetch resources for faster subsequent loads
   */
  prefetchResources(urls: string[]): void {
    if (!('HTMLLinkElement' in window)) return;

    urls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = this.getResourceType(url);
      document.head.appendChild(link);
    });

    logger.log(`[PerformanceOptimizer] Prefetching ${urls.length} resources`);
  }

  /**
   * Preconnect to external domains
   */
  preconnect(domains: string[]): void {
    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    logger.log(`[PerformanceOptimizer] Preconnecting to ${domains.length} domains`);
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.endsWith('.js')) return 'script';
    if (url.endsWith('.css')) return 'style';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'fetch';
  }

  /**
   * Defer non-critical scripts
   */
  deferNonCriticalScripts(): void {
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach((script) => {
      if (script instanceof HTMLScriptElement) {
        script.defer = true;
      }
    });

    logger.log(`[PerformanceOptimizer] Deferred ${scripts.length} non-critical scripts`);
  }

  /**
   * Optimize images with lazy loading
   */
  optimizeImages(): void {
    if (!('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src;
              observer.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    images.forEach((img) => observer.observe(img));
    logger.log(`[PerformanceOptimizer] Optimized ${images.length} images with lazy loading`);
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const moduleStats = moduleLoader.getStats();

    return {
      bootTime: this.metrics.bootTime || 0,
      firstPaint: this.metrics.firstPaint || 0,
      firstContentfulPaint: this.metrics.firstContentfulPaint || 0,
      domContentLoaded: this.metrics.domContentLoaded || 0,
      loadComplete: this.metrics.loadComplete || 0,
      modulesLoaded: moduleStats.loaded,
      avgModuleLoadTime: moduleStats.avgLoadTime,
    };
  }

  /**
   * Log performance report
   */
  logReport(): void {
    const metrics = this.getMetrics();
    const moduleStats = moduleLoader.getStats();

    logger.log('=== Performance Report ===');
    logger.log(`Boot Time: ${metrics.bootTime.toFixed(2)}ms`);
    logger.log(`First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
    logger.log(`First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
    logger.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    logger.log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
    logger.log(`Modules Loaded: ${moduleStats.loaded}/${moduleStats.total}`);
    logger.log(`Avg Module Load Time: ${moduleStats.avgLoadTime.toFixed(2)}ms`);
    logger.log('Modules by Priority:', moduleStats.byPriority);
    logger.log('========================');
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    logger.log('[PerformanceOptimizer] Cleaned up');
  }
}

// Singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

/**
 * Initialize performance optimizations
 */
export async function initPerformanceOptimizations(): Promise<void> {
  performanceOptimizer.init();
  await performanceOptimizer.optimizeInitialLoad();

  // Log report after 10 seconds
  setTimeout(() => {
    performanceOptimizer.logReport();
  }, 10000);
}
