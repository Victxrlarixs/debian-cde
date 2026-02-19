// src/scripts/ui/external-link.ts

import { CDEModal } from './modals';

/**
 * Displays a confirmation dialog before opening an external link.
 * Ensures the modal is clean (no menu items) and shows the target URL.
 * 
 * @param url - The external URL to open
 */
export function confirmExternalLink(url: string): void {
  console.log(`[ExternalLink] Confirming navigation to: ${url}`);

  // Thoroughly clean up modal before use
  const modal = document.getElementById('cde-modal-global');
  if (modal) {
    const menuItems = modal.querySelectorAll('.cde-menu-item');
    menuItems.forEach(item => item.remove());
    if (menuItems.length > 0) {
      console.log(`[ExternalLink] Removed ${menuItems.length} menu items from modal`);
    }
    
    const menubar = modal.querySelector('.cde-menubar');
    if (menubar) {
      menubar.remove();
      console.log('[ExternalLink] Removed menubar from modal');
    }
    
    const titleEl = modal.querySelector('.titlebar-text');
    if (titleEl) {
      titleEl.textContent = '';
    }
  }

  const content = `
    <div class="external-link-icon">
      <img src="/icons/important.png" alt="Warning" width="48" height="48" />
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
  `;

  CDEModal.open(
    'External Link',
    content,
    [
      { label: 'Continue', value: true, isDefault: true },
      { label: 'Cancel', value: false }
    ]
  ).then((confirmed: boolean) => {
    if (confirmed) {
      console.log(`[ExternalLink] User confirmed, opening: ${url}`);
      window.open(url, '_blank');
    } else {
      console.log('[ExternalLink] User cancelled');
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

console.log('[ExternalLink] Module loaded');