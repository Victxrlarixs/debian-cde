// src/scripts/utilities/preloader.ts
import { logger } from './logger';

/**
 * Utility to preload critical CDE assets (icons, sounds)
 * to ensure they are available in memory and avoid redundant network requests.
 */
export const Preloader = (() => {
  const CRITICAL_ICONS = [
    // Window controls (always visible on any window)
    '/icons/ui/shade-inactive.png',
    '/icons/ui/shade-toggled-inactive.png',
    '/icons/ui/maximize-inactive.png',
    '/icons/ui/maximize-toggled-inactive.png',
    '/icons/ui/window-close.png',
    '/icons/ui/tab_close.png',

    // Panel main icons (visible immediately on boot)
    '/icons/system/Debian.png',
    '/icons/actions/go-up.png',
    '/icons/apps/filemanager.png',
    '/icons/apps/xemacs.png',
    '/icons/apps/konsole.png',
    '/icons/apps/konqueror.png',
    '/icons/apps/org.xfce.settings.manager.png',
    '/icons/system/applications-other.png',
    '/icons/apps/org.xfce.screenshooter.png',
    '/icons/apps/org.xfce.PanelProfiles.png',
    '/icons/apps/org.xfce.taskmanager.png',

    // TopBar (visible immediately)
    '/icons/devices/audio-volume-low.png',

    // Desktop system icons (created on boot)
    '/icons/apps/netscape_classic.png',
    '/icons/apps/Lynx.svg',

    // Panel dropdowns (frequently accessed)
    '/icons/devices/computer.png',
    '/icons/apps/man.png',
    '/icons/system/calendar.png',
    '/icons/system/gtkclocksetup.png',
    '/icons/apps/org.xfce.settings.appearance.png',
    '/icons/apps/org.xfce.settings.keyboard.png',
    '/icons/apps/org.xfce.settings.mouse.png',
    '/icons/devices/multimedia-volume-control.png',
    '/icons/apps/org.xfce.xfwm4.png',
    '/icons/devices/display.png',
    '/icons/system/gcr-key.png',
    '/icons/mimetypes/font-x-generic.png',

    // FileManager (frequently opened, high priority)
    '/icons/actions/previous.png',
    '/icons/actions/right.png',
    '/icons/actions/gohome.png',
    '/icons/apps/org.xfce.catfish.png',
    '/icons/places/desktop.png',
    '/icons/places/user-trash-full.png',
    '/icons/places/folder_open.png',
    '/icons/devices/floppy.png',
    '/icons/mimetypes/gtk-file.png',

    // UI elements (modals, dialogs, scrollbars)
    '/icons/status/dialog-question.png',
    '/icons/ui/scrollbarArrowUp.png',
    '/icons/ui/scrollbarArrowDown.png',
    '/icons/ui/scrollbarArrowLeft.png',
    '/icons/ui/scrollbarArrowRight.png',
  ];

  /**
   * Preloads an array of image URLs.
   */
  async function preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve; // Continue even if one fails
      });
    });
    await Promise.all(promises);
  }

  /**
   * Starts the preloading process.
   */
  async function init(): Promise<void> {
    logger.log('[Preloader] Starting preloading of critical assets...');
    const start = performance.now();

    await preloadImages(CRITICAL_ICONS);

    const end = performance.now();
    logger.log(
      `[Preloader] Preloaded ${CRITICAL_ICONS.length} icons in ${(end - start).toFixed(2)}ms`
    );
  }

  return { init };
})();

export default Preloader;
