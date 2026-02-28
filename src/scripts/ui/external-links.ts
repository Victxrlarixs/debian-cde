// src/scripts/ui/external-link.ts

import { CDEModal } from './modals';
import { logger } from '../utilities/logger';

/**
 * Displays a confirmation dialog before opening an external link.
 * Ensures the modal is clean (no menu items) and shows the target URL.
 *
 * @param url - The external URL to open
 */
export function confirmExternalLink(url: string): void {
  logger.log(`[ExternalLink] Confirming navigation to: ${url}`);

  // Thoroughly clean up modal before use
  const modal = document.getElementById('cde-modal-global');
  if (modal) {
    const menuItems = modal.querySelectorAll('.cde-menu-item');
    menuItems.forEach((item) => item.remove());
    if (menuItems.length > 0) {
      logger.log(`[ExternalLink] Removed ${menuItems.length} menu items from modal`);
    }

    const menubar = modal.querySelector('.cde-menubar');
    if (menubar) {
      menubar.remove();
      logger.log('[ExternalLink] Removed menubar from modal');
    }

    const titleEl = modal.querySelector('.titlebar-text');
    if (titleEl) {
      titleEl.textContent = '';
    }
  }

  const content = `
    <div class="external-link-icon">
      <img src="/icons/status/dialog-question.png" alt="Warning" width="48" height="48" />
    </div>
    <p class="external-link-message">
      You are about to leave this site:
    </p>
    <div class="external-link-url">
      ${url}
    </div>
    <p class="external-link-question">
      Do you want to continue?
    </p>
    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
      <button 
        onclick="window.open('${url}', '_blank'); window.CDEModal.close();" 
        class="cde-btn cde-btn-default"
        style="padding: 8px 16px; font-size: 12px;"
      >
        <img src="/icons/apps/konqueror.png" alt="" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px;" />
        Go GitHub
      </button>
    </div>
  `;

  CDEModal.open('External Link', content, []);
}

// Expose globally for HTML onclick handlers
declare global {
  interface Window {
    confirmExternalLink: typeof confirmExternalLink;
  }
}

window.confirmExternalLink = confirmExternalLink;

logger.log('[ExternalLink] Module loaded');
