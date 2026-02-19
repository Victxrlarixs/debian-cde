import { CONFIG } from '../core/config';
import { CDEModal } from '../ui/modals';

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
  console.log('[Screenshot] captureFullPageScreenshot: starting screenshot capture');
  
  const btn = document.getElementById('screenshot-btn') as HTMLElement | null;

  if (btn) {
    console.log('[Screenshot] Setting button to loading state');
    btn.style.opacity = '0.5';
    btn.style.cursor = 'wait';
  }

  // Create and show toast notification
  const toast = document.createElement('div');
  toast.textContent = CONFIG.SCREENSHOT.TOAST_MESSAGE;
  toast.className = 'screenshot-toast';
  document.body.appendChild(toast);
  console.log('[Screenshot] Toast notification displayed');

  const options = {
    scale: CONFIG.SCREENSHOT.SCALE,
    backgroundColor: null,
    allowTaint: false,
    useCORS: true,
    logging: false,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    onclone: (clonedDoc: Document) => {
      console.log('[Screenshot] Processing cloned document for capture');
      const clonedToast = clonedDoc.querySelector('.screenshot-toast');
      if (clonedToast) {
        (clonedToast as HTMLElement).style.display = 'none';
        console.log('[Screenshot] Toast hidden in cloned document');
      }
    },
  };

  console.log(`[Screenshot] Capture options: scale=${CONFIG.SCREENSHOT.SCALE}, useCORS=true`);

  html2canvas(document.documentElement, options)
    .then((canvas: HTMLCanvasElement) => {
      console.log('[Screenshot] Canvas generated successfully');
      
      // Generate timestamp-based filename
      const now = new Date();
      const filename = `${CONFIG.SCREENSHOT.FILENAME_PREFIX}-${
        now.getFullYear()}-${
        (now.getMonth() + 1).toString().padStart(2, '0')}-${
        now.getDate().toString().padStart(2, '0')} ${
        now.getHours().toString().padStart(2, '0')}.${
        now.getMinutes().toString().padStart(2, '0')}.${
        now.getSeconds().toString().padStart(2, '0')}.png`;

      console.log(`[Screenshot] Generated filename: ${filename}`);

      // Create download link
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
      console.log('[Screenshot] Download triggered');

      // Clean up
      document.body.removeChild(toast);
      console.log('[Screenshot] Toast removed');

      if (btn) {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        console.log('[Screenshot] Button restored to normal state');
      }

      console.log(`[Screenshot] Capture complete: saved as ${filename}`);
    })
    .catch((error: any) => {
      console.error('[Screenshot] Error during capture:', error);
      
      // Clean up on error
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
        console.log('[Screenshot] Toast removed after error');
      }

      if (btn) {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        console.log('[Screenshot] Button restored after error');
      }

      // Show error to user
      CDEModal.alert('Error capturing screenshot.')
        .then(() => {
          console.log('[Screenshot] Error alert displayed to user');
        });
    });
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
console.log('[Screenshot] Module loaded and ready');