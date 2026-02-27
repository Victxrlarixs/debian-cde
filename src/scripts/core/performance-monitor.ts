// src/scripts/core/performance-monitor.ts
// Performance monitoring and Web Vitals tracking

import { logger } from '../utilities/logger';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  tti?: number; // Time to Interactive
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      logger.warn('[PerformanceMonitor] PerformanceObserver not supported');
      return;
    }

    this.observePaint();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.measureTTFB();
    this.measureLoadTime();

    logger.log('[PerformanceMonitor] Initialized');
  }

  /**
   * Observe paint timing (FCP)
   */
  private observePaint(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            logger.log(`[PerformanceMonitor] FCP: ${entry.startTime.toFixed(2)}ms`);
            this.reportMetric('FCP', entry.startTime);
          }
        }
      });

      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('[PerformanceMonitor] Failed to observe paint:', error);
    }
  }

  /**
   * Observe Largest Contentful Paint
   */
  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.metrics.lcp = lastEntry.startTime;
        logger.log(`[PerformanceMonitor] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        this.reportMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('[PerformanceMonitor] Failed to observe LCP:', error);
    }
  }

  /**
   * Observe First Input Delay
   */
  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
          logger.log(`[PerformanceMonitor] FID: ${this.metrics.fid.toFixed(2)}ms`);
          this.reportMetric('FID', this.metrics.fid);
        }
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('[PerformanceMonitor] Failed to observe FID:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private observeCLS(): void {
    try {
      let clsValue = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
          }
        }

        this.metrics.cls = clsValue;
        logger.log(`[PerformanceMonitor] CLS: ${clsValue.toFixed(4)}`);
        this.reportMetric('CLS', clsValue);
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('[PerformanceMonitor] Failed to observe CLS:', error);
    }
  }

  /**
   * Measure Time to First Byte
   */
  private measureTTFB(): void {
    try {
      const navigationEntry = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigationEntry) {
        this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        logger.log(`[PerformanceMonitor] TTFB: ${this.metrics.ttfb.toFixed(2)}ms`);
        this.reportMetric('TTFB', this.metrics.ttfb);
      }
    } catch (error) {
      logger.warn('[PerformanceMonitor] Failed to measure TTFB:', error);
    }
  }

  /**
   * Measure page load time
   */
  private measureLoadTime(): void {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      logger.log(`[PerformanceMonitor] Page Load: ${loadTime.toFixed(2)}ms`);
      this.reportMetric('PageLoad', loadTime);
    });
  }

  /**
   * Report metric to analytics (placeholder)
   */
  private reportMetric(name: string, value: number): void {
    // This is where you'd send to analytics service
    // For now, just log to console in dev mode
    if (import.meta.env.DEV) {
      console.log(`📊 [Metric] ${name}: ${value.toFixed(2)}`);
    }

    // Example: Send to analytics
    // if (window.gtag) {
    //   window.gtag('event', name, {
    //     value: Math.round(value),
    //     metric_id: name,
    //   });
    // }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance summary
   */
  getSummary(): string {
    const lines = [
      '=== Performance Metrics ===',
      `FCP: ${this.metrics.fcp?.toFixed(2) || 'N/A'}ms`,
      `LCP: ${this.metrics.lcp?.toFixed(2) || 'N/A'}ms`,
      `FID: ${this.metrics.fid?.toFixed(2) || 'N/A'}ms`,
      `CLS: ${this.metrics.cls?.toFixed(4) || 'N/A'}`,
      `TTFB: ${this.metrics.ttfb?.toFixed(2) || 'N/A'}ms`,
      '========================',
    ];

    return lines.join('\n');
  }

  /**
   * Log performance summary to console
   */
  logSummary(): void {
    console.log(this.getSummary());
  }

  /**
   * Mark a custom performance point
   */
  mark(name: string): void {
    performance.mark(name);
    logger.log(`[PerformanceMonitor] Mark: ${name}`);
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark: string): number {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    logger.log(`[PerformanceMonitor] Measure ${name}: ${measure.duration.toFixed(2)}ms`);
    return measure.duration;
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): { used: number; total: number; limit: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  /**
   * Cleanup observers
   */
  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    logger.log('[PerformanceMonitor] Destroyed');
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Global exposure for debugging
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = performanceMonitor;
}
