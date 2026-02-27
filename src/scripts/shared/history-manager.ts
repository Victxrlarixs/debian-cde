// src/scripts/shared/history-manager.ts
// Shared history navigation functionality

import { logger } from '../utilities/logger';

/**
 * Generic history manager for browser-like navigation
 * Eliminates duplicated history code in Netscape, Lynx, etc.
 */
export class HistoryManager<T = string> {
  private history: T[] = [];
  private currentIndex: number = -1;
  private maxSize: number;

  constructor(initialItem?: T, maxSize: number = 100) {
    this.maxSize = maxSize;
    if (initialItem !== undefined) {
      this.push(initialItem);
    }
  }

  /**
   * Add a new item to history
   * Truncates forward history if we branched
   */
  push(item: T): void {
    // Truncate forward history if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    this.history.push(item);
    this.currentIndex = this.history.length - 1;

    // Enforce max size
    if (this.history.length > this.maxSize) {
      this.history.shift();
      this.currentIndex--;
    }

    logger.log(`[HistoryManager] Pushed item, index: ${this.currentIndex}`);
  }

  /**
   * Navigate back in history
   * Returns the previous item or null if at the beginning
   */
  back(): T | null {
    if (!this.canGoBack()) {
      return null;
    }

    this.currentIndex--;
    logger.log(`[HistoryManager] Went back, index: ${this.currentIndex}`);
    return this.current();
  }

  /**
   * Navigate forward in history
   * Returns the next item or null if at the end
   */
  forward(): T | null {
    if (!this.canGoForward()) {
      return null;
    }

    this.currentIndex++;
    logger.log(`[HistoryManager] Went forward, index: ${this.currentIndex}`);
    return this.current();
  }

  /**
   * Get current item without changing position
   */
  current(): T | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.history.length) {
      return null;
    }
    return this.history[this.currentIndex];
  }

  /**
   * Check if we can go back
   */
  canGoBack(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if we can go forward
   */
  canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get all history items
   */
  getAll(): T[] {
    return [...this.history];
  }

  /**
   * Get recent history items (most recent first)
   */
  getRecent(count: number): T[] {
    return [...this.history].reverse().slice(0, count);
  }

  /**
   * Get current index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Get history length
   */
  length(): number {
    return this.history.length;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    logger.log('[HistoryManager] Cleared history');
  }

  /**
   * Jump to a specific index
   */
  jumpTo(index: number): T | null {
    if (index < 0 || index >= this.history.length) {
      return null;
    }

    this.currentIndex = index;
    logger.log(`[HistoryManager] Jumped to index: ${index}`);
    return this.current();
  }
}
