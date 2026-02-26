// src/scripts/utilities/virtual-scroller.ts
// Virtual scrolling implementation for large lists (FileManager, etc.)

import { logger } from './logger';

interface VirtualScrollerOptions {
  container: HTMLElement;
  itemHeight: number;
  renderItem: (index: number, data: any) => HTMLElement;
  data: any[];
  overscan?: number; // Number of items to render outside viewport
  onScroll?: (scrollTop: number) => void;
}

export class VirtualScroller {
  private container: HTMLElement;
  private viewport: HTMLElement;
  private content: HTMLElement;
  private itemHeight: number;
  private renderItem: (index: number, data: any) => HTMLElement;
  private data: any[];
  private overscan: number;
  private onScroll?: (scrollTop: number) => void;
  
  private visibleStart = 0;
  private visibleEnd = 0;
  private renderedItems: Map<number, HTMLElement> = new Map();
  private scrollTop = 0;
  private viewportHeight = 0;
  private totalHeight = 0;
  
  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(options: VirtualScrollerOptions) {
    this.container = options.container;
    this.itemHeight = options.itemHeight;
    this.renderItem = options.renderItem;
    this.data = options.data;
    this.overscan = options.overscan ?? 3;
    this.onScroll = options.onScroll;

    this.init();
  }

  private init(): void {
    // Create viewport and content containers
    this.viewport = document.createElement('div');
    this.viewport.style.cssText = `
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      width: 100%;
    `;

    this.content = document.createElement('div');
    this.content.style.cssText = `
      position: relative;
      width: 100%;
    `;

    this.viewport.appendChild(this.content);
    this.container.appendChild(this.viewport);

    // Setup event listeners
    this.viewport.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

    // Setup resize observer
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.viewport);
    }

    // Initial render
    this.updateDimensions();
    this.render();

    logger.log('[VirtualScroller] Initialized with', this.data.length, 'items');
  }

  private updateDimensions(): void {
    this.viewportHeight = this.viewport.clientHeight;
    this.totalHeight = this.data.length * this.itemHeight;
    this.content.style.height = `${this.totalHeight}px`;
  }

  private handleScroll(): void {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      this.scrollTop = this.viewport.scrollTop;
      this.render();
      
      if (this.onScroll) {
        this.onScroll(this.scrollTop);
      }
      
      this.rafId = null;
    });
  }

  private handleResize(): void {
    this.updateDimensions();
    this.render();
  }

  private calculateVisibleRange(): { start: number; end: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const end = Math.ceil((this.scrollTop + this.viewportHeight) / this.itemHeight);

    return {
      start: Math.max(0, start - this.overscan),
      end: Math.min(this.data.length, end + this.overscan),
    };
  }

  private render(): void {
    const { start, end } = this.calculateVisibleRange();

    // Remove items that are no longer visible
    this.renderedItems.forEach((element, index) => {
      if (index < start || index >= end) {
        element.remove();
        this.renderedItems.delete(index);
      }
    });

    // Add new visible items
    for (let i = start; i < end; i++) {
      if (!this.renderedItems.has(i)) {
        const item = this.renderItem(i, this.data[i]);
        item.style.cssText = `
          position: absolute;
          top: ${i * this.itemHeight}px;
          left: 0;
          right: 0;
          height: ${this.itemHeight}px;
        `;
        this.content.appendChild(item);
        this.renderedItems.set(i, item);
      }
    }

    this.visibleStart = start;
    this.visibleEnd = end;
  }

  /**
   * Update data and re-render
   */
  public setData(data: any[]): void {
    this.data = data;
    this.updateDimensions();
    
    // Clear all rendered items
    this.renderedItems.forEach((element) => element.remove());
    this.renderedItems.clear();
    
    this.render();
    logger.log('[VirtualScroller] Data updated:', data.length, 'items');
  }

  /**
   * Scroll to specific index
   */
  public scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth'): void {
    const targetScroll = index * this.itemHeight;
    this.viewport.scrollTo({
      top: targetScroll,
      behavior,
    });
  }

  /**
   * Get currently visible items
   */
  public getVisibleItems(): any[] {
    return this.data.slice(this.visibleStart, this.visibleEnd);
  }

  /**
   * Get visible range
   */
  public getVisibleRange(): { start: number; end: number } {
    return {
      start: this.visibleStart,
      end: this.visibleEnd,
    };
  }

  /**
   * Refresh specific item
   */
  public refreshItem(index: number): void {
    const element = this.renderedItems.get(index);
    if (element) {
      const newElement = this.renderItem(index, this.data[index]);
      newElement.style.cssText = element.style.cssText;
      element.replaceWith(newElement);
      this.renderedItems.set(index, newElement);
    }
  }

  /**
   * Destroy scroller and cleanup
   */
  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.renderedItems.forEach((element) => element.remove());
    this.renderedItems.clear();
    
    this.viewport.remove();
    
    logger.log('[VirtualScroller] Destroyed');
  }
}

/**
 * Create a virtual scroller for file lists
 */
export function createFileListScroller(
  container: HTMLElement,
  files: any[],
  onItemClick: (file: any) => void
): VirtualScroller {
  return new VirtualScroller({
    container,
    itemHeight: 24, // Standard file list item height
    data: files,
    overscan: 5,
    renderItem: (index, file) => {
      const item = document.createElement('div');
      item.className = 'fm-list-item';
      item.dataset.index = String(index);
      
      const icon = file.type === 'folder' ? '📁' : '📄';
      const size = file.type === 'folder' ? '--' : formatFileSize(file.metadata?.size || 0);
      const mtime = file.metadata?.mtime 
        ? new Date(file.metadata.mtime).toLocaleString() 
        : 'Unknown';
      
      item.innerHTML = `
        <span class="fm-icon">${icon}</span>
        <span class="fm-name">${file.name}</span>
        <span class="fm-size">${size}</span>
        <span class="fm-date">${mtime}</span>
      `;
      
      item.addEventListener('click', () => onItemClick(file));
      
      return item;
    },
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
