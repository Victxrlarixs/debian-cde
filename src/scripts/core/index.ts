// src/scripts/core/index.ts

import './config';
import './accessibility';
import '../boot/init';
// Features are now loaded dynamically via module-loader.ts
// Static imports removed to enable proper code splitting
import { initPWAInstaller } from '../utilities/pwa-installer';
import '../utilities/share-config';
import '../utilities/share-theme-ui';

// Start backdrop preload IMMEDIATELY (before boot sequence)
import { startBackdropPreload } from '../boot/backdrop-preloader';
if (typeof window !== 'undefined') {
  startBackdropPreload();
}

// Initialize PWA installer
if (typeof window !== 'undefined') {
  initPWAInstaller();
}
/*
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed', error);
      });
    });
  }

  let deferredInstallPrompt: any = null;

  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault();
    deferredInstallPrompt = event as any;

    window.dispatchEvent(new CustomEvent('cde-pwa-install-available'));
  });

  (window as any).installCDEAsApp = async () => {
    if (!deferredInstallPrompt) {
      window.alert(
        'Installation is not available yet. Make sure you open this site from a compatible browser and that it is not already installed.'
      );
      return;
    }

    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;

    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch (error) {
      console.error('PWA installation prompt failed', error);
    }
  };
}
*/
