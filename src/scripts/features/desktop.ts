import { CONFIG } from '../core/config';
import { logger } from '../utilities/logger';
import { settingsManager } from '../core/settingsmanager';

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
const SYSTEM_ICONS: any[] = [];

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

    // Clear current icons
    container.innerHTML = '';
    
    // Get positions from settings
    const savedPositions = settingsManager.getSection('desktop') || {};

    // Get files from the virtual Desktop folder
    const desktopPath = CONFIG.FS.DESKTOP;
    const desktopChildren = window.VirtualFS ? window.VirtualFS.getChildren(desktopPath) : null;

    if (!desktopChildren) {
      logger.warn('[DesktopManager] Desktop folder empty or VirtualFS not ready.');
      return;
    }

    Object.entries(desktopChildren).forEach(([name, node], index) => {
      const type = (node as any).type as 'file' | 'folder';
      const pos = savedPositions[name] || {
        left: 20,
        top: 15 + (index * CONFIG.DESKTOP_ICONS.GRID_SIZE)
      };
      
      createIcon(name, type, pos.left, pos.top);
    });

    // Add System Icons
    SYSTEM_ICONS.forEach((sys) => {
      const pos = savedPositions[sys.id] || {
        left: Math.round((container.clientWidth / 2) - 37),
        top: Math.round((container.clientHeight / 2) - 40)
      };
      
      createIcon(sys.name, 'file', pos.left, pos.top, true, sys.id, sys.icon);
    });
  }

  /**
   * Creates a single desktop icon element.
   * @param name - Display name
   * @param type - File or folder
   * @param left - X position
   * @param top - Y position
   * @param isSystem - Whether this is a protected system icon
   * @param id - Specific ID for system icons
   * @param customIcon - Path to a custom icon image
   */
  function createIcon(name: string, type: 'file' | 'folder', left: number, top: number, isSystem: boolean = false, id?: string, customIcon?: string): void {
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
    img.src = customIcon || (type === 'folder' ? '/icons/filemanager.png' : '/icons/gedit.png');
    img.alt = name;

    const span = document.createElement('span');
    span.textContent = name;

    icon.appendChild(img);
    icon.appendChild(span);

    // Events
    icon.addEventListener('pointerdown', (e) => onIconPointerDown(e, icon));
    icon.addEventListener('dblclick', () => onIconDoubleClick(name, type));
    icon.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showContextMenu(e as MouseEvent, icon);
    });

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

  function onPointerMove(e: PointerEvent): void {
    if (!isDragging || !dragTarget) return;
    
    const container = document.getElementById('desktop-icons-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Get acceleration from CSS variable
    const accelStr = getComputedStyle(document.documentElement).getPropertyValue('--mouse-acceleration');
    const acceleration = parseFloat(accelStr) || 1;

    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;

    let currentLeft = parseFloat(dragTarget.style.left || '0');
    let currentTop = parseFloat(dragTarget.style.top || '0');

    let newX = currentLeft + (deltaX * acceleration);
    let newY = currentTop + (deltaY * acceleration);

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
    
    // Save position
    savePosition(dragTarget);
    
    isDragging = false;
    dragTarget = null;
    logger.log('[DesktopManager] Icon drag finished and position saved.');
  }

  async function onIconDoubleClick(name: string, type: 'file' | 'folder'): Promise<void> {
    // Check if it's a system icon
    if (selectedIcon && selectedIcon.dataset.system === 'true') {
      const sysId = selectedIcon.dataset.id;
      const sys = SYSTEM_ICONS.find(s => s.id === sysId);
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
      if (window.openTextEditor && window.VirtualFS) {
        const node = window.VirtualFS.getNode(path);
        const content = (node && 'content' in node) ? (node as any).content : '';
        await window.openTextEditor(name, content);
      }
    }
  }

  function deselectAll(): void {
    document.querySelectorAll('.cde-desktop-icon').forEach(el => el.classList.remove('selected'));
    selectedIcon = null;
  }

  function setupGlobalEvents(): void {
    const container = document.getElementById('desktop-icons-container');
    
    document.addEventListener('pointerdown', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.cde-desktop-icon') && !target.closest('.fm-contextmenu')) {
        deselectAll();
        closeContextMenu();
      }
    });

    // Right-click on desktop background
    if (container) {
      container.addEventListener('contextmenu', (e) => {
        const target = e.target as HTMLElement;
        // If we click on the container itself or a non-icon child, show general menu
        if (target === container || !target.closest('.cde-desktop-icon')) {
          e.preventDefault();
          showContextMenu(e, null);
        }
      });
    }

    // Listen for filesystem changes to refresh icons
    window.addEventListener('cde-fs-change', () => {
      logger.log('[DesktopManager] Filesystem change detected, syncing icons...');
      syncIcons();
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
      disabled?: boolean;
      action: () => Promise<void>;
    }

    const isSystem = targetIcon?.dataset.system === 'true';

    const items: ContextMenuItem[] = targetIcon ? [
      {
        label: 'Rename',
        disabled: isSystem,
        action: async () => {
          if (isSystem) return;
          const name = targetIcon.dataset.name;
          if (!name || !window.VirtualFS) return;
          const newName = await (window as any).CDEModal.prompt('New name:', name);
          if (newName) await window.VirtualFS.rename(name, newName, CONFIG.FS.DESKTOP);
        }
      },
      {
        label: 'Delete',
        disabled: isSystem,
        action: async () => {
          if (isSystem) return;
          const name = targetIcon.dataset.name;
          if (!name || !window.VirtualFS) return;
          await window.VirtualFS.rm(name, CONFIG.FS.DESKTOP);
        }
      }
    ] : [
      {
        label: 'New File',
        action: async () => {
          if (!window.VirtualFS) return;
          const name = await (window as any).CDEModal.prompt('File name:');
          if (name) await window.VirtualFS.touch(name, CONFIG.FS.DESKTOP);
        }
      },
      {
        label: 'New Folder',
        action: async () => {
          if (!window.VirtualFS) return;
          const name = await (window as any).CDEModal.prompt('Folder name:');
          if (name) await window.VirtualFS.mkdir(name, CONFIG.FS.DESKTOP);
        }
      }
    ];

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'fm-context-item' + (item.disabled ? ' disabled' : '');
      div.textContent = item.label;
      if (!item.disabled) {
        div.addEventListener('click', () => {
          item.action();
          closeContextMenu();
        });
      }
      menu.appendChild(div);
    });

    document.body.appendChild(menu);
    activeContextMenu = menu;

    // Prevent menu from going off-screen
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 5) + 'px';
    if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 5) + 'px';
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

    const savedPositions = settingsManager.getSection('desktop') || {};
    savedPositions[id] = {
      left: parseInt(icon.style.left),
      top: parseInt(icon.style.top)
    };

    settingsManager.setSection('desktop', savedPositions);
  }

  return {
    init
  };
})();

// Expose globally
declare global {
  interface Window {
    VirtualFS: {
      getNode: (path: string) => any;
      getChildren: (path: string) => any;
      touch: (name: string, targetPath?: string) => Promise<void>;
      mkdir: (name: string, targetPath?: string) => Promise<void>;
      rm: (name: string, targetPath?: string) => Promise<void>;
      rename: (oldName: string, newName: string, targetPath?: string) => Promise<void>;
    };
  }
}

export default DesktopManager;
