import { CONFIG } from '../core/config';

// ============================================================================
// Mouse Settings - Functionality for the Mouse panel
// ============================================================================

// Mouse configuration object
const mouseSettings = {
  handedness: 'right',
  button2: 'transfer',
  doubleClick: 0.5,
  acceleration: 2,
  threshold: 4,
};

/**
 * Loads mouse settings from localStorage.
 */
export function loadMouseSettings(): void {
  // ← EXPORT
  try {
    const saved = localStorage.getItem('cde-mouse-settings');
    if (saved) {
      Object.assign(mouseSettings, JSON.parse(saved));
      console.log('[MouseSettings] Loaded from localStorage:', mouseSettings);
    } else {
      console.log('[MouseSettings] No saved settings found, using defaults.');
    }
  } catch (e) {
    console.warn('[MouseSettings] Failed to load from localStorage:', e);
  }
}

/**
 * Saves mouse settings to localStorage.
 */
export function saveMouseSettings(): void {
  // ← EXPORT
  localStorage.setItem('cde-mouse-settings', JSON.stringify(mouseSettings));
  console.log('[MouseSettings] Saved to localStorage:', mouseSettings);
}

/**
 * Applies mouse settings.
 */
export function applyMouseSettings(): void {
  // ← EXPORT
  console.log('[MouseSettings] Applied:', mouseSettings);
  saveMouseSettings();
}

/**
 * Updates a single mouse setting and triggers apply.
 * @param key - The setting key
 * @param value - The new value
 */
export function updateMouseSetting(key: string, value: any): void {
  // ← EXPORT
  if (key in mouseSettings) {
    (mouseSettings as any)[key] = value;
    applyMouseSettings();
    console.log(`[MouseSettings] "${key}" updated to ${value}`);
  } else {
    console.warn(`[MouseSettings] Unknown key: "${key}"`);
  }
}

/**
 * Synchronizes the mouse panel controls with the current settings.
 */
export function syncMouseControls(): void {
  // ← EXPORT
  const panel = document.getElementById('styleManagerMouse');
  if (!panel) {
    console.warn('[MouseSettings] Panel not found');
    return;
  }

  // Handedness radios
  const handednessRight = panel.querySelector(
    'input[name="handedness"][value="right"]'
  ) as HTMLInputElement;
  const handednessLeft = panel.querySelector(
    'input[name="handedness"][value="left"]'
  ) as HTMLInputElement;
  if (handednessRight && handednessLeft) {
    handednessRight.checked = mouseSettings.handedness === 'right';
    handednessLeft.checked = mouseSettings.handedness === 'left';
  }

  // Button2 radios
  const button2Transfer = panel.querySelector(
    'input[name="button2"][value="transfer"]'
  ) as HTMLInputElement;
  const button2Adjust = panel.querySelector(
    'input[name="button2"][value="adjust"]'
  ) as HTMLInputElement;
  if (button2Transfer && button2Adjust) {
    button2Transfer.checked = mouseSettings.button2 === 'transfer';
    button2Adjust.checked = mouseSettings.button2 === 'adjust';
  }

  // Sliders
  const doubleClickSlider = panel.querySelector(
    '.mouse-slider-row:nth-child(1) input'
  ) as HTMLInputElement;
  const doubleClickSpan = panel.querySelector('.mouse-slider-row:nth-child(1) span:last-child');
  if (doubleClickSlider && doubleClickSpan) {
    doubleClickSlider.value = String(mouseSettings.doubleClick);
    doubleClickSpan.textContent = String(mouseSettings.doubleClick);
  }

  const accelSlider = panel.querySelector(
    '.mouse-slider-row:nth-child(2) input'
  ) as HTMLInputElement;
  const accelSpan = panel.querySelector('.mouse-slider-row:nth-child(2) span:last-child');
  if (accelSlider && accelSpan) {
    accelSlider.value = String(mouseSettings.acceleration);
    accelSpan.textContent = String(mouseSettings.acceleration);
  }

  const thresholdSlider = panel.querySelector(
    '.mouse-slider-row:nth-child(3) input'
  ) as HTMLInputElement;
  const thresholdSpan = panel.querySelector('.mouse-slider-row:nth-child(3) span:last-child');
  if (thresholdSlider && thresholdSpan) {
    thresholdSlider.value = String(mouseSettings.threshold);
    thresholdSpan.textContent = String(mouseSettings.threshold);
  }

  console.log('[MouseSettings] Controls synchronized');
}

// ============================================================================
// Global exposure (compatibility with existing HTML)
// ============================================================================

declare global {
  interface Window {
    updateMouseSetting: typeof updateMouseSetting;
    syncMouseControls: typeof syncMouseControls;
  }
}

// Assign to window
window.updateMouseSetting = updateMouseSetting;
window.syncMouseControls = syncMouseControls;

// Initialize
loadMouseSettings();

console.log('[MouseSettings] Module loaded');

export { mouseSettings };
