// src/scripts/init.ts

import { CONFIG } from './config';
import type { StyleManager } from './stylemanager';

declare global {
  interface Window {
    debianBoot: DebianRealBoot;
    initDesktop: () => void;
    DebianRealBoot: typeof DebianRealBoot;
    initClock?: () => void;
    initWindowManager?: () => void;
    styleManager?: StyleManager;
  }
}

let desktopInitialized = false;

/**
 * Simula el arranque de un sistema Debian con CDE.
 * Muestra primero el logo de Debian, luego mensajes estilo kernel
 * en #boot-log-container y finaliza revelando el escritorio (#desktop-ui).
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
  }

  /**
   * Inserta el logo de Debian al inicio del contenedor.
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
  }

  /**
   * Inicia la secuencia de arranque.
   */
  public start(): void {
    this.currentStep = 0;
    this.bootLog = [];

    if (!this.container) {
      console.error('Error: No se encontró el contenedor #boot-log-container');
      this.completeBoot();
      return;
    }

    this.container.innerHTML = '';
    this.insertLogo();
    this.startBootSequence();
  }

  /**
   * Reproduce recursivamente cada línea de la secuencia.
   * @private
   */
  private startBootSequence(): void {
    const showNextStep = () => {
      if (this.currentStep >= this.bootSequence.length) {
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
      this.currentStep++;

      setTimeout(showNextStep, step.delay);
    };
    showNextStep();
  }

  /**
   * Devuelve el nombre de clase CSS según el tipo de mensaje.
   * @param type - Tipo de mensaje
   * @returns Nombre de clase CSS
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
   * Finaliza el boot.
   */
  private completeBoot(): void {
    if (this.bootScreen) {
      this.bootScreen.style.transition = 'opacity 0.5s ease-out';
      this.bootScreen.style.opacity = '0';

      setTimeout(() => {
        this.bootScreen!.style.display = 'none';
        const desktop = document.getElementById('desktop-ui');
        if (desktop) desktop.style.display = 'block';
        initDesktop();
      }, 500);
    } else {
      initDesktop();
    }
  }
}

/**
 * Inicializa todos los módulos del escritorio CDE.
 */
function initDesktop(): void {
  if (desktopInitialized) return;

  console.log('Initializing CDE Desktop Environment...');

  if (typeof window.initClock === 'function') window.initClock();
  // if (typeof initTerminal === 'function') initTerminal();
  if (typeof window.initWindowManager === 'function') window.initWindowManager();
  window.styleManager?.init();
  desktopInitialized = true;
  console.log('CDE Desktop initialized successfully.');
}

// ---------------------------------------------------------------------
// Arranque automático
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  window.debianBoot = new DebianRealBoot();
  window.debianBoot.start();
});

// Exponer globalmente
window.initDesktop = initDesktop;
window.DebianRealBoot = DebianRealBoot;

console.log('init.ts loaded (Debian boot sequence)');