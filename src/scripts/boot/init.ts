// src/scripts/init.ts

import { CONFIG } from '../core/config';
import { initClock } from '../utilities/clock';
import { WindowManager } from '../core/windowmanager';
import type { StyleManager } from '../features/stylemanager';

import { captureFullPageScreenshot } from '../utilities/screenshot';
import '../ui/external-links';
import { ProcessMonitor } from '../features/processmonitor';
import { logger } from '../utilities/logger';
import { DesktopManager } from '../features/desktop';
import { CalendarManager } from '../features/calendar';
import { VFS } from '../core/vfs';
import { Preloader } from '../utilities/preloader';
/**
 * Global interface declarations for CDE desktop environment.
 */
import bootMessagesData from '../../data/boot-messages.json';

/**
 * Global interface declarations for CDE desktop environment.
 */
declare global {
  interface Window {
    debianBoot: DebianRealBoot;
    initDesktop: () => void;
    DebianRealBoot: typeof DebianRealBoot;
    initClock?: () => void; // Kept for backward compatibility
    styleManager?: StyleManager;
  }
}

let desktopInitialized = false;

/**
 * Simulates a Debian system boot with CDE.
 */
class DebianRealBoot {
  private currentStep: number = 0;
  private logo: string;
  private bootSequence: Array<{ delay: number; text: string; type: string }> = [];
  private bootLog: string[] = [];
  private container: HTMLElement | null;
  private bootScreen: HTMLElement | null;
  private progressBar: HTMLElement | null;

  constructor() {
    this.logo = CONFIG.BOOT.LOGO;
    this.container = document.getElementById('boot-log-container');
    this.bootScreen = document.getElementById('debian-boot-screen');
    this.progressBar = document.getElementById('boot-progress-bar');

    this.generateDynamicSequence();

    if (!this.container) {
      console.error('[DebianRealBoot] Boot container #boot-log-container not found');
    }
  }

  /**
   * Generates a randomized boot sequence based on phases.
   */
  private generateDynamicSequence(): void {
    const phases = bootMessagesData.phases;
    let totalTime = 0;

    phases.forEach((phase) => {
      // Pick random number of messages between min and max
      const count = Math.floor(Math.random() * (phase.max - phase.min + 1)) + phase.min;
      const selected = this.getRandomSubset(phase.messages, count);

      selected.forEach((msg) => {
        // Increment global boot time (seconds)
        const increment = Math.random() * 0.3 + 0.05;
        totalTime += increment;

        // Format [  timestamp ] Text
        const timestamp = totalTime.toFixed(6).padStart(12, ' ');
        const text =
          phase.name === 'kernel' ||
          phase.name === 'cpu' ||
          phase.name === 'fs' ||
          phase.name === 'memory'
            ? `[ ${timestamp} ] ${msg.text}`
            : msg.text;

        this.bootSequence.push({
          text,
          type: msg.type,
          delay: Math.floor(Math.random() * 200) + 50, // Varied delay between lines
        });
      });
    });

    // Add final success message
    this.bootSequence.push({
      text: '[    OK    ] CDE Desktop ready ....',
      type: 'desktop',
      delay: 500,
    });
  }

  private getRandomSubset(array: any[], count: number): any[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Inserts the Debian ASCII logo at the beginning of the container.
   */
  private insertLogo(): void {
    if (!this.container) return;

    const logoDiv = document.createElement('div');
    logoDiv.className = 'boot-logo';
    logoDiv.style.whiteSpace = 'pre';
    logoDiv.style.fontFamily = 'monospace';
    logoDiv.style.color = '#ff8888';
    logoDiv.style.marginBottom = '20px';
    logoDiv.style.lineHeight = '1.2';
    logoDiv.textContent = this.logo;

    this.container.appendChild(logoDiv);
    this.bootLog.push('[LOGO] Debian ASCII art');
    logger.log('[DebianRealBoot] Logo inserted');
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
    logger.log('[DebianRealBoot] Boot sequence started');
    this.startBootSequence();
  }

  private updateProgress(): void {
    const total = this.bootSequence.length;
    const pct = Math.round((this.currentStep / total) * 100);
    if (this.progressBar) this.progressBar.style.width = `${pct}%`;
  }

  private startBootSequence(): void {
    this.updateProgress();
    const showNextStep = () => {
      if (this.currentStep >= this.bootSequence.length) {
        if (this.progressBar) this.progressBar.style.width = '100%';
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

      this.currentStep++;
      this.updateProgress();
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
    logger.log('[DebianRealBoot] Completing boot process');

    // 1. Reveal desktop behind the boot screen (it has lower z-index)
    const desktop = document.getElementById('desktop-ui');
    if (desktop) {
      desktop.style.display = 'block';
    }

    // 2. Initialize all desktop modules (including backdrop rendering)
    initDesktop();

    // 3. Wait a small cushion to let the initial backdrop render start
    setTimeout(() => {
      if (this.bootScreen) {
        this.bootScreen.style.transition = 'opacity 0.8s ease-out';
        this.bootScreen.style.opacity = '0';

        setTimeout(() => {
          this.bootScreen!.style.display = 'none';
          logger.log('[DebianRealBoot] Boot screen removed');
        }, 800);
      }
    }, 400); // 400ms is enough for most XPM renders to start seeing content
  }
}

/**
 * Initializes all CDE desktop modules.
 */
function initDesktop(): void {
  if (desktopInitialized) {
    logger.log('[initDesktop] Desktop already initialized, skipping');
    return;
  }
  logger.log('[initDesktop] Initializing desktop modules...');

  if (typeof window.captureFullPageScreenshot === 'function') {
    logger.log('[Init] Screenshot utility available');
  }
  if (ProcessMonitor) {
    logger.log('[Init] ProcessMonitor module loaded');
    if (typeof ProcessMonitor.open === 'function' && typeof ProcessMonitor.close === 'function') {
      logger.log('[Init]   - ProcessMonitor API ready (open/close)');
    }
  }

  try {
    // 0. Preload assets as early as possible
    Preloader.init();

    // 1. Initialize VFS first as it's the core data layer
    VFS.init();
    logger.log('[initDesktop] Virtual Filesystem initialized');

    initClock();
    logger.log('[initDesktop] Clock initialized');

    // Play startup sound
    if (window.AudioManager) {
      window.AudioManager.success();
    }

    // WindowManager owns drag for ALL windows (StyleManager, Terminal, FileManager, TextEditor).
    // initDraggableTitlebars() runs after a 200ms delay to ensure the DOM is fully settled.
    WindowManager.init();
    logger.log('[initDesktop] Window manager initialized');

    // Desktop Icons initialization
    DesktopManager.init();
    logger.log('[initDesktop] Desktop icons initialized');

    // Calendar initialization
    CalendarManager.init();
    logger.log('[initDesktop] Calendar initialized');

    // StyleManager.init() must run AFTER WindowManager so its windows exist when
    // initDraggableTitlebars fires. StyleManager no longer registers its own drag handlers.
    if (window.styleManager) {
      window.styleManager.init();
      logger.log('[initDesktop] Style manager initialized');
    }

    desktopInitialized = true;
    logger.log('[initDesktop] Desktop initialization completed successfully');
  } catch (error) {
    console.error('[initDesktop] Error during desktop initialization:', error);
  }
}

// ---------------------------------------------------------------------
// Automatic boot start
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  logger.log('[Boot] DOM Content Loaded, starting boot sequence');

  try {
    window.debianBoot = new DebianRealBoot();
    window.debianBoot.start();
    logger.log('[Boot] Boot sequence initiated');
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
