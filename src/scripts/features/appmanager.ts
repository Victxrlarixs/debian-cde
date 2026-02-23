// src/scripts/features/appmanager.ts
import { logger } from '../utilities/logger';

export class AppManager {
  private id = 'appManager';

  constructor() {
    this.init();
  }

  private init(): void {
    logger.log('[AppManager] Initializing...');

    // Bind the menu button if it exists
    const menuBtn = document.querySelector('.cde-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
      logger.log('[AppManager] Menu button listener attached');
    }
  }

  public open(): void {
    const win = document.getElementById(this.id);
    if (win) {
      win.style.display = 'flex';
      win.style.zIndex = '10000';

      // Use requestAnimationFrame to ensure dimensions are ready for centering,
      // especially on mobile where layout changes might cause overflows.
      requestAnimationFrame(() => {
        if (window.centerWindow) {
          window.centerWindow(win);
        }
        if (window.focusWindow) {
          window.focusWindow(this.id);
        }
      });

      if (window.AudioManager) {
        window.AudioManager.windowOpen();
      }

      logger.log('[AppManager] Window opened');
    }
  }

  public close(): void {
    const win = document.getElementById(this.id);
    if (win) {
      win.style.display = 'none';

      if (window.AudioManager) {
        window.AudioManager.windowClose();
      }

      logger.log('[AppManager] Window closed');
    }
  }
}

// Global exposure
if (typeof window !== 'undefined') {
  const appManager = new AppManager();
  (window as any).appManager = appManager;
}

export const appManagerInstance = (window as any).appManager;
