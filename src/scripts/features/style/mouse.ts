// src/scripts/features/style/mouse.ts

import { logger } from '../../utilities/logger';
import { settingsManager } from '../../core/settingsmanager';
import { parseXpmToDataUrl } from '../../core/xpmparser';

export interface MouseSettings {
  handedness: string;
  button2: string;
  doubleClick: number;
  acceleration: number;
  threshold: number;
}

export class MouseModule {
  public settings: MouseSettings = {
    handedness: 'right',
    button2: 'transfer',
    doubleClick: 0.5,
    acceleration: 2,
    threshold: 4,
  };

  public load(): void {
    const saved = settingsManager.getSection('mouse');
    if (Object.keys(saved).length > 0) {
      Object.assign(this.settings, saved);
      logger.log('[MouseModule] Loaded from SettingsManager:', this.settings);
    }
  }

  public save(): void {
    settingsManager.setSection('mouse', this.settings);
    logger.log('[MouseModule] Saved to SettingsManager:', this.settings);
  }

  public apply(): void {
    logger.log('[MouseModule] Applied settings:', this.settings);
    // Expose acceleration as a CSS variable for other modules to use
    document.documentElement.style.setProperty(
      '--mouse-acceleration',
      String(this.settings.acceleration)
    );
  }

  public update(key: string, value: any): void {
    if (key in this.settings) {
      (this.settings as any)[key] = value;
      this.apply();
      this.save();
      logger.log(`[MouseModule] "${key}" updated to ${value}`);
    } else {
      console.warn(`[MouseModule] Unknown key: "${key}"`);
    }
  }

  /**
   * Render the mouse icon XPM to canvas
   */
  public async renderMouseIcon(): Promise<void> {
    const canvas = document.getElementById('mouse-icon-canvas') as HTMLCanvasElement;
    if (!canvas) {
      logger.log('[MouseModule] Canvas not found, skipping icon render');
      return;
    }

    try {
      const response = await fetch('/icons/Mouse-Setup-Clicked.xpm');
      const xpmText = await response.text();
      const dataUrl = await parseXpmToDataUrl(xpmText);

      if (dataUrl) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            logger.log('[MouseModule] Mouse icon rendered successfully');
          }
        };
        img.src = dataUrl;
      }
    } catch (error) {
      logger.error('[MouseModule] Failed to render mouse icon:', error);
    }
  }

  public syncUI(): void {
    const panel = document.getElementById('styleManagerMouse');
    if (!panel) return;

    // Render mouse icon with current palette
    this.renderMouseIcon();

    // Handedness
    const handednessRight = panel.querySelector(
      'input[name="handedness"][value="right"]'
    ) as HTMLInputElement;
    const handednessLeft = panel.querySelector(
      'input[name="handedness"][value="left"]'
    ) as HTMLInputElement;
    if (handednessRight && handednessLeft) {
      handednessRight.checked = this.settings.handedness === 'right';
      handednessLeft.checked = this.settings.handedness === 'left';
    }

    // Button2
    const button2Transfer = panel.querySelector(
      'input[name="button2"][value="transfer"]'
    ) as HTMLInputElement;
    const button2Adjust = panel.querySelector(
      'input[name="button2"][value="adjust"]'
    ) as HTMLInputElement;
    if (button2Transfer && button2Adjust) {
      button2Transfer.checked = this.settings.button2 === 'transfer';
      button2Adjust.checked = this.settings.button2 === 'adjust';
    }

    // Sliders
    this.syncSlider(panel, 1, this.settings.doubleClick);
    this.syncSlider(panel, 2, this.settings.acceleration);
    this.syncSlider(panel, 3, this.settings.threshold);

    logger.log('[MouseModule] UI synchronized');
  }

  private syncSlider(panel: HTMLElement, index: number, value: number): void {
    const slider = panel.querySelector(
      `.mouse-slider-row:nth-child(${index}) input`
    ) as HTMLInputElement;
    const span = panel.querySelector(`.mouse-slider-row:nth-child(${index}) span:last-child`);
    if (slider && span) {
      slider.value = String(value);
      span.textContent = String(value);
    }
  }
}
