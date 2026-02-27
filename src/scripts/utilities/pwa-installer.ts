// src/scripts/utilities/pwa-installer.ts
// PWA Installation Handler

let deferredInstallPrompt: any = null;
let isInstallable = false;

export function initPWAInstaller(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Register service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('[PWA] Service worker registered');
      })
      .catch((error) => {
        console.error('[PWA] Service worker registration failed', error);
      });
  });

  // Capture the install prompt event
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault();
    deferredInstallPrompt = event as any;
    isInstallable = true;

    console.log('[PWA] Install prompt available');

    // Show the install icon on desktop
    showInstallIcon();

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('cde-pwa-install-available'));
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredInstallPrompt = null;
    isInstallable = false;
    hideInstallIcon();
  });

  // Check if already installed (standalone mode)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('[PWA] Already running as installed app');
    isInstallable = false;
  }
}

function showInstallIcon(): void {
  const desktop = document.getElementById('desktop-icons-container');
  if (!desktop) return;

  // Check if icon already exists
  if (document.getElementById('pwa-install-icon')) return;

  const icon = document.createElement('div');
  icon.id = 'pwa-install-icon';
  icon.className = 'cde-desktop-icon';
  icon.style.left = '10px';
  icon.style.top = '10px';
  icon.innerHTML = `
    <img src="/icons/floppy.png" alt="Install App" draggable="false" />
    <span>Install App</span>
  `;

  icon.addEventListener('dblclick', installPWA);

  // Insert at the beginning of desktop
  desktop.appendChild(icon);
}

function hideInstallIcon(): void {
  const icon = document.getElementById('pwa-install-icon');
  if (icon) {
    icon.remove();
  }
}

export async function installPWA(): Promise<void> {
  if (!deferredInstallPrompt || !isInstallable) {
    if (window.CDEModal) {
      await window.CDEModal.alert(
        'Installation not available. The app may already be installed or your browser does not support PWA installation.'
      );
    }
    return;
  }

  const promptEvent = deferredInstallPrompt;
  deferredInstallPrompt = null;

  try {
    // Show the install prompt
    await promptEvent.prompt();

    // Wait for user choice
    const choiceResult = await promptEvent.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
      isInstallable = false;
      hideInstallIcon();
    } else {
      console.log('[PWA] User dismissed the install prompt');
      // Keep the icon visible for retry
      deferredInstallPrompt = promptEvent;
    }
  } catch (error) {
    console.error('[PWA] Installation prompt failed', error);
    if (window.CDEModal) {
      await window.CDEModal.alert('Installation failed. Please try again later.');
    }
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).installCDEAsApp = installPWA;
}
