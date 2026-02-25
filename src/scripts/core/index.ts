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
      navigator.serviceWorker
        .register('/sw.js')
        .catch((error) => {
          console.error('Service worker registration failed', error);
        });
    });
  }

  let deferredInstallPrompt: any = null;

  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault();
    deferredInstallPrompt = event as any;

    const shouldInstall = window.confirm(
      '¿Quieres instalar el escritorio Debian CDE en tu dispositivo?'
    );

    if (!shouldInstall || !deferredInstallPrompt) {
      deferredInstallPrompt = null;
      return;
    }

    deferredInstallPrompt.prompt();

    deferredInstallPrompt.userChoice.finally(() => {
      deferredInstallPrompt = null;
    });
  });
}
