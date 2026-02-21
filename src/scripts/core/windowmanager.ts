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
  let zIndex = 10000;
  const dragState: DragState = {
    element: null,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    isDragging: false,
  };
  const MIN_VISIBLE = CONFIG.WINDOW.MIN_VISIBLE;

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
        if (
          element.id !== 'styleManagerMain' &&
          (element.classList.contains('window') || element.classList.contains('cde-retro-modal'))
        ) {
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
    const TOP_BAR_HEIGHT = 30; // 28px + safety margin

    win.style.position = 'absolute';
    win.style.left = rect.left + 'px';
    
    // Ensure window titlebar is not covered by TopBar
    const normalizedTop = Math.max(rect.top, TOP_BAR_HEIGHT);
    win.style.top = normalizedTop + 'px';
    
    win.style.transform = 'none';
    
    logger.log(`[WindowManager] Normalized "${win.id}" to top: ${win.style.top}`);
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

    let left = e.clientX - dragState.offsetX;
    let top = e.clientY - dragState.offsetY;

    const winWidth = dragState.element.offsetWidth;
    const winHeight = dragState.element.offsetHeight;
    const maxX = window.innerWidth - MIN_VISIBLE;
    const maxY = window.innerHeight - MIN_VISIBLE;

    left = Math.min(Math.max(left, MIN_VISIBLE - winWidth), maxX);
    top = Math.min(Math.max(top, MIN_VISIBLE - winHeight), maxY);

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

    dragState.isDragging = false;
    
    // Save session
    settingsManager.updateWindowSession(el.id, {
      left: el.style.left,
      top: el.style.top,
      maximized: el.classList.contains('maximized')
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
  }

  function initDropdown(): void {
    const dropdownBtn = document.getElementById('utilitiesBtn');
    const dropdownMenu = document.getElementById('utilitiesDropdown');
    if (!dropdownBtn || !dropdownMenu) return;

    let clickJustOpened = false;

    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const willOpen = !dropdownBtn.classList.contains('open');
      dropdownBtn.classList.toggle('open');

      if (willOpen) {
        const rect = dropdownBtn.getBoundingClientRect();
        dropdownMenu.style.position = 'fixed';
        dropdownMenu.style.bottom = window.innerHeight - rect.top + 'px';
        dropdownMenu.style.left = rect.left + 'px';
        dropdownMenu.style.display = 'block';
        clickJustOpened = true;
        setTimeout(() => { clickJustOpened = false; }, 200);
      } else {
        dropdownMenu.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (clickJustOpened) return;
      if (!dropdownBtn.contains(e.target as Node) && !dropdownMenu.contains(e.target as Node)) {
        dropdownBtn.classList.remove('open');
        dropdownMenu.style.display = 'none';
      }
    });
    dropdownMenu.style.display = 'none';
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
          setTimeout(() => { normalizeWindowPosition(win); }, 100);
        }
      }
      
      // Essential for touch support: prevent browser default behavior
      (titlebar as HTMLElement).style.touchAction = 'none';
      
      titlebar.addEventListener('pointerdown', titlebarDragHandler as any);
      titlebar.setAttribute('data-draggable', 'true');
      win.setAttribute('data-cde-registered', 'true');
      
      logger.log(`[WindowManager] Window registered: ${id || 'anonymous'}`);
    }
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
    initWindows();
    initDropdown();
    
    // Initial scan and start observer
    setTimeout(() => {
      initDynamicScanning();
    }, 200);

    logger.log('[WindowManager] Dynamic system initialized.');
  }

  return { init, drag, focusWindow, registerWindow };
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
    minimizeWindow: typeof minimizeWindow;
    maximizeWindow: typeof maximizeWindow;
  }
}

window.drag = WindowManager.drag as any;
window.focusWindow = WindowManager.focusWindow;
window.minimizeWindow = minimizeWindow;
window.maximizeWindow = maximizeWindow;

export { WindowManager, minimizeWindow, maximizeWindow };
