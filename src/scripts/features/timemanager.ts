// src/scripts/features/timemanager.ts
import { logger } from '../utilities/logger';

export class TimeManager {
  private id = 'timeManager';
  private updateInterval: any = null;

  constructor() {
    this.init();
  }

  private init(): void {
    logger.log('[TimeManager] Initializing...');
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

      this.startTimeUpdate();

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
      this.stopTimeUpdate();

      if (window.AudioManager) {
        window.AudioManager.windowClose();
      }

      logger.log('[TimeManager] Window closed');
    }
  }

  private startTimeUpdate(): void {
    this.updateUI();
    this.updateInterval = setInterval(() => this.updateUI(), 1000);
  }

  private stopTimeUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private updateUI(): void {
    // Current time display inside window is gone, nothing to update here
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
  const timeManager = new TimeManager();
  (window as any).timeManager = timeManager;
}

export const timeManagerInstance = (window as any).timeManager;
