// src/scripts/core/index.ts

import './config';
import '../boot/init';
import '../features/filemanager';
import '../features/terminal';
import '../features/stylemanager';
import '../features/emacs';
import '../features/lab';
import '../features/appmanager';
import '../features/timemanager';

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
