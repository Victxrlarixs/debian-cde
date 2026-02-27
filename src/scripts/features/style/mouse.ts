// src/scripts/features/style/mouse.ts

import { logger } from '../../utilities/logger';
import { StyleModuleBase } from '../../shared/style-module-base';
import { renderXpmToCanvas } from '../../shared/xpm-renderer';

export interface MouseSettings {
  handedness: string;
  button2: string;
  doubleClick: number;
  acceleration: number;
  threshold: number;
}

export class MouseModule extends StyleModuleBase<MouseSettings> {
  constructor() {
    super({
      name: 'MouseModule',
      settingsKey: 'mouse',
      panelId: 'styleManagerMouse',
      defaultSettings: {
        handedness: 'right',
        button2: 'transfer',
        doubleClick: 0.5,
        acceleration: 2,
        threshold: 4,
      },
    });
  }

  public apply(): void {
    logger.log('[MouseModule] Applied settings:', this.settings);
    // Expose acceleration as a CSS variable for other modules to use
    document.documentElement.style.setProperty(
      '--mouse-acceleration',
      String(this.settings.acceleration)
    );
  }

  /**
   * Render the mouse icon XPM to canvas
   */
  public async renderMouseIcon(): Promise<void> {
    await renderXpmToCanvas({
      canvasId: 'mouse-icon-canvas',
      xpmPath: '/icons/Mouse-Setup-Clicked.xpm',
      logSuccess: true,
    });
  }

  protected syncUIImpl(panel: HTMLElement): void {
    // Render mouse icon with current palette
    this.renderMouseIcon();

    // Render mouse icon with current palette
    this.renderMouseIcon();

    // Handedness
    this.syncRadio(panel, 'handedness', this.settings.handedness);

    // Button2
    this.syncRadio(panel, 'button2', this.settings.button2);

    // Sliders - using custom selector for mouse module
    const sliders = [
      { key: 'doubleClick', index: 1 },
      { key: 'acceleration', index: 2 },
      { key: 'threshold', index: 3 },
    ];

    sliders.forEach(({ key, index }) => {
      const slider = panel.querySelector(
        `.mouse-slider-row:nth-child(${index}) input`
      ) as HTMLInputElement;
      const span = panel.querySelector(`.mouse-slider-row:nth-child(${index}) span:last-child`);
      if (slider && span) {
        slider.value = String(this.settings[key as keyof MouseSettings]);
        span.textContent = String(this.settings[key as keyof MouseSettings]);
      }
    });
  }
}
