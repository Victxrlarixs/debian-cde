// src/scripts/core/accessibility.ts

import { logger } from '../utilities/logger';
import { AudioManager } from './audiomanager';
import { WindowManager } from './windowmanager';

/**
 * Keyboard shortcut definition
 */
interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  category: string;
}

/**
 * Accessibility Manager for CDE Desktop
 * Handles keyboard navigation, shortcuts, screen reader support, and high contrast mode
 */
export class AccessibilityManager {
  private shortcuts: KeyboardShortcut[] = [];
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex = -1;
  private highContrastMode = false;
  private announceRegion: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  /**
   * Initialize accessibility features
   */
  public init(): void {
    this.createAnnounceRegion();
    this.registerGlobalShortcuts();
    this.setupKeyboardNavigation();
    this.enhanceARIA();
    this.loadHighContrastPreference();
    this.setupFocusManagement();

    logger.log('[Accessibility] Initialized');
  }

  /**
   * Create ARIA live region for screen reader announcements
   */
  private createAnnounceRegion(): void {
    this.announceRegion = document.createElement('div');
    this.announceRegion.id = 'cde-announce';
    this.announceRegion.setAttribute('role', 'status');
    this.announceRegion.setAttribute('aria-live', 'polite');
    this.announceRegion.setAttribute('aria-atomic', 'true');
    this.announceRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.announceRegion);
  }

  /**
   * Announce message to screen readers
   */
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announceRegion) return;

    this.announceRegion.setAttribute('aria-live', priority);
    this.announceRegion.textContent = message;

    logger.log(`[Accessibility] Announced: ${message}`);
  }

  /**
   * Register a keyboard shortcut
   */
  public registerShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.push(shortcut);
    logger.log(`[Accessibility] Registered shortcut: ${this.formatShortcut(shortcut)}`);
  }

  /**
   * Format shortcut for display
   */
  private formatShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.meta) parts.push('Meta');
    parts.push(shortcut.key.toUpperCase());
    return parts.join('+');
  }

  /**
   * Register global keyboard shortcuts
   */
  private registerGlobalShortcuts(): void {
    // Terminal
    this.registerShortcut({
      key: 't',
      ctrl: true,
      alt: true,
      action: () => {
        if (window.openTerminal) {
          window.openTerminal();
          this.announce('Terminal opened');
        }
      },
      description: 'Open Terminal',
      category: 'Applications',
    });

    // File Manager
    this.registerShortcut({
      key: 'f',
      ctrl: true,
      alt: true,
      action: () => {
        if ((window as any).toggleFileManager) {
          (window as any).toggleFileManager();
          this.announce('File Manager toggled');
        }
      },
      description: 'Toggle File Manager',
      category: 'Applications',
    });

    // XEmacs
    this.registerShortcut({
      key: 'e',
      ctrl: true,
      alt: true,
      action: () => {
        if (window.Emacs) {
          window.Emacs.openSplash();
          this.announce('XEmacs opened');
        }
      },
      description: 'Open XEmacs',
      category: 'Applications',
    });

    // Netscape
    this.registerShortcut({
      key: 'n',
      ctrl: true,
      alt: true,
      action: () => {
        if ((window as any).Netscape) {
          (window as any).Netscape.open();
          this.announce('Netscape Navigator opened');
        }
      },
      description: 'Open Netscape Navigator',
      category: 'Applications',
    });

    // Style Manager
    this.registerShortcut({
      key: 's',
      ctrl: true,
      alt: true,
      action: () => {
        if ((window as any).styleManager) {
          (window as any).styleManager.openMain();
          this.announce('Style Manager opened');
        }
      },
      description: 'Open Style Manager',
      category: 'System',
    });

    // High Contrast Toggle
    this.registerShortcut({
      key: 'h',
      ctrl: true,
      alt: true,
      action: () => {
        this.toggleHighContrast();
      },
      description: 'Toggle High Contrast Mode',
      category: 'Accessibility',
    });

    // Help / Shortcuts
    this.registerShortcut({
      key: '?',
      ctrl: true,
      shift: true,
      action: () => {
        this.showShortcutsHelp();
      },
      description: 'Show Keyboard Shortcuts',
      category: 'Help',
    });

    // Close active window
    this.registerShortcut({
      key: 'w',
      ctrl: true,
      action: () => {
        this.closeActiveWindow();
      },
      description: 'Close Active Window',
      category: 'Window Management',
    });

    // Minimize active window
    this.registerShortcut({
      key: 'm',
      ctrl: true,
      action: () => {
        this.minimizeActiveWindow();
      },
      description: 'Minimize Active Window',
      category: 'Window Management',
    });

    // Workspace switching
    for (let i = 1; i <= 4; i++) {
      this.registerShortcut({
        key: String(i),
        ctrl: true,
        alt: true,
        action: () => {
          WindowManager.switchWorkspace(String(i));
          this.announce(`Switched to workspace ${i}`);
        },
        description: `Switch to Workspace ${i}`,
        category: 'Workspaces',
      });
    }

    // Listen for keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Handle keyboard shortcuts
   */
  private handleKeyDown(e: KeyboardEvent): void {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow Escape to blur inputs
      if (e.key === 'Escape') {
        target.blur();
        this.announce('Input unfocused');
      }
      return;
    }

    // Check for matching shortcut
    for (const shortcut of this.shortcuts) {
      const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
      const altMatch = shortcut.alt ? e.altKey : !e.altKey;
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
      const metaMatch = shortcut.meta ? e.metaKey : !e.metaKey;
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

      if (ctrlMatch && altMatch && shiftMatch && metaMatch && keyMatch) {
        e.preventDefault();
        e.stopPropagation();
        shortcut.action();
        if (AudioManager) AudioManager.click();
        return;
      }
    }
  }

  /**
   * Setup keyboard navigation with Tab
   */
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        this.updateFocusableElements();

        if (this.focusableElements.length === 0) return;

        if (e.shiftKey) {
          // Shift+Tab: previous element
          this.currentFocusIndex--;
          if (this.currentFocusIndex < 0) {
            this.currentFocusIndex = this.focusableElements.length - 1;
          }
        } else {
          // Tab: next element
          this.currentFocusIndex++;
          if (this.currentFocusIndex >= this.focusableElements.length) {
            this.currentFocusIndex = 0;
          }
        }

        const element = this.focusableElements[this.currentFocusIndex];
        if (element) {
          e.preventDefault();
          element.focus();

          // Announce focused element
          const label = this.getElementLabel(element);
          if (label) {
            this.announce(`Focused: ${label}`);
          }
        }
      }

      // Enter to activate focused element
      if (e.key === 'Enter') {
        const focused = document.activeElement as HTMLElement;
        if (focused && focused.classList.contains('cde-icon')) {
          e.preventDefault();
          focused.click();
        }
      }
    });
  }

  /**
   * Update list of focusable elements
   */
  private updateFocusableElements(): void {
    const selector = `
      .cde-icon,
      .menu-item,
      .cde-btn,
      .titlebar-btn,
      button:not([disabled]),
      input:not([disabled]),
      textarea:not([disabled]),
      select:not([disabled]),
      a[href],
      [tabindex]:not([tabindex="-1"])
    `;

    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

    // Filter visible elements only
    this.focusableElements = elements.filter((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        el.offsetParent !== null
      );
    });
  }

  /**
   * Get accessible label for element
   */
  private getElementLabel(element: HTMLElement): string {
    return (
      element.getAttribute('aria-label') ||
      element.getAttribute('title') ||
      element.getAttribute('alt') ||
      element.textContent?.trim() ||
      element.tagName
    );
  }

  /**
   * Enhance ARIA attributes for existing elements
   */
  private enhanceARIA(): void {
    // Desktop icons
    document.querySelectorAll('.cde-icon').forEach((icon) => {
      const img = icon.querySelector('img');
      const title = icon.getAttribute('title') || img?.getAttribute('alt') || 'Icon';

      icon.setAttribute('role', 'button');
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('aria-label', title);
    });

    // Windows
    document.querySelectorAll('.window').forEach((win) => {
      win.setAttribute('role', 'dialog');
      win.setAttribute('aria-modal', 'false');

      const titlebar = win.querySelector('.titlebar-text');
      if (titlebar) {
        const title = titlebar.textContent || 'Window';
        win.setAttribute('aria-label', title);
      }
    });

    // Buttons
    document.querySelectorAll('.cde-btn, .titlebar-btn').forEach((btn) => {
      if (!btn.getAttribute('role')) {
        btn.setAttribute('role', 'button');
      }
      if (!btn.getAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
      }
    });

    // Menu items
    document.querySelectorAll('.menu-item').forEach((item) => {
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', '0');
    });

    // Workspace pager
    document.querySelectorAll('.pager-workspace').forEach((ws) => {
      ws.setAttribute('role', 'button');
      ws.setAttribute('tabindex', '0');
      const num = ws.getAttribute('data-workspace');
      ws.setAttribute('aria-label', `Workspace ${num}`);
    });

    logger.log('[Accessibility] ARIA attributes enhanced');
  }

  /**
   * Toggle high contrast mode
   */
  public toggleHighContrast(): void {
    this.highContrastMode = !this.highContrastMode;

    if (this.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
      this.announce('High contrast mode enabled');
      localStorage.setItem('cde_high_contrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      this.announce('High contrast mode disabled');
      localStorage.setItem('cde_high_contrast', 'false');
    }

    logger.log(`[Accessibility] High contrast: ${this.highContrastMode}`);
  }

  /**
   * Load high contrast preference
   */
  private loadHighContrastPreference(): void {
    const saved = localStorage.getItem('cde_high_contrast');
    if (saved === 'true') {
      this.highContrastMode = true;
      document.documentElement.classList.add('high-contrast');
    }
  }

  /**
   * Show keyboard shortcuts help dialog
   */
  private showShortcutsHelp(): void {
    const categories = this.groupShortcutsByCategory();

    let html = '<div class="shortcuts-help">';
    html += '<h2>Keyboard Shortcuts</h2>';

    for (const [category, shortcuts] of Object.entries(categories)) {
      html += `<h3>${category}</h3>`;
      html += '<table>';

      for (const shortcut of shortcuts) {
        const keys = this.formatShortcut(shortcut);
        html += `<tr><td><kbd>${keys}</kbd></td><td>${shortcut.description}</td></tr>`;
      }

      html += '</table>';
    }

    html += '</div>';

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'cde-retro-modal';
    modal.id = 'shortcuts-help-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'shortcuts-title');
    modal.innerHTML = `
      <div class="titlebar">
        <span class="titlebar-text" id="shortcuts-title">Keyboard Shortcuts</span>
        <div class="titlebar-controls">
          <button class="close-btn" onclick="document.getElementById('shortcuts-help-modal').remove()" aria-label="Close">
            <img src="/icons/window-close.png" alt="Close" />
          </button>
        </div>
      </div>
      <div class="modal-body" style="padding: 20px; max-height: 500px; overflow-y: auto;">
        ${html}
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Register and center on next frame to ensure proper dimensions
    requestAnimationFrame(() => {
      WindowManager.registerWindow(modal);
      WindowManager.centerWindow(modal);
      if (window.focusWindow) window.focusWindow('shortcuts-help-modal');
    });

    this.announce('Keyboard shortcuts help opened');
  }

  /**
   * Group shortcuts by category
   */
  private groupShortcutsByCategory(): Record<string, KeyboardShortcut[]> {
    const groups: Record<string, KeyboardShortcut[]> = {};

    for (const shortcut of this.shortcuts) {
      if (!groups[shortcut.category]) {
        groups[shortcut.category] = [];
      }
      groups[shortcut.category].push(shortcut);
    }

    return groups;
  }

  /**
   * Close the currently active window
   */
  private closeActiveWindow(): void {
    const activeWindow = document.querySelector('.window.active, .cde-retro-modal.active') as HTMLElement;
    if (activeWindow) {
      const closeBtn = activeWindow.querySelector('.close-btn') as HTMLElement;
      if (closeBtn) {
        closeBtn.click();
        this.announce('Window closed');
      }
    }
  }

  /**
   * Minimize the currently active window
   */
  private minimizeActiveWindow(): void {
    const activeWindow = document.querySelector('.window.active') as HTMLElement;
    if (activeWindow && activeWindow.id) {
      if (window.minimizeWindow) {
        window.minimizeWindow(activeWindow.id);
        this.announce('Window minimized');
      }
    }
  }

  /**
   * Setup focus management for windows
   */
  private setupFocusManagement(): void {
    // Announce when windows are focused
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('active') && target.classList.contains('window')) {
            const title = target.querySelector('.titlebar-text')?.textContent || 'Window';
            this.announce(`${title} focused`);
          }
        }
      });
    });

    // Observe all windows
    document.querySelectorAll('.window, .cde-retro-modal').forEach((win) => {
      observer.observe(win, { attributes: true });
    });
  }

  /**
   * Get all registered shortcuts
   */
  public getShortcuts(): KeyboardShortcut[] {
    return this.shortcuts;
  }

  /**
   * Check if high contrast mode is enabled
   */
  public isHighContrastEnabled(): boolean {
    return this.highContrastMode;
  }
}

// Global instance
let accessibilityManager: AccessibilityManager | null = null;

if (typeof window !== 'undefined') {
  accessibilityManager = new AccessibilityManager();
  (window as any).AccessibilityManager = accessibilityManager;
}

export default accessibilityManager;
