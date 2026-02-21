import { CONFIG } from './config';

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
  let zIndex = CONFIG.WINDOW.BASE_Z_INDEX;
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

    // Only increment z-index if we are not dragging
    if (!dragState.isDragging) {
      // Do not remove 'active' class from the main style manager window if the new window is not the main one.
      const elementsToRepaint = document.querySelectorAll('.window, .cde-retro-modal, #cde-panel');
      elementsToRepaint.forEach((el) => {
        const element = el as HTMLElement;

        // Only remove 'active' class if it's not the main window and it is a window/modal
        if (
          element.id !== 'styleManagerMain' &&
          (element.classList.contains('window') || element.classList.contains('cde-retro-modal'))
        ) {
          element.classList.remove('active');
        }
      });

      // Add 'active' class to the new window if it's a window/modal
      if (win.classList.contains('window') || win.classList.contains('cde-retro-modal')) {
        win.classList.add('active');
      }

      // Increment z-index
      zIndex++;
      win.style.zIndex = String(zIndex);
      console.log(
        `[WindowManager] focusWindow: window "${id}" brought to front, new z-index ${zIndex}.`
      );
    }
  }

  /**
   * Normalizes a window's position to ensure it is draggable.
   * Removes transform and sets absolute position with concrete values.
   * @param win - The window to normalize
   */
  function normalizeWindowPosition(win: HTMLElement): void {
    // Save the original transform style
    const originalTransform = win.style.transform;

    // Get the current position of the window (considering transform)
    const rect = win.getBoundingClientRect();

    // Set absolute position with current values
    win.style.position = 'absolute';
    win.style.left = rect.left + 'px';
    win.style.top = rect.top + 'px';
    win.style.transform = 'none';

    console.log(
      `[WindowManager] Normalized window position: left=${rect.left}px, top=${rect.top}px`
    );
  }

  /**
   * Initiates dragging of a window.
   * @param e - The mousedown event.
   * @param id - The ID of the window to drag.
   */
  function drag(e: MouseEvent, id: string): void {
    e.preventDefault(); // Prevent text selection
    e.stopPropagation(); // Prevent propagation

    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[WindowManager] drag: window with id "${id}" not found.`);
      return;
    }

    // If the window has transform, normalize it before dragging
    const transform = window.getComputedStyle(el).transform;
    if (transform !== 'none') {
      normalizeWindowPosition(el);
    }

    // Ensure absolute positioning
    if (window.getComputedStyle(el).position !== 'absolute') {
      el.style.position = 'absolute';
    }

    focusWindow(id);

    const rect = el.getBoundingClientRect();

    dragState.element = el;
    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.startLeft = rect.left;
    dragState.startTop = rect.top;
    dragState.isDragging = true;

    // Use capture phase to ensure we capture all events
    document.addEventListener('mousemove', move, true);
    document.addEventListener('mouseup', stopDrag, true);

    console.log(`[WindowManager] drag started for window "${id}".`);
  }

  /**
   * Moves the window while dragging, with screen boundaries.
   * @param e - MouseEvent
   */
  function move(e: MouseEvent): void {
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

  /** Ends dragging and cleans up event listeners. */
  function stopDrag(e: MouseEvent): void {
    if (!dragState.element || !dragState.isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    console.log(`[WindowManager] drag stopped for window "${dragState.element.id}".`);

    dragState.isDragging = false;
    dragState.element = null;

    document.removeEventListener('mousemove', move, true);
    document.removeEventListener('mouseup', stopDrag, true);
  }

  /**
   * Handler for titlebar mousedown events.
   */
  function titlebarDragHandler(e: MouseEvent): void {
    const titlebar = e.currentTarget as HTMLElement;
    const win = titlebar.parentElement;

    if (win && win.id) {
      drag(e, win.id);
    } else {
      console.warn('[WindowManager] Could not determine window ID for dragging');
    }
  }

  /**
   * Initializes click delegation to bring any clicked window to the front.
   */
  function initWindows(): void {
    document.addEventListener('mousedown', (e) => {
      // Do not focus if we are dragging
      if (dragState.isDragging) return;

      const win = (e.target as Element).closest('.window, .cde-retro-modal');
      if (win) {
        focusWindow(win.id);
      }
    });
    console.log('[WindowManager] Initialized window focus delegation.');
  }

  /* ------------------------------------------------------------------
       Utilities dropdown menu
    ------------------------------------------------------------------ */

  function initDropdown(): void {
    const dropdownBtn = document.getElementById('utilitiesBtn');
    const dropdownMenu = document.getElementById('utilitiesDropdown');

    if (!dropdownBtn || !dropdownMenu) {
      console.warn('[WindowManager] initDropdown: dropdown button or menu not found.');
      return;
    }

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

        setTimeout(() => {
          clickJustOpened = false;
        }, 200);
      } else {
        dropdownMenu.style.display = 'none';
      }

      console.log(
        `[WindowManager] Dropdown toggled: ${dropdownBtn.classList.contains('open') ? 'open' : 'closed'}`
      );
    });

    document.addEventListener('click', (e) => {
      if (clickJustOpened) return;

      if (!dropdownBtn.contains(e.target as Node) && !dropdownMenu.contains(e.target as Node)) {
        dropdownBtn.classList.remove('open');
        dropdownMenu.style.display = 'none';
      }
    });

    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    dropdownMenu.style.display = 'none';

    console.log('[WindowManager] Dropdown initialized.');
  }

  /* ------------------------------------------------------------------
       Initialize draggable titlebars automatically
    ------------------------------------------------------------------ */

  function initDraggableTitlebars(): void {
    // Single source of truth for all draggable windows in the desktop
    const allWindows = [
      // Style Manager windows
      'styleManagerMain',
      'styleManagerColor',
      'styleManagerFont',
      'styleManagerBackdrop',
      'styleManagerMouse',
      'styleManagerKeyboard',
      'styleManagerWindow',
      'styleManagerScreen',
      'styleManagerBeep',
      'styleManagerStartup',
      // Feature windows
      'terminal',
      'fm',
      'process-monitor',
      'text-editor',
    ];
    let draggableCount = 0;

    allWindows.forEach((id) => {
      const win = document.getElementById(id);
      const titlebar = document.getElementById(`${id}Titlebar`);

      if (win && titlebar) {
        // Normalize position at startup
        setTimeout(() => {
          normalizeWindowPosition(win);
        }, 100);

        titlebar.removeEventListener('mousedown', titlebarDragHandler);
        titlebar.addEventListener('mousedown', titlebarDragHandler);
        draggableCount++;

        titlebar.setAttribute('data-draggable', 'true');
        console.log(`[WindowManager] Draggable initialized for: ${id}`);
      }
    });

    console.log(`[WindowManager] Initialized ${draggableCount} draggable titlebars.`);
  }

  /* ------------------------------------------------------------------
       General initialization
    ------------------------------------------------------------------ */

  function init(): void {
    initWindows();
    initDropdown();

    setTimeout(() => {
      initDraggableTitlebars();
    }, 200);

    console.log('[WindowManager] Fully initialized.');
  }

  return { init, drag, focusWindow };
})();

// ============================================================================
// Minimize and maximize windows
// ============================================================================

function minimizeWindow(id: string): void {
  const win = document.getElementById(id);
  if (!win) {
    console.warn(`[WindowManager] minimizeWindow: window with id "${id}" not found.`);
    return;
  }

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
  console.log(`[WindowManager] minimizeWindow: window "${id}" minimized.`);
}

function maximizeWindow(id: string): void {
  const win = document.getElementById(id);
  if (!win) {
    console.warn(`[WindowManager] maximizeWindow: window with id "${id}" not found.`);
    return;
  }

  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
    if (windowStates[id]) {
      win.style.left = windowStates[id].left || '';
      win.style.top = windowStates[id].top || '';
      win.style.width = windowStates[id].width || '';
      win.style.height = windowStates[id].height || '';
    }
    if (window.focusWindow) window.focusWindow(id);
    console.log(`[WindowManager] maximizeWindow: window "${id}" restored.`);
  } else {
    windowStates[id] = {
      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      height: win.style.height,
      maximized: false,
    };
    win.classList.add('maximized');
    if (window.focusWindow) window.focusWindow(id);
    console.log(`[WindowManager] maximizeWindow: window "${id}" maximized.`);
  }
}

declare global {
  interface Window {
    drag: (e: MouseEvent, id: string) => void;
    focusWindow?: (id: string) => void;
    minimizeWindow: typeof minimizeWindow;
    maximizeWindow: typeof maximizeWindow;
  }
}

window.drag = WindowManager.drag;
window.focusWindow = WindowManager.focusWindow;
window.minimizeWindow = minimizeWindow;
window.maximizeWindow = maximizeWindow;

export { WindowManager, minimizeWindow, maximizeWindow };
