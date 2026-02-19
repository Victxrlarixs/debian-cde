// src/scripts/init.ts

import { CONFIG } from '../core/config';
import { initClock } from '../utilities/clock';
import { WindowManager } from '../core/windowmanager';
import type { StyleManager } from '../features/stylemanager';
import { retroBeep } from '../utilities/beep';
import { captureFullPageScreenshot } from '../utilities/screenshot';
import { TopMonitor } from '../features/processmonitor'; 
import { mouseSettings } from '../preferences/mouse';
/**
 * Global interface declarations for CDE desktop environment.
 */
declare global {
  interface Window {
    debianBoot: DebianRealBoot;
    initDesktop: () => void;
    DebianRealBoot: typeof DebianRealBoot;
    initClock?: () => void; // Kept for backward compatibility
    initWindowManager?: () => void;
    styleManager?: StyleManager;
  }
}

let desktopInitialized = false;

/**
 * Simulates a Debian system boot with CDE.
 * Displays the Debian logo first, then kernel-style messages
 * in #boot-log-container, and finally reveals the desktop (#desktop-ui).
 */
class DebianRealBoot {
  private currentStep: number = 0;
  private logo: string;
  private bootSequence: Array<{ delay: number; text: string; type: string }>;
  private bootLog: string[] = [];
  private container: HTMLElement | null;
  private bootScreen: HTMLElement | null;

  constructor() {
    this.logo = CONFIG.BOOT.LOGO;
    this.bootSequence = CONFIG.BOOT.SEQUENCE;
    this.container = document.getElementById('boot-log-container');
    this.bootScreen = document.getElementById('debian-boot-screen');

    if (!this.container) {
      console.error('[DebianRealBoot] Boot container #boot-log-container not found');
    }
    if (!this.bootScreen) {
      console.warn('[DebianRealBoot] Boot screen element #debian-boot-screen not found');
    }
  }

  /**
   * Inserts the Debian ASCII logo at the beginning of the container.
   * @private
   */
  private insertLogo(): void {
    if (!this.container) return;

    const logoDiv = document.createElement('div');
    logoDiv.className = 'boot-logo';
    logoDiv.style.whiteSpace = 'pre';
    logoDiv.style.fontFamily = 'monospace';
    logoDiv.style.color = '#00AA00';
    logoDiv.style.marginBottom = '20px';
    logoDiv.style.lineHeight = '1.2';
    logoDiv.textContent = this.logo;

    this.container.appendChild(logoDiv);
    this.bootLog.push('[LOGO] Debian ASCII art');
    console.log('[DebianRealBoot] Logo inserted');
  }

  /**
   * Starts the boot sequence.
   */
  public start(): void {
    this.currentStep = 0;
    this.bootLog = [];

    if (!this.container) {
      console.error('[DebianRealBoot] Cannot start boot sequence: container missing');
      this.completeBoot();
      return;
    }

    this.container.innerHTML = '';
    this.insertLogo();
    console.log('[DebianRealBoot] Boot sequence started');
    this.startBootSequence();
  }

  /**
   * Recursively plays each line of the boot sequence.
   * @private
   */
  private startBootSequence(): void {
    const showNextStep = () => {
      if (this.currentStep >= this.bootSequence.length) {
        console.log('[DebianRealBoot] Boot sequence completed, waiting for final delay');
        setTimeout(() => this.completeBoot(), CONFIG.BOOT.FINAL_DELAY);
        return;
      }

      const step = this.bootSequence[this.currentStep];
      const line = document.createElement('div');
      line.className = this.getLineClass(step.type);
      line.style.cssText = `
        opacity: 0;
        animation: bootLineAppear 0.1s forwards;
        white-space: pre-wrap;
      `;
      line.textContent = step.text;

      this.container!.appendChild(line);
      this.container!.scrollTop = this.container!.scrollHeight;
      this.bootLog.push(step.text);

      console.log(
        `[DebianRealBoot] Step ${this.currentStep + 1}/${this.bootSequence.length}: ${step.type} - ${step.text.substring(0, 50)}${step.text.length > 50 ? '...' : ''}`
      );

      this.currentStep++;
      setTimeout(showNextStep, step.delay);
    };
    showNextStep();
  }

  /**
   * Returns the CSS class name based on message type.
   * @param type - Message type
   * @returns CSS class name
   * @private
   */
  private getLineClass(type: string): string {
    const map: Record<string, string> = {
      kernel: 'boot-kernel',
      cpu: 'boot-cpu',
      memory: 'boot-memory',
      fs: 'boot-fs',
      systemd: 'boot-systemd',
      service: 'boot-service',
      drm: 'boot-drm',
      desktop: 'boot-desktop',
    };
    return map[type] || 'boot-default';
  }

  /**
   * Finalizes the boot process.
   * @private
   */
  private completeBoot(): void {
    console.log('[DebianRealBoot] Completing boot process');

    if (this.bootScreen) {
      this.bootScreen.style.transition = 'opacity 0.5s ease-out';
      this.bootScreen.style.opacity = '0';

      setTimeout(() => {
        this.bootScreen!.style.display = 'none';
        const desktop = document.getElementById('desktop-ui');
        if (desktop) {
          desktop.style.display = 'block';
          console.log('[DebianRealBoot] Desktop UI revealed');
        } else {
          console.warn('[DebianRealBoot] Desktop UI element not found');
        }
        initDesktop();
      }, 500);
    } else {
      initDesktop();
    }
  }
}

/**
 * Initializes all CDE desktop modules.
 */
function initDesktop(): void {
  if (desktopInitialized) {
    console.log('[initDesktop] Desktop already initialized, skipping');
    return;
  }
  console.log('[initDesktop] Initializing desktop modules...');
  if (typeof window.retroBeep === 'function') {
    console.log('[Init] Beep utility available');
  }
  if (typeof window.captureFullPageScreenshot === 'function') {
    console.log('[Init] Screenshot utility available');
  }
  if (TopMonitor) {
    console.log('[Init] TopMonitor module loaded');
    console.log('[Init]   - Mouse acceleration:', mouseSettings.acceleration);
    if (typeof TopMonitor.open === 'function' && typeof TopMonitor.close === 'function') {
      console.log('[Init]   - TopMonitor API ready (open/close)');
    }
  }

  try {
    initClock();
    console.log('[initDesktop] Clock initialized');

    WindowManager.init();
    console.log('[initDesktop] Window manager initialized');

    if (typeof window.initWindowManager === 'function') {
      window.initWindowManager();
      console.log('[initDesktop] Window manager initialized');
    }

    if (window.styleManager) {
      window.styleManager.init();
      console.log('[initDesktop] Style manager initialized');
    } else {
      console.warn('[initDesktop] Style manager not available');
    }

    desktopInitialized = true;
    console.log('[initDesktop] Desktop initialization completed successfully');
  } catch (error) {
    console.error('[initDesktop] Error during desktop initialization:', error);
  }
}

// ---------------------------------------------------------------------
// Automatic boot start
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Boot] DOM Content Loaded, starting boot sequence');

  try {
    window.debianBoot = new DebianRealBoot();
    window.debianBoot.start();
    console.log('[Boot] Boot sequence initiated');
  } catch (error) {
    console.error('[Boot] Failed to start boot sequence:', error);
    // Fallback: try to initialize desktop directly
    const desktop = document.getElementById('desktop-ui');
    if (desktop) desktop.style.display = 'block';
    initDesktop();
  }
});

// Global exposure
window.initDesktop = initDesktop;
window.DebianRealBoot = DebianRealBoot;
