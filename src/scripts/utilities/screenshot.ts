import { CONFIG } from '../core/config';
import { CDEModal } from '../ui/modals';
import { logger } from './logger';
import { WindowManager } from '../core/windowmanager';

// ============================================================================
// Screenshot capture
// ============================================================================

// Declaration for html2canvas (assumed to be loaded globally)
/**
 * Type declaration for html2canvas library.
 * Assumes html2canvas is loaded globally via script tag.
 *
 * @param element - The HTML element to capture
 * @param options - Configuration options for the capture
 * @returns Promise resolving to an HTMLCanvasElement
 */
declare function html2canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement>;

/**
 * Captures a full-page screenshot using html2canvas and triggers a download.
 *
 * @remarks
 * This function captures the entire document element (html2canvas) and saves it
 * as a PNG file with a timestamp in the filename. During capture:
 * - The screenshot button is visually disabled (opacity 0.5, cursor wait)
 * - A toast notification is displayed (temporarily hidden in the cloned document)
 * - Error handling shows a modal alert if capture fails
 *
 * Configuration is loaded from CONFIG.SCREENSHOT:
 * - SCALE: Resolution scale factor
 * - TOAST_MESSAGE: Message displayed during capture
 * - FILENAME_PREFIX: Prefix for the generated filename
 *
 * The function is exposed globally as window.captureFullPageScreenshot
 * for use in HTML onclick handlers.
 *
 * @example
 * ```html
 * <button onclick="captureFullPageScreenshot()">Capture Screenshot</button>
 * ```
 */
export function captureFullPageScreenshot(): void {
  logger.log('[Screenshot] captureFullPageScreenshot: starting screenshot capture');

  const btn = document.getElementById('screenshot-btn') as HTMLElement | null;

  if (btn) {
    logger.log('[Screenshot] Setting button to loading state');
    btn.style.opacity = '0.5';
    btn.style.cursor = 'wait';
  }

  // Create and show toast notification
  const toast = document.createElement('div');
  toast.textContent = CONFIG.SCREENSHOT.TOAST_MESSAGE;
  toast.className = 'screenshot-toast';
  document.body.appendChild(toast);
  logger.log('[Screenshot] Toast notification displayed');

  const options = {
    scale: CONFIG.SCREENSHOT.SCALE,
    backgroundColor: null,
    allowTaint: false,
    useCORS: true,
    logging: false,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    onclone: (clonedDoc: Document) => {
      logger.log('[Screenshot] Processing cloned document for capture');
      const clonedToast = clonedDoc.querySelector('.screenshot-toast');
      if (clonedToast) {
        (clonedToast as HTMLElement).style.display = 'none';
        logger.log('[Screenshot] Toast hidden in cloned document');
      }
    },
  };

  logger.log(`[Screenshot] Capture options: scale=${CONFIG.SCREENSHOT.SCALE}, useCORS=true`);

  html2canvas(document.documentElement, options)
    .then(async (canvas: HTMLCanvasElement) => {
      logger.log('[Screenshot] Canvas generated successfully');

      const dataUrl = canvas.toDataURL('image/png');
      const resolution = `${canvas.width}x${canvas.height}`;
      const sizeBytes = Math.round((dataUrl.length * 3) / 4); // Approx size from base64
      const sizeStr = formatBytes(sizeBytes);

      const html = `
        <div class="screenshot-preview-container">
          <img src="${dataUrl}" class="screenshot-preview-image" />
          <div class="screenshot-info">
            Resolution: ${resolution} | Est. Size: ${sizeStr}
          </div>
        </div>
      `;

      // Clean up toast immediately after capture
      if (document.body.contains(toast)) document.body.removeChild(toast);

      const modalPromise = CDEModal.open('SnapShot Viewer', html, [
        { label: 'Save', value: 'SAVE', isDefault: true },
        { label: 'Discard', value: 'DISCARD' }
      ]);

      // Center again after a short delay to account for image layout
      const modal = document.getElementById('cde-modal-global');
      if (modal) {
        requestAnimationFrame(() => WindowManager.centerWindow(modal));
        setTimeout(() => WindowManager.centerWindow(modal), 100);
      }

      const result = await modalPromise;

      if (result === 'SAVE') {
        // Generate timestamp-based filename
        const now = new Date();
        const filename = `${CONFIG.SCREENSHOT.FILENAME_PREFIX}-${now.getFullYear()}-${(
          now.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now
          .getHours()
          .toString()
          .padStart(2, '0')}.${now.getMinutes().toString().padStart(2, '0')}.${now
          .getSeconds()
          .toString()
          .padStart(2, '0')}.png`;

        logger.log(`[Screenshot] Generated filename: ${filename}`);

        // Create download link
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
        logger.log('[Screenshot] Download triggered');
      }

      if (btn) {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        logger.log('[Screenshot] Button restored to normal state');
      }

      logger.log(`[Screenshot] Capture process finished`);
    })
    .catch((error: any) => {
      console.error('[Screenshot] Error during capture:', error);

      // Clean up on error
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
        logger.log('[Screenshot] Toast removed after error');
      }

      if (btn) {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        logger.log('[Screenshot] Button restored after error');
      }

      // Show error to user
      CDEModal.alert('Error capturing screenshot.').then(() => {
        logger.log('[Screenshot] Error alert displayed to user');
      });
    });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ============================================================================
// Global exposure (compatibility with existing HTML)
// ============================================================================

declare global {
  interface Window {
    /**
     * Global function for capturing full-page screenshots.
     * Made available for HTML onclick handlers.
     *
     * @example
     * ```html
     * <button onclick="captureFullPageScreenshot()">Capture</button>
     * ```
     */
    captureFullPageScreenshot: () => void;
  }
}

// Assign to window for onclick handlers in HTML
window.captureFullPageScreenshot = captureFullPageScreenshot;

// Log module load
logger.log('[Screenshot] Module loaded and ready');
