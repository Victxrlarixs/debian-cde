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
 * Handles keyboard navigation, shortcuts, and high contrast mode
 */
export class AccessibilityManager {
  private shortcuts: KeyboardShortcut[] = [];
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex = -1;
  private highContrastMode = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize accessibility features
   */
  public init(): void {
    this.registerGlobalShortcuts();
    this.setupKeyboardNavigation();
    this.loadHighContrastPreference();

    logger.log('[Accessibility] Initialized');
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
    // File Manager
    this.registerShortcut({
      key: 'f',
      ctrl: true,
      alt: true,
      action: () => {
        if ((window as any).toggleFileManager) {
          (window as any).toggleFileManager();
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
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Allow Escape to blur inputs
      if (e.key === 'Escape') {
        target.blur();
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
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
  }

  /**
   * Toggle high contrast mode
   */
  public toggleHighContrast(): void {
    this.highContrastMode = !this.highContrastMode;

    if (this.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('cde_high_contrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
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
    modal.innerHTML = `
      <div class="titlebar">
        <span class="titlebar-text" id="shortcuts-title">Keyboard Shortcuts</span>
        <div class="titlebar-controls">
          <button class="close-btn" onclick="document.getElementById('shortcuts-help-modal').remove()">
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
    const activeWindow = document.querySelector(
      '.window.active, .cde-retro-modal.active'
    ) as HTMLElement;
    if (activeWindow) {
      const closeBtn = activeWindow.querySelector('.close-btn') as HTMLElement;
      if (closeBtn) {
        closeBtn.click();
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
      }
    }
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
