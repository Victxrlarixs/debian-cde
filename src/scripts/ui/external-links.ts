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

  const content = `
    <div class="external-link-icon">
      <img src="/icons/status/dialog-question.png" alt="Warning" width="48" height="48" />
    </div>
    <p class="external-link-message">
      You are about to leave this site:
    </p>
    <div class="external-link-url" style="word-break: break-all; margin: 10px 0; font-family: monospace; font-size: 11px; background: rgba(0,0,0,0.1); padding: 5px;">
      ${url}
    </div>
    <p class="external-link-question">
      Do you want to continue?
    </p>
  `;

  CDEModal.open('External Link', content, [
    {
      label: 'Go GitHub',
      value: true,
      isDefault: true,
    },
    {
      label: 'Cancel',
      value: false,
    },
  ]).then((confirmed) => {
    if (confirmed) {
      window.open(url, '_blank');
    }
  });
}

// Expose globally for HTML onclick handlers
declare global {
  interface Window {
    confirmExternalLink: typeof confirmExternalLink;
  }
}

window.confirmExternalLink = confirmExternalLink;

logger.log('[ExternalLink] Module loaded');
