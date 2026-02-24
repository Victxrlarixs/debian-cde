// src/scripts/features/filemanager.ts

import { CONFIG } from '../core/config';
import { VFS, type VFSNode, type VFSFile, type VFSFolder } from '../core/vfs';
import { CDEModal } from '../ui/modals';
import { logger } from '../utilities/logger';

declare global {
  interface Window {
    openFileManager: () => void;
    closeFileManager: () => void;
    toggleFileManager: () => void;
    isFileManagerOpen: () => boolean;
    openPath: (path: string) => void;
    goBack: () => void;
    goForward: () => void;
    goUp: () => void;
    goHome: () => void;
    createFile: (name: string, content: string) => Promise<void>;
    saveFile: (path: string, content: string) => void;
    CDEModal: typeof CDEModal;
  }
}

window.VirtualFS = VFS;

export { formatSize, showProperties };

// ------------------------------------------------------------------
// INTERNAL STATE
// ------------------------------------------------------------------

let currentPath: string = CONFIG.FS.HOME;
let history: string[] = [];
let historyIndex: number = -1;
let fmSelected: string | null = null;
let showHidden: boolean = false;
let zIndex: number = CONFIG.FILEMANAGER.BASE_Z_INDEX;
let initialized: boolean = false;
let activeMenu: HTMLElement | null = null;
let activeContextMenu: HTMLElement | null = null;
let searchQuery: string = '';

// Mobile support: Tap & Long-press state
let lastTapTime = 0;
let longPressTimer: number | null = null;
let tapStartX = 0;
let tapStartY = 0;

// debounce for re-renders
let renderTimeout: number | null = null;
function debouncedRender(): void {
  if (renderTimeout) window.clearTimeout(renderTimeout);
  renderTimeout = window.setTimeout(() => {
    renderFiles();
    renderTimeout = null;
  }, 50);
}

/**
 * Listens for VFS changes and re-renders if the change affects the current path.
 */
window.addEventListener('cde-fs-change', (e: any) => {
  if (e.detail?.path === currentPath) {
    debouncedRender();
  }
});

// ------------------------------------------------------------------
// PRIVATE FUNCTIONS
// ------------------------------------------------------------------

/**
 * Renders the files in the current folder to the UI.
 */
function renderFiles(): void {
  const container = document.getElementById('fmFiles');
  const pathInput = document.getElementById('fmPath') as HTMLInputElement | null;
  const status = document.getElementById('fmStatus');

  if (!container || !pathInput || !status) return;

  pathInput.value = currentPath;
  const children = VFS.getChildren(currentPath);

  if (!children) {
    logger.warn(`[FileManager] renderFiles: path not found: ${currentPath}`);
    return;
  }

  // Filter and Sort (Folders first, then Alpha)
  let items = Object.entries(children)
    .filter(([name]) => showHidden || !name.startsWith('.'))
    .filter(([name]) => !searchQuery || name.toLowerCase().includes(searchQuery))
    .map(([name, node]) => ({ name, node }));

  items.sort((a, b) => {
    if (a.node.type === 'folder' && b.node.type === 'file') return -1;
    if (a.node.type === 'file' && b.node.type === 'folder') return 1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  renderIconView(container, items);

  status.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}${searchQuery ? ' (filtered)' : ''}`;
  renderBreadcrumbs();
}

function renderIconView(container: HTMLElement, items: { name: string; node: VFSNode }[]): void {
  const fragment = document.createDocumentFragment();
  items.forEach(({ name, node }) => {
    const div = document.createElement('div');
    div.className = 'fm-file';
    if (fmSelected === name) div.classList.add('selected');
    div.dataset.name = name;

    setupFileEvents(div, name, node);

    const img = document.createElement('img');
    img.src = node.type === 'folder' ? '/icons/filemanager.png' : '/icons/text-x-generic.png';
    img.draggable = false;

    const span = document.createElement('span');
    span.textContent = name;

    div.appendChild(img);
    div.appendChild(span);
    fragment.appendChild(div);
  });
  container.replaceChildren(fragment);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function setupFileEvents(div: HTMLElement, name: string, item: VFSNode): void {
  div.draggable = true;

  div.addEventListener('dragstart', (e) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', currentPath + name + (item.type === 'folder' ? '/' : ''));
      e.dataTransfer.effectAllowed = 'move';
    }
    div.classList.add('dragging');
  });

  div.addEventListener('dragend', () => {
    div.classList.remove('dragging');
  });

  if (item.type === 'folder') {
    div.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      div.classList.add('drag-over');
    });
    div.addEventListener('dragleave', () => {
      div.classList.remove('drag-over');
    });
    div.addEventListener('drop', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      div.classList.remove('drag-over');
      const sourcePath = e.dataTransfer?.getData('text/plain');
      if (sourcePath && sourcePath !== currentPath + name + '/') {
        const parts = sourcePath.split('/').filter(Boolean);
        const fileName = parts[parts.length - 1];
        await VFS.move(sourcePath, currentPath + name + '/' + fileName);
      }
    });
  }

  div.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.fm-file, .fm-list-item').forEach((el) => el.classList.remove('selected'));
    div.classList.add('selected');
    fmSelected = name;

    // Mobile Logic
    if (longPressTimer) clearTimeout(longPressTimer);
    tapStartX = e.clientX;
    tapStartY = e.clientY;
    longPressTimer = window.setTimeout(() => {
      if (Math.abs(e.clientX - tapStartX) < 10 && Math.abs(e.clientY - tapStartY) < 10) {
        handleContextMenu(e as unknown as MouseEvent);
      }
      longPressTimer = null;
    }, 500);

    const now = Date.now();
    if (now - lastTapTime < 300) {
      if (longPressTimer) clearTimeout(longPressTimer);
      if (item.type === 'folder') openPath(currentPath + name + '/');
      else openTextWindow(name, (item as VFSFile).content);
      lastTapTime = 0;
      return;
    }
    lastTapTime = now;
  });

  div.addEventListener('pointermove', (e) => {
    if (longPressTimer && (Math.abs(e.clientX - tapStartX) > 10 || Math.abs(e.clientY - tapStartY) > 10)) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  });

  div.addEventListener('pointerup', () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  });
}

/**
 * Navigates to the specified filesystem path.
 */
function openPath(path: string): void {
  if (!VFS.getNode(path)) {
    logger.warn(`[FileManager] openPath: path not found: ${path}`);
    return;
  }

  if (history.length > 0 && history[historyIndex] === path) return;

  history = history.slice(0, historyIndex + 1);
  history.push(path);
  historyIndex++;
  currentPath = path;
  searchQuery = ''; // Clear search on navigation
  const searchInput = document.getElementById('fmSearch') as HTMLInputElement | null;
  if (searchInput) searchInput.value = '';

  renderFiles();
}

function renderBreadcrumbs(): void {
  const container = document.getElementById('fmBreadcrumbs');
  if (!container) return;

  const parts = currentPath.split('/').filter(Boolean);
  const fragment = document.createDocumentFragment();

  // Root segment
  const root = document.createElement('span');
  root.className = 'fm-breadcrumb-segment';
  root.textContent = '/';
  root.onclick = (e) => { e.stopPropagation(); openPath('/'); };
  fragment.appendChild(root);

  let full = '/';
  parts.forEach((part, i) => {
    const sep = document.createElement('span');
    sep.className = 'fm-breadcrumb-separator';
    sep.textContent = '>';
    fragment.appendChild(sep);

    full += part + '/';
    const segment = document.createElement('span');
    segment.className = 'fm-breadcrumb-segment';
    segment.textContent = part;
    const thisPath = full;
    segment.onclick = (e) => { e.stopPropagation(); openPath(thisPath); };
    fragment.appendChild(segment);
  });

  container.replaceChildren(fragment);
}

function togglePathInput(show: boolean): void {
  const breadcrumbs = document.getElementById('fmBreadcrumbs');
  const pathInput = document.getElementById('fmPath');
  if (!breadcrumbs || !pathInput) return;

  if (show) {
    breadcrumbs.classList.add('fm-hidden');
    pathInput.classList.remove('fm-hidden');
    (pathInput as HTMLInputElement).value = currentPath;
    pathInput.focus();
  } else {
    breadcrumbs.classList.remove('fm-hidden');
    pathInput.classList.add('fm-hidden');
  }
}

/**
 * Navigates back in history.
 */
function goBack(): void {
  if (historyIndex > 0) {
    historyIndex--;
    currentPath = history[historyIndex];
    renderFiles();
  }
}

/**
 * Navigates forward in history.
 */
function goForward(): void {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    currentPath = history[historyIndex];
    renderFiles();
  }
}

/**
 * Navigates up one level.
 */
function goUp(): void {
  const parts = currentPath.split('/').filter(Boolean);
  if (parts.length > 0) {
    parts.pop();
    const parent = '/' + parts.join('/') + (parts.length > 0 ? '/' : '');
    if (VFS.getNode(parent)) {
      openPath(parent);
    }
  }
}

/**
 * Navigates to home.
 */
function goHome(): void {
  openPath(CONFIG.FS.HOME);
}

// ------------------------------------------------------------------
// OPERATIONS
// ------------------------------------------------------------------

async function touch(name: string): Promise<void> {
  await VFS.touch(currentPath, name);
}

async function mkdir(name: string): Promise<void> {
  await VFS.mkdir(currentPath, name);
}

async function rm(name: string): Promise<void> {
  if (!name) return;
  const isTrash = currentPath.includes('/.trash/');
  const msg = isTrash ? `Permanently delete ${name}?` : `Move ${name} to Trash?`;
  const confirmed = await CDEModal.confirm(msg);
  if (confirmed) {
    if (isTrash) await VFS.rm(currentPath, name);
    else await VFS.moveToTrash(currentPath + name + (VFS.getNode(currentPath + name + '/') ? '/' : ''));
    fmSelected = null;
  }
}

async function emptyTrash(): Promise<void> {
  const confirmed = await CDEModal.confirm('Permanently delete all items in Trash?');
  if (confirmed) {
    const trashPath = CONFIG.FS.HOME + '.trash/';
    const trash = VFS.getChildren(trashPath);
    if (trash) {
      for (const name of Object.keys(trash)) {
        await VFS.rm(trashPath, name);
      }
    }
  }
}

async function restore(name: string): Promise<void> {
  await VFS.restoreFromTrash(name);
  fmSelected = null;
}

async function rename(oldName: string, newName: string): Promise<void> {
  await VFS.rename(currentPath, oldName, newName);
  fmSelected = null;
}

async function openTextWindow(name: string, content: string): Promise<void> {
  if (window.openEmacs) {
    await window.openEmacs(name, content);
  }
}

async function showProperties(fullPath: string): Promise<void> {
  const node = VFS.getNode(fullPath + (VFS.getNode(fullPath + '/') && !fullPath.endsWith('/') ? '/' : ''));
  if (!node) return;

  const parts = fullPath.split('/').filter(Boolean);
  const name = parts[parts.length - 1] || '/';
  const meta = (node as any).metadata;
  const sizeStr = node.type === 'folder' ? '--' : formatSize(meta?.size || 0);
  const dateStr = meta?.mtime ? new Date(meta.mtime).toLocaleString() : 'Unknown';

  const html = `
    <div class="fm-properties">
      <div style="display: flex; gap: 15px; margin-bottom: 10px;">
        <img src="${node.type === 'folder' ? '/icons/filemanager.png' : '/icons/text-x-generic.png'}" style="width: 48px; height: 48px;" />
        <div>
          <b style="font-size: 14px;">${name}</b><br/>
          <span style="color: #666;">Type: ${node.type}</span>
        </div>
      </div>
      <hr style="border: none; border-top: 1px solid #ccc; margin: 10px 0;"/>
      <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
        <tr><td style="padding: 2px 0; color: #555;">Path:</td><td>${fullPath}</td></tr>
        <tr><td style="padding: 2px 0; color: #555;">Size:</td><td>${sizeStr}</td></tr>
        <tr><td style="padding: 2px 0; color: #555;">Modified:</td><td>${dateStr}</td></tr>
        <tr><td style="padding: 2px 0; color: #555;">Owner:</td><td>${meta?.owner || 'victx'}</td></tr>
        <tr><td style="padding: 2px 0; color: #555;">Permissions:</td><td><code>${meta?.permissions || (node.type === 'folder' ? 'rwxr-xr-x' : 'rw-r--r--')}</code></td></tr>
      </table>
    </div>
  `;

  CDEModal.open(`Properties: ${name}`, html, [{ label: 'Close', value: true, isDefault: true }]);
}

// ------------------------------------------------------------------
// MENUS
// ------------------------------------------------------------------

interface MenuItem {
  label: string;
  action: () => Promise<void> | void;
}

const fmMenus: Record<string, MenuItem[]> = {
  File: [
    {
      label: 'New File',
      action: async () => {
        const name = await CDEModal.prompt('File name:');
        if (name) await touch(name);
      },
    },
    {
      label: 'New Folder',
      action: async () => {
        const name = await CDEModal.prompt('Folder name:');
        if (name) await mkdir(name);
      },
    },
    {
      label: 'Empty Trash',
      action: emptyTrash,
    },
  ],
  Edit: [
    {
      label: 'Rename',
      action: async () => {
        if (!fmSelected) return;
        const newName = await CDEModal.prompt('New name:', fmSelected);
        if (newName) await rename(fmSelected, newName);
      },
    },
  ],
  View: [
    {
      label: 'Show Hidden Files',
      action: () => {
        showHidden = !showHidden;
        renderFiles();
      },
    },
    {
      label: 'Refresh',
      action: () => renderFiles(),
    },
  ],
  Go: [
    { label: 'Back', action: goBack },
    { label: 'Forward', action: goForward },
    { label: 'Up', action: goUp },
    { label: 'Home', action: goHome },
  ],
  Places: [
    {
      label: 'Settings',
      action: () => openPath(CONFIG.FS.HOME + 'settings/'),
    },
    {
      label: 'Manual Pages',
      action: () => openPath(CONFIG.FS.HOME + 'man-pages/'),
    },
    {
      label: 'Desktop',
      action: () => openPath(CONFIG.FS.DESKTOP),
    },
  ],
};

function setupMenuBar(): void {
  const menuBar = document.querySelector('.fm-menubar');
  if (!menuBar) return;

  menuBar.querySelectorAll('span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();

      const name = span.textContent?.trim() || '';
      let items = fmMenus[name];

      // Conditional items: Empty Trash only in trash
      if (name === 'File') {
        // Robust check for trash path (ignoring trailing slashes)
        const normalize = (p: string) => p.endsWith('/') ? p : p + '/';
        const isTrash = normalize(currentPath) === normalize(CONFIG.FS.TRASH);
        items = items.filter(item => item.label !== 'Empty Trash' || isTrash);
      }

      if (!items || items.length === 0) return;

      const menu = document.createElement('div');
      menu.className = 'fm-dropdown';
      menu.style.zIndex = String(CONFIG.DROPDOWN.Z_INDEX);

      items.forEach((item) => {
        const option = document.createElement('div');
        option.className = 'fm-dropdown-item';
        option.textContent = item.label;
        option.addEventListener('click', async () => {
          await item.action();
          closeMenu();
        });
        menu.appendChild(option);
      });

      document.body.appendChild(menu);
      const rect = span.getBoundingClientRect();
      menu.style.left = rect.left + 'px';
      menu.style.top = rect.bottom + 'px';
      activeMenu = menu;
    });
  });
}

function closeMenu(): void {
  if (activeMenu) {
    activeMenu.remove();
    activeMenu = null;
  }
}

function handleContextMenu(e: MouseEvent): void {
  e.preventDefault();
  if (activeContextMenu) activeContextMenu.remove();

  const target = e.target as HTMLElement;
  const fileEl =
    target && typeof target.closest === 'function'
      ? (target.closest('.fm-file') as HTMLElement | null)
      : null;

  const menu = document.createElement('div');
  menu.className = 'fm-contextmenu';
  menu.style.zIndex = String(CONFIG.DROPDOWN.Z_INDEX);

  let items: MenuItem[] = [];

  if (fileEl) {
    const name = fileEl.dataset.name;
    if (!name) return;

    fmSelected = name;
    document.querySelectorAll('.fm-file').forEach((el) => el.classList.remove('selected'));
    fileEl.classList.add('selected');

    const isTrashDir = currentPath.includes('/.trash/');
    
    items = [
      {
        label: isTrashDir ? 'Restore' : 'Open',
        action: () => {
          if (isTrashDir) {
            restore(name);
          } else {
            const item = VFS.getNode(
              currentPath + name + (VFS.getNode(currentPath + name + '/') ? '/' : '')
            );
            if (item) {
              if (item.type === 'folder') openPath(currentPath + name + '/');
              else openTextWindow(name, (item as VFSFile).content);
            }
          }
        },
      },
      {
        label: 'Rename',
        action: async () => {
          const newName = await CDEModal.prompt('New name:', name);
          if (newName) await rename(name, newName);
        },
      },
      {
        label: 'Properties',
        action: () => showProperties(currentPath + name),
      },
      {
        label: 'Delete',
        action: () => rm(name),
      },
    ];
  } else {
    items = fmMenus['File'];
  }

  items.forEach((item) => {
    const option = document.createElement('div');
    option.className = 'fm-context-item';
    option.textContent = item.label;
    option.addEventListener('click', async () => {
      await item.action();
      menu.remove();
    });
    menu.appendChild(option);
  });

  document.body.appendChild(menu);
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  activeContextMenu = menu;
}

// ------------------------------------------------------------------
// INIT & EXPOSURE
// ------------------------------------------------------------------

function initFileManager(): void {
  if (initialized) return;

  setupMenuBar();
  const fmFiles = document.getElementById('fmFiles');
  if (fmFiles) {
    fmFiles.addEventListener('contextmenu', handleContextMenu);
    
    // Drop on background to move to current dir
    fmFiles.addEventListener('dragover', (e) => e.preventDefault());
    fmFiles.addEventListener('drop', async (e) => {
      const sourcePath = e.dataTransfer?.getData('text/plain');
      if (sourcePath) {
        const parts = sourcePath.split('/').filter(Boolean);
        const fileName = parts[parts.length - 1];
        const newPath = currentPath + fileName + (sourcePath.endsWith('/') ? '/' : '');
        if (sourcePath !== newPath) {
          await VFS.move(sourcePath, newPath);
        }
      }
    });
  }

  document.addEventListener('click', () => {
    closeMenu();
    if (activeContextMenu) {
      activeContextMenu.remove();
      activeContextMenu = null;
    }
  });

  const pathInput = document.getElementById('fmPath') as HTMLInputElement | null;
  if (pathInput) {
    pathInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        openPath(pathInput.value);
        togglePathInput(false);
      }
      if (e.key === 'Escape') togglePathInput(false);
    });
    pathInput.addEventListener('blur', () => togglePathInput(false));
  }

  const pathContainer = document.getElementById('fmPathContainer');
  if (pathContainer) {
    pathContainer.addEventListener('click', () => togglePathInput(true));
  }

  const searchInput = document.getElementById('fmSearch') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase();
      renderFiles();
    });
  }

  initialized = true;
  logger.log('[FileManager] Initialized');
}

// ------------------------------------------------------------------
// EXPOSURE
// ------------------------------------------------------------------

window.openFileManager = () => {
  const win = document.getElementById('fm');
  if (win) {
    win.style.display = 'flex';
    win.style.zIndex = String(++zIndex);
    if (window.AudioManager) window.AudioManager.windowOpen();
    initFileManager();
    openPath(currentPath);
    if (window.focusWindow) window.focusWindow('fm');
  }
};

window.closeFileManager = () => {
  const win = document.getElementById('fm');
  if (win) {
    win.style.display = 'none';
    if (window.AudioManager) window.AudioManager.windowClose();
  }
};

window.toggleFileManager = () => {
  const win = document.getElementById('fm');
  if (win?.style.display === 'none' || !win?.style.display) window.openFileManager();
  else window.closeFileManager();
};

window.isFileManagerOpen = () => {
  const win = document.getElementById('fm');
  return !!win && win.style.display !== 'none';
};

window.openPath = openPath;
window.goBack = goBack;
window.goForward = goForward;
window.goUp = goUp;
window.goHome = goHome;

window.createFile = async (name, content) => {
  await VFS.touch(currentPath, name);
  const node = VFS.getNode(currentPath + name) as VFSFile;
  if (node) node.content = content;
};

window.saveFile = (path, content) => {
  const node = VFS.getNode(path);
  if (node?.type === 'file') {
    node.content = content;
    logger.log(`[FileManager] Saved: ${path}`);
  }
};

export const FileManager = {
  init: initFileManager,
  open: window.openFileManager,
  close: window.closeFileManager,
  toggle: window.toggleFileManager,
  isOpen: window.isFileManagerOpen,
  openPath: openPath,
};

logger.log('[FileManager] Module loaded');
