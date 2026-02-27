// src/scripts/features/style/keyboard.ts

import { logger } from '../../utilities/logger';
import { StyleModuleBase } from '../../shared/style-module-base';

export interface KeyboardSettings {
  repeatRate: number;
  delay: number;
  clickVolume: number;
}

export class KeyboardModule extends StyleModuleBase<KeyboardSettings> {
  constructor() {
    super({
      name: 'KeyboardModule',
      settingsKey: 'keyboard',
      panelId: 'styleManagerKeyboard',
      defaultSettings: {
        repeatRate: 10,
        delay: 500,
        clickVolume: 0,
      },
    });
  }

  public apply(): void {
    logger.log('[KeyboardModule] Applied settings:', this.settings);
  }
}
