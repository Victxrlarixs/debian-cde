// src/scripts/features/panel.ts
// CDE Front Panel functionality - Classic 90s Unix style

/**
 * App Manager controller
 */
const appManager = {
  open() {
    const modal = document.getElementById('appManager');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  },
  close() {
    const modal = document.getElementById('appManager');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  },
};

// Expose to window for global access
(window as any).appManager = appManager;

/**
 * Initialize panel functionality
 */
function initPanel() {
  // Workspace switcher
  const workspaceBtns = document.querySelectorAll('.workspace-btn');
  workspaceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      workspaceBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    });
  });

  // Dropdown functionality
  setupDropdown('utilitiesBtn', 'utilitiesDropdown');
  setupDropdown('styleManagerBtn', 'styleManagerDropdown');
  setupDropdown('terminalBtn', 'terminalDropdown');
  setupDropdown('browserBtn', 'browserDropdown');
}

/**
 * Setup dropdown menu for a button
 */
function setupDropdown(buttonId: string, dropdownId: string) {
  const button = document.getElementById(buttonId);
  const dropdown = document.getElementById(dropdownId);

  if (!button || !dropdown) return;

  button.addEventListener('click', (e) => {
    e.stopPropagation();

    // Close other dropdowns
    document.querySelectorAll('.dropdown-menu').forEach((menu) => {
      if (menu.id !== dropdownId) {
        menu.classList.remove('show');
      }
    });

    // Toggle current dropdown
    dropdown.classList.toggle('show');
    button.setAttribute('aria-expanded', dropdown.classList.contains('show').toString());

    // Position dropdown above the arrow button
    const rect = button.getBoundingClientRect();
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.bottom = `${window.innerHeight - rect.top + 5}px`;
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
      dropdown.classList.remove('show');
      button.setAttribute('aria-expanded', 'false');
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPanel);
} else {
  initPanel();
}

export { initPanel, appManager };
