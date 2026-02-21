import { CONFIG } from './config';
import { logger } from '../utilities/logger';
import { settingsManager } from './settingsmanager';

// ============================================================================
// WindowManager: window control (focus, drag, clock, dropdown)
// ============================================================================

// Interface for drag state
interface DragState {
  element: HTMLElement | null;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
  lastX: number;
  lastY: number;
  isDragging: boolean;
}

// Stores previous state of windows to restore position and size
interface WindowState {
  display?: string;
  left?: string;
  top?: string;
  width?: string;
  height?: string;
  maximized: boolean;
}

const windowStates: Record<string, WindowState> = {};

const WindowManager = (() => {
  // Start z-index higher than TopBar (9998) to ensure focused windows are on top
  let zIndex = CONFIG.WINDOW.BASE_Z_INDEX;
  const dragState: DragState = {
    element: null,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    lastX: 0,
    lastY: 0,
    isDragging: false,
  };
  const MIN_VISIBLE = CONFIG.WINDOW.MIN_VISIBLE;

  // Workspace state
  let currentWorkspace = '1';
  const workspaceWindows: Record<string, string[]> = {
    '1': [],
    '2': [],
    '3': [],
    '4': [],
  };

  /**
   * Brings a window to the front (max z-index) and marks it as active.
   * @param id - The ID of the window element.
   */
  function focusWindow(id: string): void {
    const win = document.getElementById(id);
    if (!win) {
      console.warn(`[WindowManager] focusWindow: window with id "${id}" not found.`);
      return;
    }

    if (!dragState.isDragging) {
      const elementsToRepaint = document.querySelectorAll('.window, .cde-retro-modal, #cde-panel');
      elementsToRepaint.forEach((el) => {
        const element = el as HTMLElement;
        if (element.classList.contains('window') || element.classList.contains('cde-retro-modal')) {
          element.classList.remove('active');
        }
      });

      if (win.classList.contains('window') || win.classList.contains('cde-retro-modal')) {
        win.classList.add('active');
      }

      zIndex++;
      win.style.zIndex = String(zIndex);
      logger.log(`[WindowManager] focusWindow: window "${id}" focus updated.`);
    }
  }

  /**
   * Normalizes a window's position to ensure it is draggable.
   */
  function normalizeWindowPosition(win: HTMLElement): void {
    // If hidden, don't normalize yet because getBoundingClientRect will be 0,0
    if (window.getComputedStyle(win).display === 'none') {
      return;
    }

    const rect = win.getBoundingClientRect();
    const TOP_BAR_HEIGHT = CONFIG.WINDOW.TOP_BAR_HEIGHT;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    win.style.position = 'absolute';

    // Ensure window titlebar is not covered by TopBar
    const normalizedTop = Math.max(rect.top, TOP_BAR_HEIGHT);
    win.style.top = normalizedTop + 'px';

    win.style.transform = 'none';

    if (rect.right < MIN_VISIBLE) win.style.left = '0px';
    if (rect.left > viewportWidth - MIN_VISIBLE)
      win.style.left = `${viewportWidth - MIN_VISIBLE}px`;
    if (rect.bottom < MIN_VISIBLE) win.style.top = `${CONFIG.WINDOW.TOP_BAR_HEIGHT}px`;
    if (rect.top > viewportHeight - MIN_VISIBLE)
      win.style.top = `${viewportHeight - MIN_VISIBLE}px`;

    logger.log(`[WindowManager] Normalized "${win.id}" to top: ${win.style.top}`);
  }

  function centerWindow(win: HTMLElement): void {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = win.getBoundingClientRect();

    const left = (viewportWidth - rect.width) / 2;
    const top = (viewportHeight - rect.height) / 2;

    win.style.position = 'absolute';
    win.style.left = `${Math.max(0, left)}px`;
    win.style.top = `${Math.max(CONFIG.WINDOW.TOP_BAR_HEIGHT, top)}px`;
    win.style.transform = 'none';
    win.style.margin = '0';

    logger.log(
      `[WindowManager] Centered window "${win.id}" at ${win.style.left}, ${win.style.top}`
    );
  }

  /**
   * Initiates dragging of a window. Supports both mouse and touch via PointerEvent.
   */
  function drag(e: PointerEvent, id: string): void {
    // Only handle primary pointer (usually left click or single touch)
    if (!e.isPrimary) return;

    const el = document.getElementById(id);
    if (!el) return;

    // Prevent default actions like text selection or touch scrolling
    e.preventDefault();
    e.stopPropagation();

    if (window.getComputedStyle(el).transform !== 'none') {
      normalizeWindowPosition(el);
    }

    focusWindow(id);

    const rect = el.getBoundingClientRect();
    dragState.element = el;
    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;
    dragState.lastX = e.clientX;
    dragState.lastY = e.clientY;
    dragState.isDragging = true;

    // Capture the pointer to keep receiving events even if the pointer leaves the element
    el.setPointerCapture(e.pointerId);

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', stopDrag);
    el.addEventListener('pointercancel', stopDrag); // Handle touch cancellations

    logger.log(`[WindowManager] pointer drag started for "${id}".`);
  }

  function move(e: PointerEvent): void {
    if (!dragState.element || !dragState.isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    // Get acceleration from CSS variable
    const accelStr = getComputedStyle(document.documentElement).getPropertyValue(
      '--mouse-acceleration'
    );
    const acceleration = parseFloat(accelStr) || 1;

    // Movement delta since last event
    const deltaX = e.clientX - dragState.lastX;
    const deltaY = e.clientY - dragState.lastY;

    // Apply acceleration to position
    let currentLeft = parseFloat(dragState.element.style.left || '0');
    let currentTop = parseFloat(dragState.element.style.top || '0');

    let left = currentLeft + deltaX * acceleration;
    let top = currentTop + deltaY * acceleration;

    // Update last position
    dragState.lastX = e.clientX;
    dragState.lastY = e.clientY;

    const winWidth = dragState.element.offsetWidth;
    const winHeight = dragState.element.offsetHeight;
    const maxX = window.innerWidth - MIN_VISIBLE;
    const maxY = window.innerHeight - MIN_VISIBLE;

    left = Math.min(Math.max(left, MIN_VISIBLE - winWidth), maxX);
    top = Math.min(Math.max(top, MIN_VISIBLE - winHeight), maxY);

    // Apply wireframe mode if opaqueDragging is false
    const opaque = document.documentElement.getAttribute('data-opaque-drag') !== 'false';
    if (!opaque) {
      dragState.element.classList.add('dragging-wireframe');
    }

    dragState.element.style.left = left + 'px';
    dragState.element.style.top = top + 'px';
  }

  function stopDrag(e: PointerEvent): void {
    if (!dragState.element || !dragState.isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    const el = dragState.element;
    el.releasePointerCapture(e.pointerId);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', stopDrag);
    el.removeEventListener('pointercancel', stopDrag);

    dragState.element.classList.remove('dragging-wireframe');
    dragState.isDragging = false;

    // Save session
    settingsManager.updateWindowSession(el.id, {
      left: el.style.left,
      top: el.style.top,
      maximized: el.classList.contains('maximized'),
    });

    dragState.element = null;
    logger.log(`[WindowManager] pointer drag stopped.`);
  }

  function titlebarDragHandler(e: PointerEvent): void {
    // IGNORE drag if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest('.close-btn, .min-btn, .max-btn')) {
      return;
    }

    const titlebar = e.currentTarget as HTMLElement;
    const win = titlebar.parentElement;
    if (win && win.id) {
      drag(e, win.id);
    }
  }

  function initWindows(): void {
    document.addEventListener('pointerdown', (e) => {
      if (dragState.isDragging) return;
      const win = (e.target as Element).closest('.window, .cde-retro-modal');
      if (win) {
        focusWindow(win.id);
      }
    });

    // Point to focus implementation
    document.addEventListener(
      'pointerenter',
      (e) => {
        const mode = document.documentElement.getAttribute('data-focus-mode');
        if (mode !== 'point') return;

        const win = (e.target as Element).closest('.window, .cde-retro-modal');
        if (win) {
          focusWindow(win.id);
        }
      },
      true
    );
  }

  function setupDropdown(btnId: string, menuId: string): void {
    const dropdownBtn = document.getElementById(btnId);
    const dropdownMenu = document.getElementById(menuId);

    if (!dropdownBtn || !dropdownMenu) {
      logger.warn(`[WindowManager] Dropdown elements not found for ${btnId}/${menuId}!`, {
        btn: !!dropdownBtn,
        menu: !!dropdownMenu,
      });
      return;
    }

    logger.log(`[WindowManager] Initializing dropdown menu: ${menuId}...`);
    let lastToggleTime = 0;

    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const now = Date.now();
      if (now - lastToggleTime < 300) return;
      lastToggleTime = now;

      const isOpen = dropdownBtn.classList.contains('open');

      if (!isOpen) {
        // OPENING
        dropdownBtn.classList.add('open');
        const rect = dropdownBtn.getBoundingClientRect();

        dropdownMenu.style.position = 'fixed';
        dropdownMenu.style.zIndex = String(CONFIG.DROPDOWN.Z_INDEX);
        dropdownMenu.style.display = 'block';

        // Calculate position based on the button
        const menuRect = dropdownMenu.getBoundingClientRect();
        dropdownMenu.style.bottom = window.innerHeight - rect.top + CONFIG.DROPDOWN.OFFSET + 'px';
        dropdownMenu.style.left = rect.left + rect.width / 2 - menuRect.width / 2 + 'px';

        logger.log(`[WindowManager] Dropdown ${menuId} opened.`);
      } else {
        // CLOSING
        dropdownBtn.classList.remove('open');
        dropdownMenu.style.display = 'none';
        logger.log(`[WindowManager] Dropdown ${menuId} closed via button click`);
      }
    });

    document.addEventListener('pointerdown', (e) => {
      const now = Date.now();
      if (now - lastToggleTime < 300) return;

      if (!dropdownBtn.contains(e.target as Node) && !dropdownMenu.contains(e.target as Node)) {
        if (dropdownBtn.classList.contains('open')) {
          dropdownBtn.classList.remove('open');
          dropdownMenu.style.display = 'none';
          logger.log(`[WindowManager] Dropdown ${menuId} closed from outside click`);
        }
      }
    });

    dropdownMenu.style.display = 'none';
  }

  function initDropdowns(): void {
    setupDropdown('utilitiesBtn', 'utilitiesDropdown');
    setupDropdown('styleManagerBtn', 'styleManagerDropdown');
    setupDropdown('terminalBtn', 'terminalDropdown');
    setupDropdown('fileManagerBtn', 'fileManagerDropdown');
  }

  /**
   * Registers a single window element to make it draggable and interactive.
   */
  function registerWindow(win: HTMLElement): void {
    if (win.hasAttribute('data-cde-registered')) return;

    const id = win.id;
    const titlebar = document.getElementById(`${id}Titlebar`) || win.querySelector('.titlebar');

    if (titlebar) {
      // Restore session position if available
      const session = settingsManager.getSection('session').windows[id];
      if (session && session.left && session.top) {
        win.style.left = session.left;
        win.style.top = session.top;
        if (session.maximized) win.classList.add('maximized');
        logger.log(`[WindowManager] Restored session for: ${id}`);
      } else {
        // Only normalize if it's already visible, otherwise wait for normalization on drag
        if (window.getComputedStyle(win).display !== 'none') {
          setTimeout(() => {
            normalizeWindowPosition(win);
          }, CONFIG.TIMINGS.NORMALIZATION_DELAY);
        }
      }

      // Essential for touch support: prevent browser default behavior
      (titlebar as HTMLElement).style.touchAction = 'none';

      titlebar.addEventListener('pointerdown', titlebarDragHandler as any);
      titlebar.setAttribute('data-draggable', 'true');
      win.setAttribute('data-cde-registered', 'true');

      // Assign to current workspace if not specified
      if (!win.getAttribute('data-workspace')) {
        win.setAttribute('data-workspace', currentWorkspace);
        // If it's a fresh registration without a workspace, it's likely a new window or modal
        // Center it if it's visible, or wait for it to be shown
        if (window.getComputedStyle(win).display !== 'none') {
          requestAnimationFrame(() => centerWindow(win));
        }
      }

      const ws = win.getAttribute('data-workspace') || currentWorkspace;
      if (ws !== currentWorkspace) {
        win.style.display = 'none';
      }

      logger.log(`[WindowManager] Window registered: ${id || 'anonymous'} in WS ${ws}`);
    }
  }

  function switchWorkspace(id: string): void {
    if (id === currentWorkspace) return;

    logger.log(`[WindowManager] Switching to workspace: ${id}`);

    const windows = document.querySelectorAll('.window, .cde-retro-modal');

    // Hide all windows of current workspace and remember which ones were open
    windows.forEach((win) => {
      const el = win as HTMLElement;
      if (el.getAttribute('data-workspace') === currentWorkspace) {
        const isVisible = window.getComputedStyle(el).display !== 'none';
        if (isVisible) {
          el.setAttribute('data-was-opened', 'true');
          el.style.display = 'none';
        } else {
          el.removeAttribute('data-was-opened');
        }
      }
    });

    // Update state
    currentWorkspace = id;

    // Show windows of new workspace only if they were opened
    windows.forEach((win) => {
      const el = win as HTMLElement;
      if (el.getAttribute('data-workspace') === currentWorkspace) {
        if (el.getAttribute('data-was-opened') === 'true') {
          el.style.display = 'flex';
        }
      }
    });

    // Update UI
    const pagerItems = document.querySelectorAll('.pager-workspace');
    pagerItems.forEach((item) => {
      if ((item as HTMLElement).dataset.workspace === id) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function initPager(): void {
    const pagerItems = document.querySelectorAll('.pager-workspace');
    pagerItems.forEach((item) => {
      item.addEventListener('click', () => {
        const ws = (item as HTMLElement).dataset.workspace;
        if (ws) switchWorkspace(ws);
      });
    });
  }

  function initDynamicScanning(): void {
    // Scan existing windows
    const windows = document.querySelectorAll('.window, .cde-retro-modal');
    windows.forEach((el) => registerWindow(el as HTMLElement));

    // Observe for new windows added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('window') || node.classList.contains('cde-retro-modal')) {
              registerWindow(node);
            }
            // Also scan children in case a wrapper was added
            node.querySelectorAll('.window, .cde-retro-modal').forEach((el) => {
              registerWindow(el as HTMLElement);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    logger.log('[WindowManager] MutationObserver active for dynamic windows.');
  }

  function init(): void {
    initDynamicScanning();
    initDropdowns();
    initPager();
    logger.log('[WindowManager] Initialized');
  }

  return { init, drag, focusWindow, registerWindow, centerWindow };
})();

function minimizeWindow(id: string): void {
  const win = document.getElementById(id);
  if (!win) return;

  if (win.style.display !== 'none') {
    windowStates[id] = {
      display: win.style.display,
      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      height: win.style.height,
      maximized: win.classList.contains('maximized'),
    };
  }

  win.style.display = 'none';
}

function maximizeWindow(id: string): void {
  const win = document.getElementById(id);
  if (!win) return;

  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
    if (windowStates[id]) {
      win.style.left = windowStates[id].left || '';
      win.style.top = windowStates[id].top || '';
      win.style.width = windowStates[id].width || '';
      win.style.height = windowStates[id].height || '';
    }
    WindowManager.focusWindow(id);

    settingsManager.updateWindowSession(id, { maximized: false });
    logger.log(`[WindowManager] maximizeWindow: window "${id}" restored.`);
  } else {
    windowStates[id] = {
      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      height: win.style.height,
      maximized: false,
    };
    win.classList.add('maximized');
    WindowManager.focusWindow(id);

    settingsManager.updateWindowSession(id, { maximized: true });
    logger.log(`[WindowManager] maximizeWindow: window "${id}" maximized.`);
  }
}

declare global {
  interface Window {
    drag: (e: PointerEvent, id: string) => void;
    focusWindow?: (id: string) => void;
    centerWindow: (win: HTMLElement) => void;
    minimizeWindow: typeof minimizeWindow;
    maximizeWindow: typeof maximizeWindow;
  }
}

window.drag = WindowManager.drag as any;
window.focusWindow = WindowManager.focusWindow;
window.centerWindow = WindowManager.centerWindow;
window.minimizeWindow = minimizeWindow;
window.maximizeWindow = maximizeWindow;

export { WindowManager, minimizeWindow, maximizeWindow };
