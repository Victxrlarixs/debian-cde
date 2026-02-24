// src/scripts/features/desktop.ts
import { CONFIG } from '../core/config';
import { logger } from '../utilities/logger';
import { settingsManager } from '../core/settingsmanager';
import { VFS, type IVFS } from '../core/vfs';

/**
 * Interface for stored icon positions.
 * Key is the filename, value is {left, top}.
 */
interface IconPositions {
  [filename: string]: { left: number; top: number };
}

/**
 * System icons that are always present and cannot be deleted.
 */
const SYSTEM_ICONS: any[] = [
  {
    id: 'emacs-icon',
    name: 'Emacs',
    icon: '/icons/emacs22.png',
    action: () => {
      if ((window as any).Emacs?.openSplash) (window as any).Emacs.openSplash();
    },
  },
  {
    id: 'terminal-lab-icon',
    name: 'Terminal Lab',
    icon: '/icons/konsole.png',
    action: () => {
      if ((window as any).TerminalLab?.open) (window as any).TerminalLab.open();
    },
  },
];

/**
 * Desktop Manager: Handles icons, shortcuts and desktop background interactions.
 */
export const DesktopManager = (() => {
  const container = document.getElementById('desktop-icons-container');
  let icons: HTMLElement[] = [];
  let selectedIcon: HTMLElement | null = null;

  // Drag state
  let isDragging = false;
  let dragTarget: HTMLElement | null = null;
  let offsetX = 0;
  let offsetY = 0;
  let lastX = 0;
  let lastY = 0;

  // Mobile support: Tap & Long-press state
  let lastTapTime = 0;
  let longPressTimer: number | null = null;
  let tapStartX = 0;
  let tapStartY = 0;

  /**
   * Initializes the desktop icons.
   */
  async function init(): Promise<void> {
    const container = document.getElementById('desktop-icons-container');
    if (!container) {
      logger.warn('[DesktopManager] Container #desktop-icons-container not found.');
      return;
    }

    logger.log('[DesktopManager] Initializing desktop icons...');
    await syncIcons();
    setupGlobalEvents();
  }

  /**
   * Syncs icons with the virtual filesystem /home/victxrlarixs/Desktop/
   */
  async function syncIcons(): Promise<void> {
    const container = document.getElementById('desktop-icons-container');
    if (!container) return;

    // Get files from the virtual Desktop folder
    const desktopPath = CONFIG.FS.DESKTOP;
    const desktopChildren = VFS.getChildren(desktopPath) || {};
    const savedPositions = (settingsManager.getSection('desktop') as IconPositions) || {};

    // 1. Collect current DOM icons to identify what to remove
    const currentIconElements = Array.from(
      container.querySelectorAll('.cde-desktop-icon')
    ) as HTMLElement[];
    const existingNames = new Set(currentIconElements.map((el) => el.dataset.name));

    // 2. Add or update icons from VFS
    const newNames = Object.keys(desktopChildren);
    newNames.forEach((name, index) => {
      const node = desktopChildren[name];
      if (!existingNames.has(name)) {
        // Create only if it doesn't exist
        const pos = savedPositions[name] || findNextAvailableSlot();
        createIcon(name, node.type, pos.left, pos.top);
      }
    });

    // 3. Remove icons that no longer exist in VFS or System
    currentIconElements.forEach((el) => {
      const name = el.dataset.name;
      const isSystem = el.dataset.system === 'true';
      if (!isSystem && name && !desktopChildren[name]) {
        el.remove();
      }
    });

    // 4. Handle System Icons (Ensure they exist only once)
    SYSTEM_ICONS.forEach((sys) => {
      if (!container.querySelector(`[data-id="${sys.id}"]`)) {
        const pos = savedPositions[sys.id] || findNextAvailableSlot();
        createIcon(sys.name, 'file', pos.left, pos.top, true, sys.id, sys.icon);
      }
    });
  }

  /**
   * Creates a single desktop icon element.
   */
  function createIcon(
    name: string,
    type: 'file' | 'folder',
    left: number,
    top: number,
    isSystem: boolean = false,
    id?: string,
    customIcon?: string
  ): void {
    const container = document.getElementById('desktop-icons-container');
    if (!container) return;

    const icon = document.createElement('div');
    icon.className = 'cde-desktop-icon';
    icon.dataset.name = name;
    icon.dataset.type = type;
    if (isSystem) icon.dataset.system = 'true';
    if (id) icon.dataset.id = id;

    icon.style.left = left + 'px';
    icon.style.top = top + 'px';

    const img = document.createElement('img');
    img.src = customIcon || (type === 'folder' ? '/icons/filemanager.png' : '/icons/text-x-generic.png');
    img.alt = name;
    if (name === 'Emacs') {
      img.classList.add('emacs-pixelated');
    }

    const span = document.createElement('span');
    span.textContent = name;

    icon.appendChild(img);
    icon.appendChild(span);

    // Event delegation is now handled in setupGlobalEvents for efficiency
    container.appendChild(icon);
    icons.push(icon);
  }

  function onIconPointerDown(e: PointerEvent, icon: HTMLElement): void {
    e.stopPropagation();

    // Select icon
    deselectAll();
    icon.classList.add('selected');
    selectedIcon = icon;

    // Start Drag
    isDragging = true;
    dragTarget = icon;
    const rect = icon.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    lastX = e.clientX;
    lastY = e.clientY;

    icon.setPointerCapture(e.pointerId);
    icon.addEventListener('pointermove', onPointerMove);
    icon.addEventListener('pointerup', onPointerUp, { once: true });

    logger.log(`[DesktopManager] Started dragging icon: ${icon.dataset.name}`);
  }

  /**
   * Snaps a coordinate to the predefined grid.
   */
  function snapToGrid(x: number, y: number): { x: number; y: number } {
    const gridSize = CONFIG.DESKTOP_ICONS.GRID_SIZE;
    const padding = 20; // Margin from edges

    const gridX = Math.round((x - padding) / gridSize) * gridSize + padding;
    const gridY = Math.round((y - padding) / gridSize) * gridSize + padding;

    return { x: gridX, y: gridY };
  }

  /**
   * Checks if a grid slot is already occupied by another icon.
   */
  function isSlotOccupied(x: number, y: number, excludeId?: string): boolean {
    const container = document.getElementById('desktop-icons-container');
    if (!container) return false;

    const currentIcons = container.querySelectorAll('.cde-desktop-icon');
    for (const icon of Array.from(currentIcons)) {
      const el = icon as HTMLElement;
      const id = el.dataset.id || el.dataset.name;
      if (id === excludeId) continue;

      const iconX = parseInt(el.style.left);
      const iconY = parseInt(el.style.top);

      // Simple coordinate match (with small tolerance)
      if (Math.abs(iconX - x) < 5 && Math.abs(iconY - y) < 5) {
        return true;
      }
    }
    return false;
  }

  /**
   * Finds the next available empty slot in the grid (filling columns first, CDE style).
   */
  function findNextAvailableSlot(): { left: number; top: number } {
    const container = document.getElementById('desktop-icons-container');
    if (!container) return { left: 20, top: 20 };

    const gridSize = CONFIG.DESKTOP_ICONS.GRID_SIZE;
    const padding = 20;
    const height = container.offsetHeight;

    // Iterate through grid (Columns first: left-to-right, then top-to-bottom within column)
    for (let x = padding; x < container.offsetWidth - gridSize; x += gridSize) {
      for (let y = padding; y < height - gridSize; y += gridSize) {
        if (!isSlotOccupied(x, y)) {
          return { left: x, top: y };
        }
      }
    }

    return { left: padding, top: padding }; // Fallback
  }

  function onPointerMove(e: PointerEvent): void {
    if (!isDragging || !dragTarget) return;

    const container = document.getElementById('desktop-icons-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Get acceleration from CSS variable
    const accelStr = getComputedStyle(document.documentElement).getPropertyValue(
      '--mouse-acceleration'
    );
    const acceleration = parseFloat(accelStr) || 1;

    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;

    let currentLeft = parseFloat(dragTarget.style.left || '0');
    let currentTop = parseFloat(dragTarget.style.top || '0');

    let newX = currentLeft + deltaX * acceleration;
    let newY = currentTop + deltaY * acceleration;

    lastX = e.clientX;
    lastY = e.clientY;

    // Aggressive safety margin: icon cannot go near the edges (15px buffer)
    newX = Math.max(15, Math.min(newX, containerRect.width - dragTarget.offsetWidth - 15));
    newY = Math.max(15, Math.min(newY, containerRect.height - dragTarget.offsetHeight - 15));

    dragTarget.style.left = newX + 'px';
    dragTarget.style.top = newY + 'px';
  }

  function onPointerUp(e: PointerEvent): void {
    if (!isDragging || !dragTarget) return;

    dragTarget.releasePointerCapture(e.pointerId);
    dragTarget.removeEventListener('pointermove', onPointerMove);

    // Snap to grid
    const currentX = parseFloat(dragTarget.style.left);
    const currentY = parseFloat(dragTarget.style.top);
    const id = dragTarget.dataset.id || dragTarget.dataset.name;

    let { x: snappedX, y: snappedY } = snapToGrid(currentX, currentY);

    // Collision Detection: If occupied, try to find nearest empty space
    if (isSlotOccupied(snappedX, snappedY, id)) {
      logger.log(`[DesktopManager] Slot ${snappedX},${snappedY} occupied. Finding nearest...`);
      // Simple logic: if occupied, move back to original or leave as is but it's better to find nearest
      // For now, we revert or shift slightly. Let's try to revert to saved position if possible
      const savedPositions = (settingsManager.getSection('desktop') as IconPositions) || {};
      const prev = savedPositions[id || ''];
      if (prev) {
        snappedX = prev.left;
        snappedY = prev.top;
      }
    }

    dragTarget.style.left = snappedX + 'px';
    dragTarget.style.top = snappedY + 'px';

    // Save final position
    savePosition(dragTarget);

    isDragging = false;
    dragTarget = null;
    logger.log('[DesktopManager] Icon drag finished and snapped to grid.');
  }

  async function onIconDoubleClick(name: string, type: 'file' | 'folder'): Promise<void> {
    // Check if it's a system icon
    if (selectedIcon && selectedIcon.dataset.system === 'true') {
      const sysId = selectedIcon.dataset.id;
      const sys = SYSTEM_ICONS.find((s) => s.id === sysId);
      if (sys) {
        logger.log(`[DesktopManager] Launching system icon: ${sys.name}`);
        sys.action();
        return;
      }
    }

    logger.log(`[DesktopManager] Double-click on: ${name} (${type})`);
    const path = CONFIG.FS.DESKTOP + name + (type === 'folder' ? '/' : '');

    if (type === 'folder') {
      if (window.openFileManager) {
        window.openFileManager();
        if (window.openPath) window.openPath(path);
      }
    } else {
      if ((window as any).openEmacs) {
        const node = VFS.getNode(path);
        const content = node && node.type === 'file' ? node.content : '';
        await (window as any).openEmacs(name, content, path);
      }
    }
  }

  function deselectAll(): void {
    document.querySelectorAll('.cde-desktop-icon').forEach((el) => el.classList.remove('selected'));
    selectedIcon = null;
  }

  function setupGlobalEvents(): void {
    const container = document.getElementById('desktop-icons-container');
    if (!container) return;

    // --- DELEGATED ICON EVENTS ---

    container.addEventListener('pointerdown', (e) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== 'function') return;

      const icon = target.closest('.cde-desktop-icon') as HTMLElement | null;
      
      // --- MOBILE: Long-press support ---
      if (longPressTimer) clearTimeout(longPressTimer);
      tapStartX = e.clientX;
      tapStartY = e.clientY;

      longPressTimer = window.setTimeout(() => {
        // Trigger context menu if we haven't moved much and still "pressing"
        if (Math.abs(e.clientX - tapStartX) < 10 && Math.abs(e.clientY - tapStartY) < 10) {
          logger.log('[DesktopManager] Long-press detected.');
          showContextMenu(e as unknown as MouseEvent, icon);
        }
        longPressTimer = null;
      }, 500);

      // --- MOBILE: Double-tap support ---
      const now = Date.now();
      if (icon && now - lastTapTime < 300) {
        logger.log('[DesktopManager] Double-tap detected.');
        if (longPressTimer) clearTimeout(longPressTimer);
        const name = icon.dataset.name || '';
        const type = (icon.dataset.type as 'file' | 'folder') || 'file';
        onIconDoubleClick(name, type);
        lastTapTime = 0; // Reset
        return;
      }
      lastTapTime = now;

      if (icon) {
        onIconPointerDown(e, icon);
      } else {
        // Click on background
        const target = e.target as HTMLElement;
        if (!target.closest('.fm-contextmenu')) {
          deselectAll();
          closeContextMenu();
        }
      }
    });

    container.addEventListener('pointermove', (e) => {
      // Cancel long-press if user moves too much
      if (longPressTimer && (Math.abs(e.clientX - tapStartX) > 10 || Math.abs(e.clientY - tapStartY) > 10)) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    });

    container.addEventListener('pointerup', () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    });

    container.addEventListener('dblclick', (e) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== 'function') return;

      const icon = target.closest('.cde-desktop-icon') as HTMLElement | null;
      if (icon) {
        const name = icon.dataset.name || '';
        const type = (icon.dataset.type as 'file' | 'folder') || 'file';
        onIconDoubleClick(name, type);
      }
    });

    container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      const icon =
        target && typeof target.closest === 'function'
          ? (target.closest('.cde-desktop-icon') as HTMLElement | null)
          : null;

      // If we click on an icon, show its menu; otherwise show desktop menu
      showContextMenu(e, icon);
    });

    // --- GLOBAL EVENTS ---

    // Listen for filesystem changes to refresh icons
    let syncTimeout: number | null = null;
    window.addEventListener('cde-fs-change', (e: any) => {
      if (e.detail?.path === CONFIG.FS.DESKTOP) {
        if (syncTimeout) window.clearTimeout(syncTimeout);
        syncTimeout = window.setTimeout(() => {
          logger.log('[DesktopManager] Filesystem change detected, syncing icons...');
          syncIcons();
          syncTimeout = null;
        }, 50);
      }
    });
  }

  let activeContextMenu: HTMLElement | null = null;

  function showContextMenu(e: MouseEvent, targetIcon: HTMLElement | null): void {
    closeContextMenu();

    const menu = document.createElement('div');
    menu.className = 'fm-contextmenu';
    menu.style.position = 'fixed';
    menu.style.zIndex = String(CONFIG.DROPDOWN.Z_INDEX);
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';

    interface ContextMenuItem {
      label: string;
      icon?: string;
      header?: boolean;
      disabled?: boolean;
      action: () => Promise<void>;
    }

    const isSystem = targetIcon?.dataset.system === 'true';

    const items: ContextMenuItem[] = targetIcon
      ? [
          {
            label: 'Rename',
            disabled: isSystem,
            action: async () => {
              if (isSystem) return;
              const name = targetIcon.dataset.name;
              if (!name) return;
              const newName = await (window as any).CDEModal.prompt('New name:', name);
              if (newName) await VFS.rename(CONFIG.FS.DESKTOP, name, newName);
            },
          },
          {
            label: 'Delete',
            disabled: isSystem,
            action: async () => {
              if (isSystem) return;
              const name = targetIcon.dataset.name;
              if (!name) return;
              await VFS.rm(CONFIG.FS.DESKTOP, name);
            },
          },
          {
            label: 'Properties',
            action: async () => {
              const name = targetIcon.dataset.name;
              if (!name) return;
              if (isSystem) {
                const sysId = targetIcon.dataset.id;
                const path = sysId === 'emacs-icon' ? '/usr/bin/emacs' : '/usr/bin/terminal-lab';
                const { showProperties } = await import('./filemanager');
                showProperties(path);
              } else {
                const { showProperties } = await import('./filemanager');
                showProperties(CONFIG.FS.DESKTOP + name);
              }
            },
          },
        ]
      : [
          {
            label: '--- Programs ---',
            header: true,
            action: async () => {},
          },
          {
            label: 'Terminal',
            icon: '/icons/konsole.png',
            action: async () => {
              if (window.openTerminal) window.openTerminal();
            },
          },
          {
            label: 'FileManager',
            icon: '/icons/filemanager.png',
            action: async () => {
              if (window.toggleFileManager) window.toggleFileManager();
            },
          },
          {
            label: 'Emacs',
            icon: '/icons/text-x-generic.png',
            action: async () => {
              if (window.Emacs?.open) window.Emacs.open();
            },
          },
          {
            label: '--- Workspaces ---',
            header: true,
            action: async () => {},
          },
          {
            label: 'Workspace 1',
            action: async () => {
              if (window.WindowManager?.switchWorkspace) window.WindowManager.switchWorkspace('1');
            },
          },
          {
            label: 'Workspace 2',
            action: async () => {
              if (window.WindowManager?.switchWorkspace) window.WindowManager.switchWorkspace('2');
            },
          },
          {
            label: 'Workspace 3',
            action: async () => {
              if (window.WindowManager?.switchWorkspace) window.WindowManager.switchWorkspace('3');
            },
          },
          {
            label: 'Workspace 4',
            action: async () => {
              if (window.WindowManager?.switchWorkspace) window.WindowManager.switchWorkspace('4');
            },
          },
          {
            label: '--- Quick Themes ---',
            header: true,
            action: async () => {},
          },
          {
            label: 'Theme: Gold',
            action: async () => {
              if (window.styleManager) {
                window.styleManager.theme.applyPreset('gold');
                window.styleManager.theme.updateUI();
                window.styleManager.saveColor();
              }
            },
          },
          {
            label: 'Theme: Emerald',
            action: async () => {
              if (window.styleManager) {
                window.styleManager.theme.applyPreset('emerald');
                window.styleManager.theme.updateUI();
                window.styleManager.saveColor();
              }
            },
          },
          {
            label: 'Theme: Alpine',
            action: async () => {
              if (window.styleManager) {
                window.styleManager.theme.applyPreset('alpine');
                window.styleManager.theme.updateUI();
                window.styleManager.saveColor();
              }
            },
          },
          {
            label: '--- Tools ---',
            header: true,
            action: async () => {},
          },
          {
            label: 'New File',
            icon: '/icons/text-x-generic.png',
            action: async () => {
              const name = await (window as any).CDEModal.prompt('File name:');
              if (name) await VFS.touch(CONFIG.FS.DESKTOP, name);
            },
          },
          {
            label: 'New Folder',
            icon: '/icons/filemanager.png',
            action: async () => {
              const name = await (window as any).CDEModal.prompt('Folder name:');
              if (name) await VFS.mkdir(CONFIG.FS.DESKTOP, name);
            },
          },
          {
            label: 'Style Manager',
            icon: '/icons/org.xfce.settings.appearance.png',
            action: async () => {
              if (window.styleManager) window.styleManager.openMain();
            },
          },
          {
            label: 'Refresh Desktop',
            icon: '/icons/org.xfce.session.png',
            action: async () => {
              window.location.reload();
            },
          },
        ];

    items.forEach((item: any) => {
      const div = document.createElement('div');
      if (item.header) {
        div.className = 'fm-context-header';
        div.textContent = item.label;
      } else {
        div.className = 'fm-context-item' + (item.disabled ? ' disabled' : '');
        if (item.icon) {
          const img = document.createElement('img');
          img.src = item.icon;
          img.style.width = '14px';
          img.style.height = '14px';
          img.style.marginRight = '8px';
          div.appendChild(img);
        }
        const span = document.createElement('span');
        span.textContent = item.label;
        div.appendChild(span);

        if (!item.disabled) {
          div.addEventListener('click', () => {
            item.action();
            closeContextMenu();
          });
        }
      }
      menu.appendChild(div);
    });

    document.body.appendChild(menu);
    activeContextMenu = menu;

    // Prevent menu from going off-screen
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) menu.style.left = window.innerWidth - rect.width - 5 + 'px';
    if (rect.bottom > window.innerHeight)
      menu.style.top = window.innerHeight - rect.height - 5 + 'px';
  }

  function closeContextMenu(): void {
    if (activeContextMenu) {
      activeContextMenu.remove();
      activeContextMenu = null;
    }
  }

  function savePosition(icon: HTMLElement): void {
    const id = icon.dataset.id || icon.dataset.name;
    if (!id) return;

    const savedPositions = (settingsManager.getSection('desktop') as IconPositions) || {};
    savedPositions[id] = {
      left: parseInt(icon.style.left),
      top: parseInt(icon.style.top),
    };

    settingsManager.setSection('desktop', savedPositions);
  }

  return {
    init,
  };
})();

// Expose globally
export default DesktopManager;
