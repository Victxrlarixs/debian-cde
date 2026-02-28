// src/scripts/features/timemanager.ts
import { logger } from '../utilities/logger';

export class TimeManager {
  private id = 'timeManager';

  constructor() {
    this.init();
  }

  private init(): void {
    logger.log('[TimeManager] Initializing UI module...');
  }

  public open(): void {
    const win = document.getElementById(this.id);
    if (win) {
      win.style.display = 'flex';
      win.style.zIndex = '10000';

      if (window.centerWindow) {
        window.centerWindow(win);
      }

      if (window.focusWindow) {
        window.focusWindow(this.id);
      }

      if (window.AudioManager) {
        window.AudioManager.windowOpen();
      }

      logger.log('[TimeManager] Window opened');
    }
  }

  public close(): void {
    const win = document.getElementById(this.id);
    if (win) {
      win.style.display = 'none';

      if (window.AudioManager) {
        window.AudioManager.windowClose();
      }

      logger.log('[TimeManager] Window closed');
    }
  }

  public updateFormat(): void {
    const is24h = (document.getElementById('tm-24h') as HTMLInputElement)?.checked ?? true;
    const showSeconds =
      (document.getElementById('tm-seconds') as HTMLInputElement)?.checked ?? true;

    if ((window as any).updateClockFormat) {
      (window as any).updateClockFormat({ is24h, showSeconds });
    }
  }
}

// Global exposure
if (typeof window !== 'undefined') {
  window.timeManager = new TimeManager();
}
